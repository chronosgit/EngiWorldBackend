const Models = require("../models");

const handleGetComment = async (req, res) => {
    try {
        const {commentId} = req.params;

        const comment = await Models.Comment.findById({_id: commentId});

        res.json(comment);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Getting the comment resulted in error"});
    }
};

module.exports = handleGetComment;