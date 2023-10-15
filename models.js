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
    hasProfilePic: {
        type: Boolean, // if no pfp, return some default image
        default: false,
    },
    descr: String,
});
const User = mongoose.model('User', userSchema);

module.exports = {User};