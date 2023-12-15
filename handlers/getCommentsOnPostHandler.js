const Models = require("../models");

const handleGetCommentsOnPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Models.Post.findById({_id: postId});
        const comments = await Models.Comment.find({commentedPost: post});

        const data = [];

        for(let i = 0; i < comments.length; i++) {
            const author = await  Models.User.findById({_id: comments[i].author});
            const profilePicBuffer = author.hasProfilePic ? author.profilePic : author.defaultProfilePic; 
            const profilePicBase64 = Buffer.from(profilePicBuffer.data, "base64").toString("base64");

            data.push({
                id: comments[i]._id,
                authorId: comments[i].author,
                authorUsername: comments[i].authorUsername,
                authorProfilePic: profilePicBase64,
                postId: comments[i].commentedPost,
                text: comments[i].text,
                date: comments[i].date,
                likes: comments[i].likes,
                isEdited: comments[i].isEdited,
            })
        }

        res.json(data);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Getting comments on this post resulted in error"});
    }
};

module.exports = handleGetCommentsOnPost;