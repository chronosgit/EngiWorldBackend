const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require('dotenv').config();

const verifyJWT = require("./middleware/verifyJWT");
const refreshTokenHandler = require("./handlers/refreshTokenHandler");
const userLoginHandler = require("./handlers/userLoginHandler");
const userRegisterHandler = require("./handlers/userRegisterHandler");
const userLogoutHandler = require("./handlers/userLogoutHandler");
const userRUDHandlers = require("./handlers/userRUDHandlers");
const postCRUDHandlers = require("./handlers/postCRUDHandlers");
const getAnotherUserHandler = require("./handlers/getAnotherUserHandler");
const repostHandler = require("./handlers/repostHandler");
const getRepostsHandler = require("./handlers/getRepostsHandlers");

const Models = require("./models");

mongoose.connect("mongodb://127.0.0.1:27017/engiworld");

const app = express();
const PORT = "3001";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const corsOptions ={
    origin: 'http://localhost:3000', 
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));



app.listen(PORT, (req, res) => {
    console.log(`Server is listening on port ${PORT}`);
});

app.get("/refresh/", refreshTokenHandler);

app.post("/auth/login/", userLoginHandler);

app.post("/auth/register/", userRegisterHandler);

app.get("/auth/logout/", userLogoutHandler);

app.route("/user/")
    .get(verifyJWT, userRUDHandlers.handleUserRead)
    .put(verifyJWT, userRUDHandlers.handleUserUpdate)
    .delete(verifyJWT, userRUDHandlers.handleUserDelete);

app.route("/post/:id/")
    .get(postCRUDHandlers.handlePostRead)
    .put(verifyJWT, postCRUDHandlers.handlePostUpdate)
    .delete(verifyJWT, postCRUDHandlers.handlePostDelete);

app.post("/post/create/", verifyJWT, postCRUDHandlers.handlePostCreation);

app.get("/user/:id/", getAnotherUserHandler);

app.post("/repost/", verifyJWT, repostHandler);

app.get("/user/:userId/reposts/", getRepostsHandler);