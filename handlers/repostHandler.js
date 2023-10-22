const Models = require("../models");

const handleRepost = async (req, res) => {
    const {postId, operationType} = req.body;

    try {
        const repostingUser = await Models.User.findOne({email: req.user.email});
        const repostedPost = await Models.Post.findById({_id: postId});

        if(operationType === "makeRepost") {
            if(repostingUser.reposts.includes(postId)) {
                res.status(400).send({message: "Such post has already been reposted"});
            } else {
                repostingUser.reposts.push(repostedPost);
                repostingUser.save();

                res.sendStatus(200);
            }
        } else if(operationType === "cancelRepost") {
            if(!repostingUser.reposts.includes(postId)) {
                res.status(400).send({message: "Such post hasn't been reposted by the user"});
            } else {
                repostingUser.reposts = repostingUser.reposts.filter(repost => {
                    if(repost._id == postId) {
                        return false;
                    } else {
                        return true;
                    }
                })
                repostingUser.save();
                
                res.sendStatus(200);
            }
        } else {
            res.status(400).send({error: "Wrong operationType in post request"});
        }
    } catch(error) {
        res.status(404).send({error: "Handling the request resulted in error"});
    }
};

module.exports = handleRepost;