
const config = require("config");
const fs = require('fs');
const express = require("express");
const logger = require("../../helpers/logger");
const router = express.Router();

// get all groups
router.get("/", (req, res) => {
    logger.debug("Getting list of all logs: ");
    logger.debug("Route: logs.get/");
    res.send('hello')
});

router.post('/', (req, res) => {
    logger.debug("Route: logs.post/");
    logger.debug("Inserting logs record: " + JSON.stringify(req.body))
    var msgType = req.body.msgType;
    // fs.appendFileSync('F:/HexaLogic/Multer/multer.txt', req.body.logData);
    if ("ERROR" === msgType)
        logger.error(req.body.logData);
    else
        logger.debug(req.body.logData);

})


module.exports = router;
