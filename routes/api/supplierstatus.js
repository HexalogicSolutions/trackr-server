const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");
// User model
const Supplier = require("../../models/SupplierStatus");
// get all groups
router.get("/", (req, res) => {
    logger.debug("Getting list of all supplier status: ");
    logger.debug("Route: supplierstatus.get/");
    Supplier.find()
        .then((sup) => {
            res.send(sup);
        })
        .catch((err) => {
            logger.errorObj('Error to find supplier status list', err);
        });
});

router.get("/active", (req, res) => {
    logger.debug("Getting list of all supplier status: ");
    logger.debug("Route: supplierstatus.get/");
    Supplier.find({sup_sta_desc:'Active'})
        .then((sup) => {
            res.send(sup);
        })
        .catch((err) => {
            logger.errorObj('Error to find supplier status list', err);
        });
});

module.exports = router;
