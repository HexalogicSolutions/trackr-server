const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const Trace = require("../../models/Trace");
const logger = require("../../helpers/logger");
const router = express.Router();

//Trace Post API
router.post("/", (req, res) => {
    logger.debug("Route: trace.post/");
    logger.debug("Inserting trace record: " + JSON.stringify(req.body))
    console.log('Enter post trace');
    const {
        status,
        order_type,
        order_no,
        user,
        description,
        operation,
        file,
        date_time
    } = req.body;
    console.log('Body', req.body);
    Trace.findOne({ trc_order_no: order_no }).then((trc) => {
        // console.log(trc);
        // if (trc.trc_description === "") {
        //     logger.error('Description can not be blank');
        //     return res.json({ success: false, msg: "Description can not be blank" });
        // }
        // else if (trc.trc_operation === "") {
        //     logger.error('Operation can not be blank');
        //     return res.json({ success: false, msg: "Operation can not be blank" });
        // }
        const newTrace = new Trace({
            trc_compnay_code: "HLS",
            trc_status: status,
            trc_order_type: order_type,
            trc_order_no: order_no,
            trc_user: user,
            trc_description: description,
            trc_operation: operation,
            trc_file: file,
            trc_date_time: date_time
        });
        console.log('Trace', newTrace);
        newTrace
            .save()
            .then((data) => {
                logger.debug('Trace Added' + data)
                // console.log('Trace Added');
                return res.json({ success: true, msg: " Trace added" });
            })
            .catch((err) => {
                logger.errorObj('Trace could not be saved', err)
                return res.json({
                    success: false,
                    msg: "Trace could not be saved",
                });
            });
    });
});

//Get API for Order number
router.get("/:no", (req, res) => {
    logger.debug("Getting trace by number: ");
    logger.debug("Route: trace.get/:no");
    Trace.find({ trc_order_no: req.params.no })
        .then((trc) => {
            if (trc.length == 0) {
                logger.error('Trace not found');
                res.send("No Trace found");
            }
            else res.send(trc[0]);
        })
        .catch((err) => {
            logger.errorObj('Error to find Trace', err);
        });
});

//Delete API 
router.delete("/:no", (req, res) => {
    logger.debug("Route: trace.delete/");
    Trace.find({ trc_order_no: req.params.no })
        .then((trace) => {
            if (trace.length == 0) {
                logger.error('Trace not found')
                res.send("Trace not  found");
            }
            else {
                const trc = trace[0];
                trc
                    .delete()
                    .then((trc) => {
                        logger.debug('Trace Deleted Successfully');
                        res.send(`Trace ${req.params.no} deleted successfully.`);
                    })
                    .catch((e) => {
                        logger.errorObj('Error Deleting Records', e)
                        throw e;
                    });
            }
        })
        .catch((err) => {
            throw err;
        });
});
module.exports = router;
