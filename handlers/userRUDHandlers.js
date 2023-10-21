const Models = require("../models");

const handleUserRead = async (req, res) => {
    const email = req.user.email;
    const user = await Models.User.findOne({email: email});
    if(!user) {
        return res.sendStatus(404).json({
            error: "Such user doesn't exist",
        });
    } else {
        res.json({user: user});
    }
};

const handleUserUpdate = async (req, res) => {
    const email = req.user.email;
    const user = await Models.User.findOne({email: email});
    const {
        password = user.password,
        profilePic = user.profilePic,
        hasProfilePic = user.hasProfilePic,
        bio = user.bio,
        allowed = user.allowed,
    } = req.body;
    if(!user) {
        return res.sendStatus(404).json({
            error: "Such user doesn't exist",
        });
    } else {
        const updatedUser = await Models.User.updateOne(
            {email: email}, 
            {
                password: password, profilePic: profilePic, 
                hasProfilePic: hasProfilePic, bio: bio,
                allowed: allowed,
            }
        );
        res.json({updatedUserInfo: updatedUser, oldUserInfo: user});
    }
};

const handleUserDelete = async (req, res) => {
    const email = req.user.email;
    const user = await Models.User.findOne({email: email});
    if(!user) {
        return res.sendStatus(404).json({
            error: "Such user doesn't exist",
        });
    } else {
        await Models.User.deleteOne({email: email});
        res.sendStatus(200);
    }
};

module.exports = {handleUserRead, handleUserDelete, handleUserUpdate};