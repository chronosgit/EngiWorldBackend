const Models = require("../models");

const handlePostCreation = async (req, res) => {
    const author = await Models.User.findOne({email: req.user.email});
    const {
        title = "",
        topic = "",
        text = "",
        date = new Date(),
    } = req.body;

    const newPost = new Models.Post(
        {
            author: author,
            title: title,
            topic: topic,
            text: text,
            date: date,
        }
    );
    await newPost.save();

    res.sendStatus(200);
};

module.exports = handlePostCreation; 