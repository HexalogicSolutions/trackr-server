
const logger = require("../helpers/logger");

const singleFileUpload = async (req, res, next) => {
    try {
        const file = req.file;
        logger.debug("File uploaded: " + file);
        console.log("File uploaded: " + file);
        console.log(req.file.mimetype);

        res.status(201).send('File Uploaded Successsfully')
    } catch (err) {
        res.status(400).send(err.message);
    }
}
module.exports = {
    singleFileUpload
}