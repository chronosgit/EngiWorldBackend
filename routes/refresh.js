const jwt = require("jsonwebtoken");
require('dotenv').config();

async function verifyRefreshToken(refreshToken) {
    let user = null;

    await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if(err) {
            throw(err);
        }

        user = payload.aud;
    });

    return user;
}

module.exports = (app) => (
    app.post("/auth/refresh", async (req, res) => {
        const bearerHeader = req.headers["authorization"];
        if(!bearerHeader) {
            throw Error("bearer header was not provided");
        }

        try {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            const refreshToken = bearerToken;

            const user = await verifyRefreshToken(refreshToken);
            const payload = {};
            // console.log(user);
            const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s", audience: JSON.stringify(user) });
            const newRefreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1y", audience: JSON.stringify(user) });
            // no blacklisting is built yet

            res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        } catch (err) {
            throw(err);
        }
    })
);