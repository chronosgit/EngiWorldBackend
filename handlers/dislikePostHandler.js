const Models = require("../models");

const handlePostDislike = async (req, res) => {
    try {
        const dislikingUser = await Models.User.findOne({email: req.user.email});
        const dislikedPost = await Models.Post.findById({_id: req.params.postId});
        if(dislikedPost.dislikes.includes(dislikingUser._id)) {
            // dislikedPost.likes = [];
            // dislikedPost.dislikes = [];
            // dislikedPost.save();
            return res.status(400).send({error: "The post has already been disliked by the user"});
        } else if(dislikedPost.likes.includes(dislikingUser._id)){
            await Models.Post.updateOne(
                {_id: req.params.postId}, 
                {
                    $pullAll: {
                        likes: [{_id: dislikingUser._id}],
                    },
                }
            );
        }

        dislikedPost.dislikes.push(dislikingUser);
        dislikedPost.save();

        res.sendStatus(200);
    } catch(error) {
        res.status(404).send({error: "Disliking the post resulted in error"});
    }
};

module.exports = handlePostDislike;