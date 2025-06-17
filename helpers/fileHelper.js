const ServerConstants = require('../global/ServerConstants');
const DateHelper = require('./dateHelper');

const FileHelper = {
    // external files folder - harcoded to ext
    getExternalFilesFolderPath() {
        var extFolderPath = process.cwd() + "/" + "" + ServerConstants.EXTERNAL_FILES_FOLDER_NAME;
        return extFolderPath;

    },

    // logs
    getLogFolderPath() {
        var logFolderPath = process.cwd() + "/" + ServerConstants.EXTERNAL_FILES_FOLDER_NAME + "/" + ServerConstants.LOG_FOLDER_NAME;
        return logFolderPath;

    },

    // log file generated for each date - [yyyy-MM-dd-log.txt]
    getLogFilePath() {
        var logFolderPath = this.getLogFolderPath();
        var logFilePath = logFolderPath + "/" + DateHelper.getCurrentDateTimeYYYYMMDD() + '-log.txt';
        return logFilePath;
    },

    // for uploaded files
    getUploadFolderPath() {
        var uploadFolderPath = process.cwd() + "/" + ServerConstants.EXTERNAL_FILES_FOLDER_NAME + "/" + ServerConstants.UPLOAD_FOLDER_NAME;
        return uploadFolderPath;
    },
}
module.exports = FileHelper;