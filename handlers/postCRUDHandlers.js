const Models = require("../models");

const handlePostRead = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Models.Post.findById({_id: postId});

        res.json({
            id: post._id,
            author: post.author,
            authorUsername: post.authorUsername,
            title: post.title,
            topic: post.topic,
            text: post.text,
            date: post.date,
            comments: post.comments,
            likes: post.likes,
        });
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Getting the post resulted in error"});
    }
};

const handlePostCreation = async (req, res) => {
    const {title, topic, text, date = new Date()} = req.body;

    console.log(title, topic, text, date);

    try {
        const author = await Models.User.findOne({email: req.user.email});
        const newPost = new Models.Post(
            {
                author: author,
                authorUsername: author.username,
                title: title,
                topic: topic,
                text: text,
                date: date,
            }
        );
        await newPost.save();
    
        res.status(201).send(newPost);
    } catch(error) {
        res.status(500).send({error: "Creating new post resulted in error"});
    }
};

const handlePostUpdate = async (req, res) => {
    try {
        const postId = req.params.id;
        const updatedPost = await Models.Post.findById({_id: postId});

        const requestingUser = await Models.User.findOne({email: req.user.email});
        if(updatedPost.author == requestingUser._id) {
            return res.status(403).send({error: "You don't have right for updating this post"});
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
    } catch(error) {
        res.status(500).send({error: "Updating the post resulted in error"});
    }
};

const handlePostDelete = async (req, res) => {
    try {
        const deletablePost = await Models.Post.findById({_id: req.params.id});
        const requestingUser = await Models.User.findOne({email: req.user.email});
        
        if(deletablePost.author == requestingUser._id) {
            return res.status(403).send({error: "You don't have right for updating this post"});
        }

        await Models.Post.deleteOne({_id: req.params.id});
        
        res.sendStatus(200);
    } catch(error) {
        res.status(500).send({error: "Deleting the post resulted in error"});
    }
};

module.exports = {handlePostRead, handlePostCreation, handlePostUpdate, handlePostDelete,}