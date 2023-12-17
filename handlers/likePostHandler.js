const Models = require("../models");

const handlePostLike = async (req, res) => {
    try {
        const likingUser = await Models.User.findOne({email: req.user.email});
        const likedPost = await Models.Post.findById({_id: req.body.postId});

        if(likedPost.likes.length > 0 || likingUser.likes.length > 0) {
            if(likedPost.likes.includes(likingUser._id) || likingUser.likes.includes(likedPost._id)) {
                await Models.User.findByIdAndUpdate({_id: likingUser._id}, {$pull: {likes: likedPost._id}});
                await Models.Post.findByIdAndUpdate({_id: likedPost._id}, {$pull: {likes: likingUser._id}});

                return res.status(200).send({status: "unliked"});
            }
        }

        await Models.User.findOneAndUpdate({_id: likingUser._id}, {$push: {likes: likedPost}});
        await Models.Post.findOneAndUpdate({_id: likedPost._id}, {$push: {likes: likingUser}});

        const newNotification = new Models.Notification(
            {
                sender: likingUser,
                senderUsername: likingUser.username,
                receiver: likedPost.author,
                receiverUsername: likedPost.authorUsername,
                post: likedPost,
                postTitle: likedPost.title,
                type: "post",
                typeOperation: "like",
                date: new Date(),
                isRead: false,
            }
        );
        await newNotification.save();

        res.status(200).send({status: "liked"});
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Liking the post resulted in error"});
    }
};

module.exports = handlePostLike;