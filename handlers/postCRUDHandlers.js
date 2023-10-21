const Models = require("../models");

const handlePostRead = async (req, res) => {
    const postId = req.params.id;
    try {
        const requestedPost = await Models.Post.findById({_id: postId});

        res.json({requestedPost});
    } catch(error) {
        res.sendStatus(404).json({error: error});
    }
};

const handlePostUpdate = async (req, res) => {
    const postId = req.params.id;
    const updatedPost = await Models.Post.findById({_id: postId});

    if(!updatedPost) {
        res.sendStatus(404).json({message: "Such post doesn't exist"});
    }

    const {
        title = updatedPost.title,
        topic = updatedPost.topic,
        text = updatedPost.text,
    } = req.body;

    updatedPost.title = title;
    updatedPost.topic = topic;
    updatedPost.text = text;
    await updatedPost.save();

    res.json(updatedPost);
};

const handlePostDelete = async (req, res) => {
    const postId = req.params.id;
    try {
        await Models.Post.deleteOne({_id: postId});
        res.sendStatus(200);
    } catch(error) {
        res.sendStatus(404).json({error: error});
    }
};

module.exports = {handlePostRead, handlePostUpdate, handlePostDelete,}