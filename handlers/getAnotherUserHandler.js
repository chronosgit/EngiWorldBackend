const Models = require("../models");

const handleGettingAnotherUser = async (req, res) => {
    try {
        const requiredUserId = req.params.id;
        const requiredUser = await Models.User.findById({_id: requiredUserId});
        
        const profilePicBuffer = requiredUser.hasProfilePic ? requiredUser.profilePic : requiredUser.defaultProfilePic; 
        const profilePicBase64 = Buffer.from(profilePicBuffer.data, "base64").toString("base64");

        res.json({
            email: requiredUser.email,
            username: requiredUser.username,
            id: requiredUser._id,
            profilePic: profilePicBase64,
            likes: requiredUser.likes,
            dislikes: requiredUser.dislikes,
            allowed: requiredUser.allowed,
            bio: requiredUser.bio,
        });
    } catch(error) {
        console.log(error);
        res.status(500).send({error: "Getting the user resulted in error"});
    }
};

module.exports = handleGettingAnotherUser;