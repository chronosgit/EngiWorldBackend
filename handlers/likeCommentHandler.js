const Models = require("../models");

const handleLikeComment = async (req, res) => {
    try {
        const likingUser = await Models.User.findOne({email: req.user.email});
        const likedComment = await Models.Comment.findById({_id: req.body.commentId});

        if(likedComment.likes.length > 0) {
            if(likedComment.likes.includes(likingUser._id)) {
                await Models.Comment.findByIdAndUpdate({_id: likedComment._id}, {$pull: {likes: likingUser._id}});

                return res.status(200).json({status: "unliked"});
            }
        }

        if(likingUser.username !== likedComment.authorUsername) {
            const newNotification = new Models.Notification(
                {
                    sender: likingUser,
                    senderUsername: likingUser.username,
                    receiver: likedComment.author,
                    receiverUsername: likedComment.authorUsername,
                    post: likedComment.commentedPost,
                    postTitle: likedComment.commentedPost.title,
                    comment: likedComment,
                    type: "comment",
                    message: `${likingUser.username} liked your comment under ${likedComment.authorUsername}'s post.`,
                    date: new Date(),
                }
            );
            await newNotification.save();
        }

        await Models.Comment.findOneAndUpdate({_id: likedComment._id}, {$push: {likes: likingUser}});

        res.status(200).json({status: "liked"});
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Liking the comment resulted in error"});
    }
};

module.exports = handleLikeComment;