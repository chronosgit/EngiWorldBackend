const Models = require("../models");

const handleUserLogout = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.JWT) {
        return res.sendStatus(204);
    }

    const refreshToken = cookies.JWT;
    const foundUser = await Models.User.findOne({refreshToken: refreshToken});
    if(!foundUser) {
        res.clearCookie("JWT", {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
        return res.sendStatus(204); // no content to return, but success
    } else {
        foundUser.refreshToken = "";
        foundUser.save();

        res.clearCookie("JWT", {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
        res.sendStatus(204);
    }
};

module.exports = handleUserLogout;