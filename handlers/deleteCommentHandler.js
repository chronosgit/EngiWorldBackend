const Models = require("../models");

const handleDeleteComment = async (req, res) => {
    try {
        const {postId, commentId} = req.params;

        const deletedComment = await Models.Comment.findById({_id: commentId});

        await Models.Notification.deleteMany({comment: deletedComment});

        await Models.Comment.deleteOne({_id: commentId});
        await Models.Post.findByIdAndUpdate({_id: postId}, {$pull: {comments: commentId}});

        res.sendStatus(200);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Deleting the comment resulted in error"});
    }
};

module.exports = handleDeleteComment;