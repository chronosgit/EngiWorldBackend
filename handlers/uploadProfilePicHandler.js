const Models = require("../models");

const handleProfilePicUpload = async (req, res) => {
    try {
        const file = req.files;

        if(file?.undefined?.length > 1) {
            return res.status(400).send({error: "Only one image can be received"});
        }

        const fileType = file.imageFile.mimetype.slice(6);

        if(!["jpeg", "jpg", "png", "webp"].includes(fileType)) {
            return res.status(406).send({error: "Image must be png, jpeg, jpg or webp"});
        }

        const imageFile = {
            data: file.imageFile.data,
            type: "Buffer"
        }
        await Models.User.findOneAndUpdate(
            {email: req.user.email}, 
            {hasProfilePic: true, profilePic: imageFile},
        );

        const user = await Models.User.findOne(
            {email: req.user.email},
            "_id email username follows reposts profilePic likes dislikes allowed bio"
        ); 
        const profilePicBase64 = Buffer.from(imageFile.data, "base64").toString("base64");

        res.json({
            email: user.email,
            username: user.username,
            id: user._id,
            profilePic: profilePicBase64,
            likes: user.likes,
            dislikes: user.dislikes,
            allowed: user.allowed,
            bio: user.bio,
        });
    } catch(error) {
        console.log(error);

        res.status(500).send({error: "Uploading the picture resulted in error"});
    }
}

module.exports = handleProfilePicUpload;