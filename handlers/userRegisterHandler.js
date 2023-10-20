const jwt = require("jsonwebtoken");
require('dotenv').config();

const Models = require("../models");

const handleUserRegister = async (req, res) => {
    const {email, username, password} = req.body;

    const existingUser = await Models.User.findOne({email: email});
    if(existingUser) {
        res.status(400).json({error: "The user with such email already exists"})
    } else {
        const payload = {
            username: username,
            email: email,
        };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" } );
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" } );

        const user = new Models.User({email: email, username: username, password: password, refreshToken: refreshToken});
        await user.save();

        res.cookie("JWT", refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); // maxAge of 1 day
        res.json({accessToken: accessToken});
    }
}

module.exports = handleUserRegister;