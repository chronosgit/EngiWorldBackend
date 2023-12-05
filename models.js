const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        data: Buffer,
        contentType: String,
    },
    defaultProfilePic: {
        data: Buffer,
        contentType: String,
    },
    hasProfilePic: {
        type: Boolean, // if no pfp, return some default image
        default: false,
    },
    bio: {
        type: String,
        default: "No bio",
    },
    refreshToken: String,
    follows: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ],
    likes: [
        {type: mongoose.Schema.Types.ObjectId, ref: "Post"},
    ],
    dislikes: [
        {type: mongoose.Schema.Types.ObjectId, ref: "Post"},
    ],
    reposts: [
        {type: mongoose.Schema.Types.ObjectId, ref: "Post"},
    ],
    allowed: {
        type: Array, "default": [],
    },
});
const User = mongoose.model("User", userSchema);



const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
    title: String,
    topic: String,
    text: String,
    date: Date,
    comments: [
        {type: mongoose.Schema.Types.ObjectId, ref: "Comment"},
    ],
    likes: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ],
    dislikes: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ],

    // NEED "files" FIELD HERE
});
const Post = mongoose.model("Post", postSchema);



const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
    commentedPost: {
        type: mongoose.Schema.Types.ObjectId, ref: "Post",
    },
    text: String,
    likes: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ],
    dislikes: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ],
    date: Date,
});
const Comment = mongoose.model("Comment", commentSchema);



// const notificationSchema = new mongoose.Schema({
//     receiver: {
//         type: mongoose.Schema.Types.ObjectId, ref: "User",
//     },
//     date: Date,
//     isRead: Boolean,
// });
// here come childs, using mongoose discrimator logic



module.exports = {User, Post, Comment};