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

app.post("/comment/", verifyJWT, async (req, res) => {
    try {
        const user = await Models.User.findOne({email: req.user.email});
        const post = await Models.Post.findById({_id: req.body.postId});

        const newComment = new Models.Comment(
            {
                author: user._id,
                authorUsername: user.username,
                commentedPost: post,
                text: req.body.comment,
                date: new Date(),
            }
        );
        await newComment.save()

        res.json(newComment);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Posting a comment resulted in error"});
    }
});

app.get("/comments/:postId/", async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Models.Post.findById({_id: postId});
        const comments = await Models.Comment.find({commentedPost: post});

        const data = [];

        for(let i = 0; i < comments.length; i++) {
            const author = await  Models.User.findById({_id: comments[i].author});
            const profilePicBuffer = author.hasProfilePic ? author.profilePic : author.defaultProfilePic; 
            const profilePicBase64 = Buffer.from(profilePicBuffer.data, "base64").toString("base64");

            data.push({
                id: comments[i]._id,
                authorId: comments[i].author,
                authorUsername: comments[i].authorUsername,
                authorProfilePic: profilePicBase64,
                // isLiked: ,
                postId: comments[i].commentedPost,
                text: comments[i].text,
                date: comments[i].date,
                likes: comments[i].likes,
            })
        }

        res.json(data);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Getting comments on this post resulted in error"});
    }
});

app.get("/auth/comments/:postId/", verifyJWT, async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Models.Post.findById({_id: postId});
        const comments = await Models.Comment.find({commentedPost: post});

        const user = await Models.User.findOne({email: req.user.email});

        const data = [];
        for(let i = 0; i < comments.length; i++) {
            const author = await  Models.User.findById({_id: comments[i].author});
            const profilePicBuffer = author.hasProfilePic ? author.profilePic : author.defaultProfilePic; 
            const profilePicBase64 = Buffer.from(profilePicBuffer.data, "base64").toString("base64");

            data.push({
                id: comments[i]._id,
                authorId: comments[i].author,
                authorUsername: comments[i].authorUsername,
                authorProfilePic: profilePicBase64,
                isLiked: comments[i].likes.includes(user._id) ? true : false,
                postId: comments[i].commentedPost,
                text: comments[i].text,
                date: comments[i].date,
                likes: comments[i].likes,
            })
        }

        res.json(data);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Getting comments on this post resulted in error"});
    }
});

app.post("/comment/like/", verifyJWT, async (req, res) => {
    try {
        const likingUser = await Models.User.findOne({email: req.user.email});
        const likedComment = await Models.Comment.findById({_id: req.body.commentId});

        console.log(likedComment, likingUser);

        if(likedComment.likes.length > 0) {
            if(likedComment.likes.includes(likingUser._id)) {
                await Models.Comment.findByIdAndUpdate({_id: likedComment._id}, {$pull: {likes: likingUser._id}});

                return res.sendStatus(200);
            }
        }

        likedComment.likes.push(likingUser);

        await likedComment.save();

        res.sendStatus(200);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Liking the comment resulted in error"});
    }
});

app.delete("/:postId/comment/:commentId", verifyJWT, async(req, res) => {
    try {
        const {postId, commentId} = req.params;

        await Models.Comment.deleteOne({_id: commentId});
        await Models.Post.findByIdAndUpdate({_id: postId}, {$pull: {comments: commentId}});

        res.sendStatus(200);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Deleting the comment resulted in error"});
    }
});

app.route("/comment/:commentId/")
    .get(async (req, res) => {
        try {
            const {commentId} = req.params;

            const comment = await Models.Comment.findById({_id: commentId});

            res.json(comment);
        } catch(error) {
            console.log(error);

            res.status(500).send({error: "Getting the comment resulted in error"});
        }
    })
    .put(verifyJWT, async(req, res) => {
        try {
            const commentId = req.params.commentId;
            const updatedComment = await Models.Comment.findById({_id: commentId});

            const requestingUser = await Models.User.findOne({email: req.user.email});
            if(updatedComment.author == requestingUser._id) {
                return res.status(403).send({error: "You don't have right for updating this post"});
            }
        
            updatedComment.text = req.body.comment;
            await updatedComment.save();
        
            res.json(updatedComment);
        } catch(error) {
            console.log(error);

            res.status(500).send({error: "Updating the comment resulted in error"});
        }
    });

app.get("/user/:userId/posts/", async (req, res) => {
    try {
        const start = req.query.start;
        const end = req.query.end;
        const authedUserId = req.query.authedUserId;
        const userId = req.params.userId;

        const authedUser = await Models.User.findById({_id: authedUserId});
        const arrayOfLikeIds = authedUser.likes;
        const arrayOfRepostIds = authedUser.reposts;

        const recentPosts = await Models.Post.find({author: userId}).sort({created_at: -1});
        let posts = [];
        if(end - start + 1 >= recentPosts.length) {
            posts = recentPosts;
        } else {
            posts = recentPosts.slice(start - 1, end);
        }

        const data = [];
        for(let i = 0; i < posts.length; i++) {
            data.push({
                id: posts[i]._id,
                author: posts[i].author,
                authorUsername: posts[i].authorUsername,
                isLiked: arrayOfLikeIds.includes(posts[i]._id) ? true : false,
                isReposted: arrayOfRepostIds.includes(posts[i]._id) ? true : false,
                title: posts[i].title,
                topic: posts[i].topic,
                text: posts[i].text,
                date: posts[i].date,
                comments: posts[i].comments,
                likes: posts[i].likes,
            });
        }

        res.json(data);
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Getting posts resulted in error"});
    }
});

app.get("/feed/", async (req, res) => {
    try {
        const start = req.query.start;
        const end = req.query.end;

        const recentPosts = await Models.Post.find().sort({created_at: -1});

        if(end - start > recentPosts.length) {
            res.json(recentPosts);
        } else {
            const limitedRecentPosts = recentPosts.slice(start - 1, end);

            res.json(limitedRecentPosts);
        }
    } catch(error) {
        console.log(error);
        res.status(500).send({error: "Getting posts resulted in error"});
    }
});

app.get("/feed/:topic/", async (req, res) => { 
    const topic = req.params.topic;
    const posts = Models.Post.find({topic: topic});

    res.status(200);
});