//File for Multer Configuration.....................................
const multer = require('multer');
const ServerConstants = require('../global/ServerConstants');
const FileHelper = require('./fileHelper');
const DateHelper = require('./dateHelper');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, FileHelper.getUploadFolderPath());
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + DateHelper.getCurrentDateTime().replace(/:/g, '-') + ".xlsx");
    }
});

const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb(null, true)
    }
    else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: filefilter });
module.exports = { upload }