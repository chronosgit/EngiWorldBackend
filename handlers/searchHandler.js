const Models = require("../models");

const handleSearch = async (req, res) => {
    try {
        const searchQuery = req.query.newValue;

        if(searchQuery === "") { // empty query MUST be handled in client
            return res.sendStatus(204); 
        }

        if(typeof(searchQuery) !== "string") {
            return res.sendStatus(500);
        }

        const data = [];
        const usersSearchCriteria = {
            $or: [
                {username: { $regex: new RegExp(searchQuery, 'i') }},
            ],
        };
        const correspondingUsers = await Models.User.find(usersSearchCriteria);
        const postsSearchCriteria = {
            $or: [
                {title: { $regex: new RegExp(searchQuery, 'i') }},
            ],
        };
        const correspondingPosts = await Models.Post.find(postsSearchCriteria);
        data.push(...correspondingUsers, ...correspondingPosts);

        const formattedData = [];
        for(let i = 0; i < data.length; i++) {
            const document = data[i];
            const type = document.username ? "user" : "post";
            const value = document.username ? document?.username : document?.title;

            formattedData.push({
                id: document._id,
                type: type,
                value: value,
            });
        }
        
        res.json(formattedData);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Search resulted in error"});
    }
};

module.exports = handleSearch;