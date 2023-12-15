const Models = require("../models");
const mongoose = require("mongoose");

const handleUpdatingUserBio = async (req, res) => {
    try {
        const subjectId = new mongoose.Types.ObjectId("1a2b3c4d5e6f7a8b9c0d1e2f"); // converting string to objectId req.params.userId
        const issuingUser = await Models.User.findOne({email: req.user.email});
        if(subjectId.equals(issuingUser._id)) {
            return res.status(403).send({error: "You have no rights to update this bio"});
        }
        
        issuingUser.bio = req.body.bio;
        await issuingUser.save();

        res.sendStatus(200);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Updating the user's bio resulted in error"});
    }
};

module.exports = handleUpdatingUserBio;