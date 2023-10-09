const jwt = require("jsonwebtoken");
require("dotenv").config();

cookieJwtAuth = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    try {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        const token = bearerToken;
        
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = user;
        next();
    } catch (err) {
        // res.clearCookie("token");
        return res.status(401).json({error: "wrong token was provided"});
    }
};

module.exports = cookieJwtAuth;