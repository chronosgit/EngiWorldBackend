const jwt = require("jsonwebtoken");
require('dotenv').config();

const Models = require("../models");

const handleUserLogin = async (req, res) => {
    const {email, password} = req.body;

    let user = {};

    try {
        user = await Models.User.findOne({email: email});

        if(user.password !== password) {
            res.status(403).send({error: "Invalid password"});
        } else {
            delete user.password;
    
            const payload = {
                username: user.username,
                email: user.email,
            }
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m",});
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "1d",});
            user.refreshToken = refreshToken; // store a user's new refresh token as well
            await user.save();

            const profilePicBuffer = user.hasProfilePic ? user.profilePic : user.defaultProfilePic; 
            const profilePicBase64 = Buffer.from(profilePicBuffer.data, "base64").toString("base64");

            res.cookie("JWT", refreshToken, {httpOnly: false, maxAge: 24 * 60 * 60 * 1000}); // maxAge of 1 day
            res.json({
                email: email,
                username: user.username,
                id: user._id,
                profilePic: profilePicBase64,
                likes: user.likes,
                dislikes: user.dislikes,
                allowed: user.allowed,
                bio: user.bio,
                accessToken: accessToken,
            });
        }
    } catch(error) {
        return res.status(500).send({error: "Logging in resulted in error"});
    }
}

module.exports = handleUserLogin;