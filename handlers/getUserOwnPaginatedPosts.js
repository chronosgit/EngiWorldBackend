const Models = require("../models");

const handleGetUserOwnPaginatedPosts = async (req, res) => {
    try {
        const start = req.query.start;
        const end = req.query.end;
        const userId = req.params.userId;

        const recentPosts = await Models.Post.find({author: userId}).sort({created_at: -1});
        let posts = [];
        if(end - start + 1 >= recentPosts.length) {
            posts = recentPosts;
        } else {
            posts = recentPosts.slice(start - 1, end);
        }

        if((start === 1 && end - start + 1 >= recentPosts.length) || start > recentPosts.length) {
            return res.sendStatus(200);
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
            });
        }

        res.json(data);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Getting posts resulted in error"});
    }
};

module.exports = handleGetUserOwnPaginatedPosts;