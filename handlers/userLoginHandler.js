const jwt = require("jsonwebtoken");
require('dotenv').config();

const Models = require("../models");

const handleUserLogin = async (req, res) => {
    const {email, password} = req.body;

    const user = await Models.User.findOne({email: email});

    if(!user) {
        return res.sendStatus(404).json({
            error: "Such user doesn't exist",
        });
    } else if(user.password !== password) {
        return res.sendStatus(403).json({
            error: "Invalid password",
        });
    } else {
        delete user.password;

        const payload = {
            username: user.username,
            email: user.email,
        }
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m",});
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "1d",});
        user.refreshToken = refreshToken; // store a user's new refresh token as well
        user.save();
        res.cookie("JWT", refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); // maxAge of 1 day
        res.json({accessToken: accessToken});
    }
}

module.exports = handleUserLogin;