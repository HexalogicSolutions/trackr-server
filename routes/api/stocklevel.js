const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");
const StockLevel = require('../../models/StockLevel');
router.post("/", (req, res) => {
    logger.debug("Route: stocklevel.post/");
    logger.debug("Inserting stocklevel record: " + JSON.stringify(req.body))
    const { item, itemDesc, lot, warehouse, sku, qty, weight, weightUnit } = req.body;
    if (!item) {
        logger.error('Please enter all the data')
        res.json({ success: false, msg: "Please enter all the data" });
    }

    StockLevel.findOne({ stk_item: item }).then((level) => {
        if (level) {
            logger.error('Stock Level number already exits');
            return res.json({ success: false, msg: "Stock Level number already exits" });
        }
        const newStkLevel = new StockLevel({
            stk_item: item,
            stk_item_desc: itemDesc,
            stk_lot: lot,
            stk_warehouse: warehouse,
            stk_sku: sku,
            stk_qty: qty,
            stk_weight: weight,
            stk_weight_unit: weightUnit
        });
        newStkLevel
            .save()
            .then((data) => {
                logger.debug('StockLevel added');
                return res.json({ success: true, msg: "StockLevel added" });
            })
            .catch((err) => {
                logger.errorObj('StockLevel could not be saved');
                return res.json({
                    success: false,
                    msg: "StockLevel could not be saved",
                });
            });
    });
});


router.get("/", (req, res) => {
    logger.debug("Getting list of all stocklevel: ");
    logger.debug("Route: stock.get/");
    StockLevel.find()
        .then((stKlevel) => {
            res.send(stKlevel);
        })
        .catch((err) => {
            logger.errorObj('Error to find stocklevel', err);
        });
});


router.get("/:item", (req, res) => {
    logger.debug("Getting stocklevel by item: ");
    logger.debug("Route: stocklevel.get/:item");
    StockLevel.find({ stk_item: req.params.item })
        .then((level) => {
            if (level.length == 0) {
                logger.error('No Stock Level found');
                res.send("No Stock Level found");
            }
            else res.send(level[0]);
        })
        .catch((err) => {
            logger.errorObj('Error to find stocklevel by item', err);
        });
});

router.delete("/:item", (req, res) => {
    logger.debug("Route: stocklevel.delete/:item");
    StockLevel.find({ stk_item: req.params.item })
        .then((level) => {
            if (level.length == 0) {
                logger.error('stock Level not  found');
                res.send("stock Level not  found");
            }
            else {
                const stklevel = level[0];
                stklevel
                    .delete()
                    .then((stk) => {
                        logger.debug(`Stock Level ${req.params.item} deleted successfully.`);
                        res.send(`Stock Level ${req.params.item} deleted successfully.`);
                    })
                    .catch((e) => {
                        logger.errorObj('Error to delete stocklevel', e);
                        throw e;
                    });
            }
        })
        .catch((err) => {
            logger.errorObj('Error to delete stocklevel', err);
            throw err;
        });
});

//update api
router.put("/", (req, res) => {
    logger.debug("Route: stocklevel.put/");
    const { item, itemDesc, lot, warehouse, sku, qty, weight, weightUnit } = req.body;


    StockLevel.findOne({ stk_item: item }).then((level) => {
        if (!level) {
            logger.error('Stock Level does not exist');
            return res.json({ success: false, msg: "Stock Level does not exist" });
        }
        StockLevel.updateOne(
            { stk_item: item },
            {
                $set: {
                    stk_item_desc: itemDesc,
                    stk_lot: lot,
                    stk_warehouse: warehouse,
                    stk_sku: sku,
                    stk_qty: qty,
                    stk_weight: weight,
                    stk_weight_unit: weightUnit
                },
            }
        )
            .then((resp) => {
                logger.debug('StockLevel Updated');
                res.json({
                    success: true,
                    msg: "StockLevel Updated",
                });
            })
            .catch((err) => {
                logger.errorObj('Error to update stocklevel', err);
                if (err) {
                    throw err;
                }
            });
    });
});
module.exports = router;
