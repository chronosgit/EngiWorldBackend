const Models = require("../models");

const handleUserRead = async (req, res) => {
    try {
        const email = req.user.email;
        const user = await Models.User.findOne({email: email});

        const data = {
            id: user._id,
            email: user.email,
            username: user.username,
            hasProfilePic: user.hasProfilePic,
            follows: user.follows,
            allowed: user.allowed,
            bio: user.bio,
        }

        res.json({data});
    } catch(error) {
        res.status(404).send({error: "Getting the user resulted in error"});
    }
};

const handleUserUpdate = async (req, res) => {
    try {
        const email = req.user.email;
        const user = await Models.User.findOne({email: email});
        const {
            password = user.password,
            profilePic = user.profilePic,
            hasProfilePic = user.hasProfilePic,
            bio = user.bio,
            allowed = user.allowed,
        } = req.body;

        await Models.User.updateOne(
            {email: email}, 
            {
                password: password, profilePic: profilePic, 
                hasProfilePic: hasProfilePic, bio: bio,
                allowed: allowed,
            }
        );

        res.sendStatus(200);
    } catch(error) {
        res.status(404).send({error: "Updating the user resulted in error"});
    }
};

const handleUserDelete = async (req, res) => {
    try {
        const email = req.user.email;
        await Models.User.deleteOne({email: email});

        res.sendStatus(200);
    } catch(error) {
        res.status(404).send({error: "Deleting the user resulted in error"});
    }
};

module.exports = {handleUserRead, handleUserDelete, handleUserUpdate};