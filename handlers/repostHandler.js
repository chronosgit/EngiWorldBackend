const Models = require("../models");

const handleRepost = async (req, res) => {
    try {
        const repostingUser = await Models.User.findOne({email: req.user.email});
        const repostedPost = await Models.Post.findById({_id: req.body.postId});

        let isUnreposted = false;

        if(repostingUser.reposts.length > 0) {
            if(repostingUser.reposts.includes(repostedPost._id)) {
                await Models.User.findByIdAndUpdate({_id: repostingUser._id}, {$pull: {reposts: repostedPost._id}});
                isUnreposted = true;
            }
        }

        if(repostedPost.reposts.length > 0) {
            if(repostedPost.reposts.includes(repostingUser._id)) {
                await Models.Post.findByIdAndUpdate({_id: repostedPost._id}, {$pull: {reposts: repostingUser._id}});
                isUnreposted = true;
            }
        }

        if(isUnreposted) {
            return res.sendStatus(200);
        }

        await Models.User.findOneAndUpdate({_id: repostingUser._id}, {$push: {reposts: repostedPost}});
        await Models.Post.findOneAndUpdate({_id: repostedPost._id}, {$push: {reposts: repostingUser}});
        

        await repostingUser.save();
        await repostedPost.save();

        res.sendStatus(200);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Reposting the post resulted in error"});
    }
};

module.exports = handleRepost;