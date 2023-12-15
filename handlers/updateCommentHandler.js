const Models = require("../models");

const handleUpdateComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const updatedComment = await Models.Comment.findById({_id: commentId});

        const requestingUser = await Models.User.findOne({email: req.user.email});
        if(updatedComment.author == requestingUser._id) {
            return res.status(403).send({error: "You don't have right for updating this post"});
        }
    
        updatedComment.text = req.body.comment;
        updatedComment.date = new Date();
        updatedComment.isEdited = true;
        await updatedComment.save();
    
        res.json(updatedComment);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Updating the comment resulted in error"});
    }
};

module.exports = handleUpdateComment;