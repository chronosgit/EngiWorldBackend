const Models = require("../models");

const handleGettingAnotherUser = async (req, res) => {
    try {
        const requiredUserId = req.params.id;
        const requiredUser = await Models.User.findById({_id: requiredUserId});
        
        let data = {};
        if(requiredUser.hasProfilePic) {
            data = await Models.User.findById(
                {_id: requiredUserId}, 
                "_id email username hasProfilePic follows reposts profilePic likes dislikes allowed bio"
            );
        } else {
            data = await Models.User.findById(
                {_id: requiredUserId}, 
                "_id email username hasProfilePic follows reposts defaultProfilePic likes dislikes allowed bio"
            );
        }

        res.json({data});
    } catch(error) {
        console.log(error);
        res.status(404).send({error: "Getting the user resulted in error"});
    }
};

module.exports = handleGettingAnotherUser;