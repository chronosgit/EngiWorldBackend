const Models = require("../models");

const handlePostLike = async (req, res) => {
    try {
        const likingUser = await Models.User.findOne({email: req.user.email});
        const likedPost = await Models.Post.findById({_id: req.body.postId});
        
        if(likedPost.likes.includes(likingUser._id) || likingUser.likes.includes(likedPost._id)) {
            return res.status(400).send({error: "The post has already been liked by the user"});
        }
        if(likedPost.dislikes.includes(likingUser._id)){
            await Models.Post.updateOne(
                {_id: likedPost._id}, 
                {
                    $pullAll: {
                        dislikes: [{_id: likingUser._id}],
                    },
                }
            );
        }
        if(likingUser.dislikes.includes(likedPost._id)){
            await Models.User.updateOne(
                {_id: likingUser._id}, 
                {
                    $pullAll: {
                        dislikes: [{_id: likedPost._id}],
                    },
                }
            );
        }

        likingUser.likes.push(likedPost);
        likedPost.likes.push(likingUser);
        likingUser.save();
        likedPost.save();

        res.sendStatus(200);
    } catch(error) {
        res.status(404).send({error: "Liking the post resulted in error"});
    }
};

module.exports = handlePostLike;