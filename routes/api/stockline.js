const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const StockLine = require("../../models/StockLine");
const logger = require("../../helpers/logger");
router.post("/", (req, res) => {
    logger.debug("Route: stockline.post/");
    logger.debug("Inserting stockline record: " + JSON.stringify(req.body))
    const { number, line, item, itemDesc, sku, lot, notes, qty, qtyReq, qtyVar, weight, weightReq, weightVar, weightUnit, price, tax, currencey } = req.body;
    if (!number) {
        logger.error('Please enter all the data');
        res.json({ success: false, msg: "Please enter all the data" });
    }

    StockLine.findOne({ stl_number: number }).then((line) => {
        if (line) {
            logger.error('Stock Line number already exits');
            return res.json({ success: false, msg: "Stock Line number already exits" });
        }
        const newStlLine = new StockLine({
            stl_number: number,
            stl_line: line,
            stl_item: item,
            stl_item_desc: itemDesc,
            stl_sku: sku,
            stl_lot: lot,
            stl_notes: notes,
            stl_qty: qty,
            stl_qty_requested: qtyReq,
            stl_qty_variance: qtyVar,
            stl_weight: weight,
            stl_weight_requested: weightReq,
            stl_weight_variance: weightVar,
            stl_wgt_unit: weightUnit,
            stl_price: price,
            stl_tax: tax,
            stl_currency: currencey
        });
        newStlLine
            .save()
            .then((data) => {
                logger.debug('StockLine added');
                return res.json({ success: true, msg: "StockLine added" });
            })
            .catch((err) => {
                logger.errorObj('StockLine could not be saved', err);
                return res.json({
                    success: false,
                    msg: "StockLine could not be saved",
                });
            });
    });
});

function insertStockLine(stockItem) {
    const { number, line, item, itemDesc, sku, lot, notes, qty, qtyReq, qtyVar, weight, weightReq, weightVar, weightUnit, price, tax, currencey: currency } = stockItem;
    if (!number) {
        logger.error('Please enter all the data');
        res.json({ success: false, msg: "Please enter all the data" });
    }
    StockLine.findOne({ stl_number: number }).then((stockline) => {
        if (stockline) {
            logger.error('Stock Line number already exits');
            return res.json({ success: false, msg: "Stock Line number already exits" });
        }
        const newStlLine = new StockLine({
            stl_number: number,
            stl_line: line,
            stl_item: item,
            stl_item_desc: itemDesc,
            stl_sku: sku,
            stl_lot: lot,
            stl_notes: notes,
            stl_qty: qty,
            stl_qty_requested: qtyReq,
            stl_qty_variance: qtyVar,
            stl_weight: weight,
            stl_weight_requested: weightReq,
            stl_weight_variance: weightVar,
            stl_wgt_unit: weightUnit,
            stl_price: price,
            stl_tax: tax,
            stl_currency: currency
        });
        newStlLine
            .save()
            .then((data) => {

                return //console.log("StockLine added");
            })
            .catch((err) => {
                logger.errorObj('StockLine could not be saved', err);
                return res.json({
                    success: false,
                    msg: "StockLine could not be saved",
                });
            });
    });
}


router.get("/", (req, res) => {
    logger.debug("Getting list of all stockline: ");
    logger.debug("Route: stockline.get/");
    StockLine.find()
        .then((stllevel) => {
            res.send(stllevel);
        })
        .catch((err) => {
            logger.errorObj('Error to find stockline', err);
        });
});


router.get("/:number", (req, res) => {
    logger.debug("Getting stockline by number: ");
    logger.debug("Route: stockline.get/:number");
    StockLine.find({ stl_number: req.params.number })
        .then((line) => {
            if (line.length == 0) {
                logger.error('Stock line not found')
                res.send("No Stock Line found");
            }
            else res.send(line[0]);
        })
        .catch((err) => {
            logger.errorObj('Error to find stockline', err)
        });
});
//update api
router.put("/", (req, res) => {
    logger.debug("Route: stockline.put/");
    logger.debug("Updating stockline record: " + JSON.stringify(req.body))
    const { number, line, item, itemDesc, sku, lot, notes, qty,
        qtyReq, qtyVar, weight, weightReq, weightVar, weightUnit,
        price, tax, currencey } = req.body;

    StockLine.findOne({ stl_number: number }).then((line) => {
        if (!line) {
            logger.error('Stock Line does not exist');
            return res.json({ success: false, msg: "Stock Line does not exist" });
        }
        StockLine.updateOne(
            { stl_number: number },
            {
                $set: {
                    stl_line: line,
                    stl_item: item,
                    stl_item_desc: itemDesc,
                    stl_sku: sku,
                    stl_lot: lot,
                    stl_notes: notes,
                    stl_qty: qty,
                    stl_qty_requested: qtyReq,
                    stl_qty_variance: qtyVar,
                    stl_weight: weight,
                    stl_weight_requested: weightReq,
                    stl_weight_variance: weightVar,
                    stl_wgt_unit: weightUnit,
                    stl_price: price,
                    stl_tax: tax,
                    stl_currency: currencey
                },
            }
        )
            .then((resp) => {
                logger.debug('StockLine Updated');
                res.json({
                    success: true,
                    msg: "StockLine Updated",
                });
            })
            .catch((err) => {
                logger.errorObj('Error to find stockline', err);
                if (err) {
                    throw err;
                }
            });
    });
});

// module.exports = router;
// module.exports = insertStockLine;

module.exports = {
    router: router,
    insertStockLine: insertStockLine
};
