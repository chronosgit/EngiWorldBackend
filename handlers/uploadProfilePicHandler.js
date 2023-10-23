const Models = require("../models");

const handleProfilePicUpload = async (req, res) => {
    try {
        const file = req.files; // a file, possibly an image

        if(file?.undefined?.length > 1) {
            return res.status(400).send({error: "Only one image can be received"});
        }

        const fileType = file.undefined.mimetype.slice(6);

        if(!["jpeg", "jpg", "png", "webp"].includes(fileType)) {
            return res.status(406).send({error: "Image must be png, jpeg, jpg or webp"});
        }

        await Models.User.findOneAndUpdate(
            {email: req.user.email}, 
            {hasProfilePic: true, profilePic: file.undefined.data},
        );

        const user = await Models.User.findOne(
            {email: req.user.email},
            "_id email username follows reposts profilePic likes dislikes allowed bio"
        ); 

        res.json(user);
    } catch(error) {
        console.log(error);
        res.status(400).send({error: "Uploading the picture resulted in error"});
    }
}

module.exports = handleProfilePicUpload;