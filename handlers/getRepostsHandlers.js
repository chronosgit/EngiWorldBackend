const Models = require("../models");

const handleRepostsGet = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await Models.User.findById({_id: userId});
        const userRepostsId = user.reposts;

        const data = [];
        for(let i = 0; i < userRepostsId.length; i++) {
            const userRepost = await Models.Post.findById({_id: userRepostsId[i]});
            data.push(userRepost);
        }

        res.json({data});
    } catch(error) {
        res.status(500).send({error: "Getting the user's reposts resulted in error"})
    }
};

module.exports = handleRepostsGet;