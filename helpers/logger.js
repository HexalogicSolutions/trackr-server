const config = require("config");
const fs = require('fs');
const express = require("express");
const router = express.Router();
const ServerConstants = require('../global/ServerConstants');
const DateHelper = require("./dateHelper");
const fileHelper = require("./fileHelper");

const logger = {

    debug(msg) {
        var msgString = DateHelper.getCurrentDateTime() + "|" + "DEBUG" + "|" + msg + "\n";
        fs.appendFileSync(fileHelper.getLogFilePath(), msgString);
    },

    error(msg) {
        var msgString = DateHelper.getCurrentDateTime() + "|" + "ERROR" + "|" + msg + "\n";
        fs.appendFileSync(fileHelper.getLogFilePath(), msgString);
    },

    errorObj(msg, err) {
        var msgString = DateHelper.getCurrentDateTime() + "|" + "ERROR" + "|" + msg + " : " + err.message + " - " + err.stack + "\n";
        fs.appendFileSync(fileHelper.getLogFilePath(), msgString);
    },
}
module.exports = logger;