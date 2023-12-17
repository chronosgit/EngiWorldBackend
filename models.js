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
    authorUsername: String,
    title: String,
    topic: String,
    text: String,
    date: Date,
    comments: [
        {type: Array, "default": []},
    ],
    likes: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ],
    reposts: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ],
    isEdited: {
        type: Boolean,
        default: false,
    },
});
const Post = mongoose.model("Post", postSchema);



const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
    authorUsername: String,
    commentedPost: {
        type: mongoose.Schema.Types.ObjectId, ref: "Post",
    },
    text: String,
    likes: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ],
    date: Date,
    isEdited: {
        type: Boolean,
        default: false,
    }
});
const Comment = mongoose.model("Comment", commentSchema);



const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
    senderUsername: String,
    receiver: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
    receiverUsername: String,
    post: {
        type: mongoose.Schema.Types.ObjectId, ref: "Post",
    },
    postTitle: String,
    comment: {
        type: mongoose.Schema.Types.ObjectId, ref: "Comment",
    },
    type: String,
    typeOperation: String,
    date: Date,
    isRead: {
        type: String,
        default: false,
    },
});
const Notification = mongoose.model("Notification", notificationSchema);



module.exports = {User, Post, Comment, Notification};