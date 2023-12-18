const Models = require("../models");

const handleGettingFollows = async (req, res) => {
    try {
        const start = 1;
        const end = parseInt(req.query.end);
        const userId = req.params.userId;

        const user = await Models.User.findById({_id: userId});
        const recentFollowsId = user.follows;
        const recentFollows = [];
        for(let i = 0; i < recentFollowsId.length; i++) {
            const recentFollow = await Models.User.findById({_id: recentFollowsId[i]});
            recentFollows.push(recentFollow);
        }

        let follows = [];
        if(end - start + 1 >= recentFollows.length) {
            follows = recentFollows;
        } else {
            follows = recentFollows.slice(start - 1, end);
        }

        const data = [];
        for(let i = 0; i < follows.length; i++) {
            const profilePicBuffer = follows[i].hasProfilePic ? follows[i].profilePic : follows[i].defaultProfilePic; 
            const profilePicBase64 = Buffer.from(profilePicBuffer.data, "base64").toString("base64");

            data.push({
                id: follows[i]._id,
                username: follows[i].username,
                profilePic: profilePicBase64,
            });
        }
        
        res.json(data);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Getting the comment resulted in error"});
    }
};

module.exports = handleGettingFollows;