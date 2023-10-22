const Models = require("../models");

const handleFollow = async (req, res) => {
    try {
        const targetedUser = await Models.User.findById({_id: req.body.userId});
        const followingUser = await Models.User.findOne({email: req.user.email});

        if(req.body.operationType === "follow") {
            if(followingUser.follows.includes(req.body.userId)) {
                return res.status(400).send({error: "The user is already followed by you"});
            }
    
            followingUser.follows.push(targetedUser);
            followingUser.save();
    
            res.sendStatus(200);
        } else if(req.body.operationType === "unfollow") {
            if(!followingUser.follows.includes(req.body.userId)) {
                return res.status(400).send({error: "The user hasn't been followed by you"});
            }

            await Models.User.updateOne(
                {_id: followingUser._id}, 
                {
                    $pullAll: {
                        follows: [{_id: req.body.userId}],
                    },
                }
            );

            res.sendStatus(200);
        } else {
            res.status(400).send({error: "Wrong operationType in post request"});
        }
    } catch(error) {
        res.status(404).send({error: "Following resulted in error"});
    }
};

module.exports = handleFollow;