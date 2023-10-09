const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

const loginUser = require("./routes/login");
const refreshToken = require("./routes/refresh");
const cookieJwtAuth = require("./middleware/bearerTokenAuth");

mongoose.connect("mongodb://127.0.0.1:27017/engiworld");

const app = express();
const PORT = "3001";

app.use(express.urlencoded({ extended: true }));



loginUser(app); // login function from routes/login.js
refreshToken(app); // to refresh tokens

app.listen(PORT, (req, res) => {
    console.log(`Server is listening on port ${PORT}`);
});

app.get("/data", cookieJwtAuth, (req, res) => {
    res.json({msg: req.user});
});