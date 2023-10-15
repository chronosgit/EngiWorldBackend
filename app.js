const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const refreshToken = require("./routes/refresh");
const verifyJWT = require("./middleware/verifyJWT");

const Models = require("./models");

mongoose.connect("mongodb://127.0.0.1:27017/engiworld");

const app = express();
const PORT = "3001";

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors());



refreshToken(app); // to refresh tokens

app.listen(PORT, (req, res) => {
    console.log(`Server is listening on port ${PORT}`);
});

app.post("/auth/login/", async (req, res) => {
    const {email, password} = req.body;
    console.log(req.body);

    const user = await Models.User.findOne({email: email});

    if(!user) {
        return res.status(404).json({
            error: "Such user doesn't exist",
        });
    } else if(user.password !== password) {
        return res.status(403).json({
            error: "Invalid password",
        });
    } else {
        delete user.password;

        const payload = {}
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m", audience: JSON.stringify(user) });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1y", audience: JSON.stringify(user) });

        res.json({ accessToken: accessToken, refreshToken: refreshToken });
    }
});

app.post("/auth/register/", async (req, res) => {
    const {email, username, password} = req.body;

    const existingUser = await Models.User.findOne({email: email});
    if(existingUser) {
        res.status(400).json({error: "The user with such email already exists"})
    } else {
        const user = new Models.User({email: email, username: username, password: password});
        await user.save();

        const payload = {};
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m", audience: JSON.stringify(user) });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d", audience: JSON.stringify(user) });

        res.cookie("JWT", refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); // maxAge of 1 day
        res.json({accessToken: accessToken});
    }
});

app.get("/user", verifyJWT, (req, res) => {
    res.json({msg: 200});
});