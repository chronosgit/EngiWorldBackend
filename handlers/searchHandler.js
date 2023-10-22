const Models = require("../models");

const handleSearch = async (req, res) => {
    try {
        const searchQuery = req.query.searchQuery;

        if(searchQuery === "") { // empty query MUST be handled in client
            return res.sendStatus(204); 
        }

        const data = [];
        var regexQuery = {
            username: new RegExp(req.query.searchQuery, "i"),
            title: new RegExp(req.query.searchQuery, "i"),
        }

        const correspondingUsers = await Models.User.find(
            {
                username: {"$regex": searchQuery, "$options": "i"}
            },
            "_id email username hasProfilePic follows reposts profilePic likes dislikes allowed bio"
        );
        const correspondingPosts = await Models.Post.find(
            {
                title: {"$regex": searchQuery, "$options": "i"}
            }
        );
        data.push(...correspondingUsers, ...correspondingPosts);

        res.json({data});
    } catch(error) {
        res.status(404).send({error: "Search resulted in error"});
    }
};

module.exports = handleSearch;