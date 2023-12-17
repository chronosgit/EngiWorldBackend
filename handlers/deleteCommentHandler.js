const Models = require("../models");

const handleDeleteComment = async (req, res) => {
    try {
        const {postId, commentId} = req.params;

        const thisPostAuthor = await Models.Post.findById({_id: postId}).author;
        await Models.Notification.deleteOne({receiver: thisPostAuthor, comment: commentId, type: "comment"});

        await Models.Comment.deleteOne({_id: commentId});
        await Models.Post.findByIdAndUpdate({_id: postId}, {$pull: {comments: commentId}});

        res.sendStatus(200);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Deleting the comment resulted in error"});
    }
};

module.exports = handleDeleteComment;