const Models = require("../models");

const handleGettingAnotherUser = async (req, res) => {
    const requiredUserId = req.params.id;
    const requiredUser = await Models.User.findById({_id: requiredUserId});

    const data = {
        id: requiredUserId,
        email: requiredUser.email,
        username: requiredUser.username,
        hasProfilePic: requiredUser.hasProfilePic,
        follows: requiredUser.follows,
        allowed: requiredUser.allowed,
        bio: requiredUser.bio,
    }

    res.json({data});
};

module.exports = handleGettingAnotherUser;