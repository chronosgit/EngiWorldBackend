const jwt = require("jsonwebtoken");
require('dotenv').config();

const Models = require("../models");

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.JWT) {
        return res.sendStatus(401);
    }
    const refreshToken = cookies.JWT;
    
    const foundUser = await Models.User.findOne({refreshToken: refreshToken});
    if(!foundUser) {
        res.sendStatus(403);
    } else {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (error, decodedFromToken) => {
                if(error || foundUser.username !== decodedFromToken.username) {
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