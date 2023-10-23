const Models = require("../models");

const handleUserRead = async (req, res) => {
    try {
        const email = req.user.email;
        const user = await Models.User.findOne({email: email});

        let data = {};
        if(user.hasProfilePic) {
            data = await Models.User.findById(
                {_id: user._id}, 
                "_id email username hasProfilePic follows reposts profilePic likes dislikes allowed bio"
            );
        } else {
            data = await Models.User.findById(
                {_id: user._id}, 
                "_id email username hasProfilePic follows reposts defaultProfilePic likes dislikes allowed bio"
            );
        }

        res.json({data});
    } catch(error) {
        console.log(error);
        res.status(500).send({error: "Getting the user resulted in error"});
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
        res.status(500).send({error: "Updating the user resulted in error"});
    }
};

const handleUserDelete = async (req, res) => {
    try {
        const email = req.user.email;
        const user = await Models.User.findOne({email: email});
        await Models.Post.deleteMany({author: user});
        await Models.Post.updateMany(
            {}, 
            {
                $pullAll: {
                    dislikes: [{_id: user._id}],
                    likes: [{_id: user._id}],
                },
            }
        );
        await Models.User.deleteOne({email: email});

        res.clearCookie("JWT", {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
        res.sendStatus(200);
    } catch(error) {
        res.status(500).send({error: "Deleting the user resulted in error"});
    }
};

module.exports = {handleUserRead, handleUserDelete, handleUserUpdate};