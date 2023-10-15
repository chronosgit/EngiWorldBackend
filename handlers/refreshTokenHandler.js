const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require('dotenv').config();

const Models = require("../models");

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) {
        return res.sendStatus(401);
    }
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    
    const foundUser = await Models.User.findOne({refreshToken: refreshToken});
    if(!foundUser) {
        res.sendStatus(403);
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (error, decodedFromToken) => {
            if(error || foundUser.username !== decodedFromToken.username) {
                return res.sendStatus(403);
            } else {
                const payload = {}
                const newAccessToken = jwt.sign(
                    payload,
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "15m", audience: JSON.stringify(foundUser) }
                );
                res.json({accessToken: newAccessToken});
            }     
        }
    );
}

module.exports = handleRefreshToken;