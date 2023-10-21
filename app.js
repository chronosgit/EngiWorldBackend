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
const userCRUDHandlers = require("./handlers/userCRUDHandlers");
const postCRUDHandlers = require("./handlers/postCRUDHandlers");
const postCreateHandler = require("./handlers/postCreateHandler");

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

app.get("/refresh", refreshTokenHandler);

app.post("/auth/login/", userLoginHandler);

app.post("/auth/register/", userRegisterHandler);

app.route("/user/")
    .get(verifyJWT, userCRUDHandlers.handleUserRead)
    .put(verifyJWT, userCRUDHandlers.handleUserUpdate)
    .delete(verifyJWT, userCRUDHandlers.handleUserDelete);

app.route("/post/:id/")
    .get(verifyJWT, postCRUDHandlers.handlePostRead)
    .put(verifyJWT, postCRUDHandlers.handlePostUpdate)
    .delete(verifyJWT, postCRUDHandlers.handlePostDelete)

app.post("/post/create/", verifyJWT, postCreateHandler);