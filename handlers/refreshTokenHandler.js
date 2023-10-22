const jwt = require("jsonwebtoken");
require('dotenv').config();

const Models = require("../models");

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.JWT) {
        return res.status(401).send({error: "A cookie with JWT hasn't been received"});
    }
    const refreshToken = cookies.JWT;

    try {
        const foundUser = await Models.User.findOne({refreshToken: refreshToken});
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (error, decodedFromToken) => {
                if(error || foundUser.username !== decodedFromToken.username) {
                    res.sendStatus(403);
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
    } catch(error) {
        res.status(403).send({error: "Refresh request resulted in error"});
    }
}

module.exports = handleRefreshToken;