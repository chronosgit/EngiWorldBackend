const jwt = require("jsonwebtoken")
require("dotenv").config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if(!authHeader) {
        res.sendStatus(401).send({error: "Access token hasn't been received in Bearer header"});
    } else {
        const token = authHeader.split(" ")[1];
        jwt.verify( // OLD UNEXPIRED TOKENS ARE NOT DELETED
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (error, decodedFromToken) => {
                if(error) {
                    res.sendStatus(403);
                } else {
                    req.user = decodedFromToken;
                    next();
                }
            }
        );
    }
}

module.exports = verifyJWT;