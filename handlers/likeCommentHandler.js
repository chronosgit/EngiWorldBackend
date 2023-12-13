const Models = require("../models");

const handleLikeComment = async (req, res) => {
    try {
        const likingUser = await Models.User.findOne({email: req.user.email});
        const likedComment = await Models.Comment.findById({_id: req.body.commentId});

        console.log(likedComment, likingUser);

        if(likedComment.likes.length > 0) {
            if(likedComment.likes.includes(likingUser._id)) {
                await Models.Comment.findByIdAndUpdate({_id: likedComment._id}, {$pull: {likes: likingUser._id}});

                return res.sendStatus(200);
            }
        }

        likedComment.likes.push(likingUser);

        await likedComment.save();

        res.sendStatus(200);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Liking the comment resulted in error"});
    }
};

module.exports = handleLikeComment;