const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
require('dotenv').config();

const verifyJWT = require("./middleware/verifyJWT");
const filesPayloadExists = require("./middleware/filesPayloadExists");
const fileSizeLimiter = require("./middleware/fileSizeLimiter");

const refreshTokenHandler = require("./handlers/refreshTokenHandler");
const userLoginHandler = require("./handlers/userLoginHandler");
const userRegisterHandler = require("./handlers/userRegisterHandler");
const userLogoutHandler = require("./handlers/userLogoutHandler");
const userRUDHandlers = require("./handlers/userRUDHandlers");
const postCRUDHandlers = require("./handlers/postCRUDHandlers");
const getAnotherUserHandler = require("./handlers/getAnotherUserHandler");
const repostHandler = require("./handlers/repostHandler");
const getRepostsHandler = require("./handlers/getRepostsHandlers");
const searchHandler = require("./handlers/searchHandler");
const likePostHandler = require("./handlers/likePostHandler");
const dislikePostHandler = require("./handlers/dislikePostHandler");
const followHandler = require("./handlers/followHandler");
const uploadProfilePicHandler = require("./handlers/uploadProfilePicHandler");

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

app.get("/search/", searchHandler);

app.post("/like/", verifyJWT, likePostHandler);

app.post("/dislike/", verifyJWT, dislikePostHandler);

app.post("/follow/", verifyJWT, followHandler);

app.post(
    "/upload/profilePicture/", 
    [
        verifyJWT, 
        fileUpload({createParentPath: true}),
        filesPayloadExists,
        fileSizeLimiter,
    ], 
    uploadProfilePicHandler
);

app.get("/feed/", async (req, res) => {
    try {   
        if(res.user) {
            res.sendStatus(200);
        } else {
            const start = req.query.start;
            const end = req.query.end;

            const recentPosts = await Models.Post.find().sort({created_at: -1});

            if(end - start > recentPosts.length) {
                res.json(recentPosts);
            } else {
                const limitedRecentPosts = recentPosts.slice(start - 1, end);

                res.json(limitedRecentPosts);
            }
        }
    } catch(error) {
        console.log(error);
        res.status(500).send({error: "Getting posts resulted in error"});
    }
});

app.get("/feed/:topic/", async (req, res) => { // getting 20 posts
    const topic = req.params.topic;
    const posts = Models.Post.find({topic: topic});

    res.status(200);
});

app.post("/comment/", async (req, res) => {
    
});

app.get("/user/:userId/posts/", async (req, res) => {

});