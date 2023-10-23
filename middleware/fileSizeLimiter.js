const MB = 5; // 5 MB of file size limit
const FILE_SIZE_LIMIT = MB * 1024 * 1024 // 5 MB number

const fileSizeLimiter = (req, res, next) => {
    const files = req.files;
    const filesOverLimit = []; // files over the limit go here

    Object.keys(files).forEach(key => {
        if(files[key].size > FILE_SIZE_LIMIT) {
            filesOverLimit.push(files[key].name);
        }
    });

    if(filesOverLimit.length) {
        return res.status(413).send({error: "File's size must be under 5 MB"});
    }

    next();
};

module.exports = fileSizeLimiter;