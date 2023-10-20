const Models = require("../models");

const handleUserRead = async (req, res) => {
    const email = req.user.email;
    const user = await Models.User.findOne({email: email});
    if(!user) {
        return res.status(404).json({
            error: "Such user doesn't exist",
        });
    } else {
        res.json({user: user});
    }
};

const handleUserDelete = async (req, res) => {
    const email = req.user.email;
    const user = await Models.User.findOne({email: email});
    if(!user) {
        return res.status(404).json({
            error: "Such user doesn't exist",
        });
    } else {
        await Models.User.deleteOne({email: email});
        res.sendStatus(200);
    }
};

module.exports = {handleUserRead, handleUserDelete};