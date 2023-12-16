const Models = require("../models");

const handleGettingFilteredPosts = async (req, res) => {
    try {
        const filter = req.params.filter;
        const start = 1 // parseInt(req.query.start);
        const end = parseInt(req.query.end);

        let posts = [];
        if(filter === "time") {
            posts = await Models.Post.find().sort({created_at: -1});
        } else if(filter === "likes") {
            posts = await Models.Post.find().sort({likes: -1});
        } else if(filter === "reposts") {
            posts = await Models.Post.find().sort({reposts: -1});
        } else {
            return res.status(500).send({error: "The filter option for getting posts is wrong"});
        }
        
        if(end - start + 1 >= posts.length) {
            posts = posts;
        } else {
            posts = posts.slice(start - 1, end);
        }

        const data = [];
        for(let i = 0; i < posts.length; i++) {
            data.push({
                id: posts[i]._id,
                author: posts[i].author,
                authorUsername: posts[i].authorUsername,
                isEdited: posts[i].isEdited,
                title: posts[i].title,
                topic: posts[i].topic,
                text: posts[i].text,
                date: posts[i].date,
                comments: posts[i].comments,
                likes: posts[i].likes,
                reposts: posts[i].reposts,
            })
        }

        res.json(data);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Getting the posts resulted in error"});
    }
};

module.exports = handleGettingFilteredPosts;