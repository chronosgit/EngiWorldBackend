const Models = require("../models");

const handleGettingAnotherUser = async (req, res) => {
    try {
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
    } catch(error) {
        res.status(404).send({error: "Getting the user resulted in error"});
    }
};

module.exports = handleGettingAnotherUser;