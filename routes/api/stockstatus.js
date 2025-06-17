
const config = require("config");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");

const StockStatus = require("../../models/StockStatus");

router.get("/", (req, res) => {
    logger.debug("Getting list of all stockstatus: ");
    logger.debug("Route: stockstatus.get/");
    StockStatus.find()
        .then((stk) => {
            res.send(stk);
        })
        .catch((err) => {
            logger.errorObj('Error to find stockstatus');
        });
});

module.exports = router;
