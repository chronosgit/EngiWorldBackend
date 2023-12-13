const Models = require("../models");

const handleRepost = async (req, res) => {
    try {
        const repostingUser = await Models.User.findOne({email: req.user.email});
        const repostedPost = await Models.Post.findById({_id: req.body.postId});

        if(repostingUser.reposts.length > 0) {
            if(repostingUser.reposts.includes(repostedPost._id)) {
                await Models.User.findByIdAndUpdate({_id: repostingUser._id}, {$pull: {reposts: repostedPost._id}});

                return res.sendStatus(200);
            }
        }

        repostingUser.reposts.push(repostedPost);

        await repostingUser.save();

        res.sendStatus(200);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Reposting the post resulted in error"});
    }
};

module.exports = handleRepost;