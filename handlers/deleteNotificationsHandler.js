const Models = require("../models");

const handleDeletingNotifications = async (req, res) => {
    try {
        const user = await Models.User.findOne({email: req.user.email});
        await Models.Notification.deleteMany({receiver: user});

        res.sendStatus(200);
    } catch(error) {
        res.status(500).send({error: "Deleting the notifications resulted in error"});
    }
};

module.exports = handleDeletingNotifications;