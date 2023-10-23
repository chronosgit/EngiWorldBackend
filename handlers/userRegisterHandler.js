const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

const Models = require("../models");

const handleUserRegister = async (req, res) => {
    const {email, username, password} = req.body;

    try {
        const existingUser = await Models.User.findOne({email: email});

        if(existingUser) {
            res.status(400).send({error: "The user with such email already exists"})
        } else {
            const payload = {
                username: username,
                email: email,
            };
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" } );
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" } );

            const user = new Models.User({
                email: email, username: username, 
                password: password, refreshToken: refreshToken,
                defaultProfilePic: {
                    data: fs.readFileSync(path.join(__dirname + "/images/defaultProfilePicture.jpg")),
                    type: 'Buffer',
                },
            });
            await user.save();
    
            res.cookie("JWT", refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); // maxAge of 1 day
            res.json({accessToken});
        }
    } catch(error) {
        console.log(error);
        res.status(500).send({error: "Registering resulted in error"});
    }
}

module.exports = handleUserRegister;