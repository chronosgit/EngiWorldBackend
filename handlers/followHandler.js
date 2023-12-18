const Models = require("../models");

const handleFollow = async (req, res) => {
    try {
        const targetedUser = await Models.User.findById({_id: req.body.userId});
        const followingUser = await Models.User.findOne({email: req.user.email});

        if(targetedUser === followingUser) {
            return res.status(400).send({error: "You can't follow yourself"});
        }

        if(followingUser.follows.includes(req.body.userId)) { // already followed
            await Models.User.updateOne(
                {_id: followingUser._id}, 
                {
                    $pullAll: {
                        follows: [{_id: req.body.userId}],
                    },
                }
            );

            await Models.Notification.deleteOne({sender: followingUser, receiver: targetedUser, type: "follow"});
        } else { // follow
            await Models.User.findByIdAndUpdate(followingUser._id, {$push: {follows: targetedUser}});

            const newNotification = new Models.Notification(
                {
                    sender: followingUser,
                    senderUsername: followingUser.username,
                    receiver: targetedUser,
                    receiverUsername: targetedUser.username,
                    type: "follow",
                    message: `${followingUser.username} followed you.`,
                    date: new Date(),
                }
            );
            await newNotification.save();
        }

        res.sendStatus(200);
    } catch(error) {
        res.status(500).send({error: "Following resulted in error"});
    }
};

module.exports = handleFollow;