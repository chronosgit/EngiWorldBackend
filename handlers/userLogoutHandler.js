const Models = require("../models");

const handleUserLogout = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.JWT) {
        res.sendStatus(200);
    }

    const refreshToken = cookies.JWT;

    try {
        const foundUser = await Models.User.findOne({refreshToken: refreshToken});

        if(!foundUser) {
            res.clearCookie("JWT", {httpOnly: false, maxAge: 24 * 60 * 60 * 1000});
            res.sendStatus(200);
        } else {
            foundUser.refreshToken = "";
            foundUser.save();
    
            res.clearCookie("JWT", {httpOnly: false, maxAge: 24 * 60 * 60 * 1000});
            res.sendStatus(200);
        }
    } catch(error) {
        res.status(500).send({error: "Logouting resulted in error"});
    }
};

module.exports = handleUserLogout;