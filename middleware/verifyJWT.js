const jwt = require("jsonwebtoken")
require("dotenv").config();

const verifyJWT = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];

        if(!authHeader) {
            return res.sendStatus(401).send({error: "Access token hasn't been received in Bearer header"});
        } else {
            const token = authHeader.split(" ")[1];

            jwt.verify( // OLD UNEXPIRED TOKENS ARE NOT DELETED
                token,
                process.env.ACCESS_TOKEN_SECRET,
                (error, decodedFromToken) => {
                    if(error) {
                        return res.sendStatus(403);
                    } else {
                        req.user = decodedFromToken;
                        next();
                    }
                }
            );
        }
    } catch(error) {
        console.log(error);

        res.sendStatus(500).send({error: "Refreshing a token resulted in error"});
    }
}

module.exports = verifyJWT;