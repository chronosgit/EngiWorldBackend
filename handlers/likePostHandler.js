const Models = require("../models");

const handlePostLike = async (req, res) => {
    try {
        const likingUser = await Models.User.findOne({email: req.user.email});
        const likedPost = await Models.Post.findById({_id: req.params.postId});
        
        if(likedPost.likes.includes(likingUser._id)) {
            return res.status(400).send({error: "The post has already been liked by the user"});
        } else if(likedPost.dislikes.includes(likingUser._id)){
            await Models.Post.updateOne(
                {_id: req.params.postId}, 
                {
                    $pullAll: {
                        dislikes: [{_id: likingUser._id}],
                    },
                }
            );
        }

        likedPost.likes.push(likingUser);
        likedPost.save();

        res.sendStatus(200);
    } catch(error) {
        res.status(404).send({error: "Liking the post resulted in error"});
    }
};

module.exports = handlePostLike;