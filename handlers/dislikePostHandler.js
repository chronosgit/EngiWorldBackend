const Models = require("../models");

const handlePostDislike = async (req, res) => {
    try {
        const dislikingUser = await Models.User.findOne({email: req.user.email});
        const dislikedPost = await Models.Post.findById({_id: req.body.postId});
        if(dislikedPost.dislikes.includes(dislikingUser._id) || dislikingUser.dislikes.includes(dislikedPost._id)) {
            return res.status(400).send({error: "The post has already been disliked by the user"});
        }
        if(dislikedPost.likes.includes(dislikingUser._id)){
            await Models.Post.updateOne(
                {_id: dislikedPost._id}, 
                {
                    $pullAll: {
                        likes: [{_id: dislikingUser._id}],
                    },
                }
            );
        }
        if(dislikingUser.likes.includes(dislikedPost._id)){
            await Models.User.updateOne(
                {_id: dislikingUser._id}, 
                {
                    $pullAll: {
                        likes: [{_id: dislikedPost._id}],
                    },
                }
            );
        }
        dislikedPost.dislikes.push(dislikingUser);
        dislikingUser.dislikes.push(dislikedPost);
        dislikedPost.save();
        dislikingUser.save();

        res.sendStatus(200);
    } catch(error) {
        res.status(404).send({error: "Disliking the post resulted in error"});
    }
};

module.exports = handlePostDislike;