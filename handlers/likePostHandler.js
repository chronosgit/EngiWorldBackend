const Models = require("../models");

const handlePostLike = async (req, res) => {
    try {
        const likingUser = await Models.User.findOne({email: req.user.email});
        const likedPost = await Models.Post.findById({_id: req.body.postId});

        if(likedPost.likes.length > 0 || likingUser.likes.length > 0) {
            if(likedPost.likes.includes(likingUser._id) || likingUser.likes.includes(likedPost._id)) {
                await Models.User.findByIdAndUpdate({_id: likingUser._id}, {$pull: {likes: likedPost._id}});
                await Models.Post.findByIdAndUpdate({_id: likedPost._id}, {$pull: {likes: likingUser._id}});

                return res.sendStatus(200);
            }
        }

        likingUser.likes.push(likedPost);
        likedPost.likes.push(likingUser);

        await likingUser.save();
        await likedPost.save();

        res.sendStatus(200);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Liking the post resulted in error"});
    }
};

module.exports = handlePostLike;