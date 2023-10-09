const jwt = require("jsonwebtoken");
require('dotenv').config();

const getUser = async function(username) {
    return { 
        userId: 123, 
        username, 
        password: "123456",
        email: "lol@gmail.com",
        profileImg: "jfsa",
    };
};

module.exports = (app) =>
    app.post("/auth/login", async (req, res) => {
        const { username, password } = req.body;

        const user = await getUser(username);
        const payload = {}

        if (user.password !== password) {
            console.log(req.body);
            return res.status(403).json({
                error: "invalid password",
            });
        }

        delete user.password;

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s", audience: JSON.stringify(user) });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1y", audience: JSON.stringify(user) });

        // res.cookie("accessToken", accessToken);

        res.json({ accessToken: accessToken, refreshToken: refreshToken });
    }
);