const jwt = require("jsonwebtoken")
require("dotenv").config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if(!authHeader) {
        return res.sendStatus(401);
    } else {
        const token = authHeader.split(" ")[1];
        jwt.verify( // OLD UNEXPIRED TOKENS ARE NOT DELETED
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (error, decodedFromToken) => {
                if(error) {
                    return res.sendStatus(403); // invalid token
                }
                req.user = decodedFromToken;
                next();
            }
        );
    }
}

module.exports = verifyJWT;