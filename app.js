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
const followHandler = require("./handlers/followHandler");
const uploadProfilePicHandler = require("./handlers/uploadProfilePicHandler");
const postCommentHandler = require("./handlers/postCommentHandler");
const getCommentsOnPostHandler = require("./handlers/getCommentsOnPostHandler");
const authGetCommentsOnPostHandler = require("./handlers/authGetCommentsOnPostHandler");
const likeCommentHandler = require("./handlers/likeCommentHandler");
const deleteCommentHandler = require("./handlers/deleteCommentHandler");
const getCommentHandler = require("./handlers/getCommentHandler");
const updateCommentHandler = require("./handlers/updateCommentHandler");
const getUserOwnPaginatedPosts = require("./handlers/getUserOwnPaginatedPosts");
const getUserLikedPaginatedPosts = require("./handlers/getUserLikedPaginatedPosts");

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

app.get("/search/", searchHandler);

app.post("/like/", verifyJWT, likePostHandler);

app.post("/follow/", verifyJWT, followHandler);

app.put(
    "/upload/profilePicture/", 
    [
        verifyJWT, 
        fileUpload({createParentPath: true}),
        filesPayloadExists,
        fileSizeLimiter,
    ], 
    uploadProfilePicHandler
);

app.post("/comment/", verifyJWT, postCommentHandler);

app.get("/comments/:postId/", getCommentsOnPostHandler);

app.get("/auth/comments/:postId/", verifyJWT, authGetCommentsOnPostHandler);

app.post("/comment/like/", verifyJWT, likeCommentHandler);

app.delete("/:postId/comment/:commentId", verifyJWT, deleteCommentHandler);

app.route("/comment/:commentId/")
    .get(getCommentHandler)
    .put(verifyJWT, updateCommentHandler);

app.get("/user/:userId/posts/", getUserOwnPaginatedPosts);

app.get("/user/:userId/reposts/", getRepostsHandler);

app.get("/user/:userId/liked/", getUserLikedPaginatedPosts);