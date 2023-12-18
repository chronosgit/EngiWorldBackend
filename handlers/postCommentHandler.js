const Models = require("../models");

const handlePostComment = async (req, res) => {
    try {
        const user = await Models.User.findOne({email: req.user.email});
        const post = await Models.Post.findById({_id: req.body.postId});

        const newComment = new Models.Comment(
            {
                author: user._id,
                authorUsername: user.username,
                commentedPost: post,
                text: req.body.comment,
                isEdited: false,
                date: new Date(),
            }
        );
        await newComment.save();

        if(user.username !== post.authorUsername) {
            const newNotification = new Models.Notification(
                {
                    sender: user,
                    senderUsername: user.username,
                    receiver: post.author,
                    receiverUsername: post.authorUsername,
                    post: post,
                    postTitle: post.title,
                    comment: newComment,
                    type: "comment",
                    message: `${user.username} commented on your post.`,
                    date: new Date(),
                }
            );
            await newNotification.save();
        }

        await Models.Post.findOneAndUpdate({_id: post._id}, {$push: {comments: newComment._id.toString()}});

        res.json(newComment);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Posting a comment resulted in error"});
    }
};

module.exports = handlePostComment;