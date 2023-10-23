const filesPayloadExists = (req, res, next) => {
    if(!req.files) {
        return res.status(400).send({error: "Missing files in the request"});
    }

    next();
};

module.exports = filesPayloadExists;