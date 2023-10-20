const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require('dotenv').config();

const Models = require("../models");

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    if(!cookies?.JWT) {
        console.log(401);
        return res.sendStatus(401);
    }
    console.log(cookies.JWT);
    const refreshToken = cookies.JWT;
    
    const foundUser = await Models.User.findOne({refreshToken: refreshToken});
    if(!foundUser) {
        console.log(403);
        res.sendStatus(403);
    } else {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (error, decodedFromToken) => {
                if(error || foundUser.username !== decodedFromToken.username) {
                    console.log("inner error")
                    return res.sendStatus(403);
                } else {
                    const payload = {
                        username: foundUser.username,
                        email: foundUser.email,
                    }
                    const newAccessToken = jwt.sign(
                        payload,
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn: "15m"}
                    );
                    res.json({accessToken: newAccessToken});
                }     
            }
        );
    }
}

module.exports = handleRefreshToken;