const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const StockHeader = require("../../models/StockHeader");
const stockLineNode = require("./stockline");
const StockLine = require("../../models/StockLine");
const Param = require("../../models/Param");
const stockline = require("./stockline");
const logger = require("../../helpers/logger");



router.post("/", async (req, res) => {
    logger.debug("Route: stock.post/");
    const { stockHeader, stockLines } = req.body;
    var number = stockHeader.sth_number;
    logger.debug("Inserting stock record: " + req.body)

    // validation
    if (!number) {
        logger.error("Stock Order Number missing");
        return res.json({ success: false, msg: "Stock Order Number missing" });
    }

    if (stockLines.length === 0) {
        logger.error("No stock items found");
        return res.json({ success: false, msg: "No stock items found" });
    }

    // check order number within stockheader and stockline
    const header = await StockHeader.findOne({ sth_number: number })
    if (header) {
        logger.error("Stock header already exists for order number " + number);
        return res.json({ success: false, msg: "Stock header already exists for order number " + number });
    }


    const line = await StockLine.findOne({ stl_number: number })
    if (line) {
        logger.error("Stock Lines already exists for order number " + number);
        return res.json({ success: false, msg: "Stock Lines already exist for order number " + number });
    }

    // insert stock header
    const stockH = new StockHeader(stockHeader);
    var result = "";
    try {
        result = await insertHeader(stockH);
    }
    catch (ex) {
        throw ex;
    }

    if (result !== "OK") {
        return res.json(result);
    }


    result = "";
    // insert stock line
    // loop through itemList
    for (i = 0; i < stockLines.length; i++) {
        const stockItem = new StockLine(stockLines[i]);
        try {
            result = await insertStockLine(stockItem);
        }
        catch (ex) {
            throw ex;
        }
        if (result !== "OK")
            return res.send(result);
    }
    // fetch record from param for STOCK_TRAN_ID
    const param = await Param.findOne({ par_tag: 'STOCK_TRAN_ID' });
    if (param) {
        param.num_val1 = param.num_val1 + 1;
        const data = await param.save();
        if (!data) {
            logger.error("Error incrementing Stock Order number in param table ");
            return res.json({ success: false, msg: "Error incrementing Stock Order number in param table " });
        }
    }
    else {
        logger.error("STOCK_TRAN_ID record not found in param table ");
        return res.json({ success: false, msg: "STOCK_TRAN_ID record not found in param table " });
    }

    logger.debug("Stock Order created successfully." + number);
    return res.json({ success: true, msg: "Stock Order created successfully." });

});


// get all category
router.get("/", (req, res) => {
    logger.debug("Getting list of all orders: ");
    logger.debug("Route: stock.get/");
    StockHeader.find()
        .then((stkheader) => {
            res.send(stkheader);
        })
        .catch((err) => {
            logger.errorObj("Error getting all orders " + req.params.number, err);
        });
});


//get group by code
router.get("/:number", (req, res) => {
    logger.debug("Route: stock.get/:number");
    logger.debug("Getting stock header : " + req.params.number);
    StockHeader.find({ sth_number: req.params.number })
        .then((header) => {
            if (header.length == 0) {
                logger.error("No stock header found " + req.params.number)
                res.send("No header found");
            }
            else res.send(header[0]);
        })
        .catch((err) => {
            logger.errorObj("Error getting stock header " + req.params.number, err);
        });
});

//get stockline by code 
router.get("/stockline/:number", (req, res) => {
    logger.debug("Route: stock.get/stockline/:number");
    logger.debug("Getting stock lines : " + req.params.number);
    StockLine.find({ stl_number: req.params.number })
        .then((header) => {
            if (header.length == 0) {
                logger.error("No stock lines found " + req.params.number)
                res.send("No lines found");
            }
            else res.send(header);
        })
        .catch((err) => {
            logger.errorObj("Error getting stock lines " + req.params.number, err);
        });
});

//get stock header and line object
router.get("/stocks/:number", async (req, res) => {
    logger.debug("Route: stock.get/stocks/:number");
    logger.debug("Getting stock object : " + req.params.number);
    const sth = await StockHeader.findOne({ sth_number: req.params.number })
    const stl = await StockLine.find({ stl_number: req.params.number })
    const stocks = { sth, stl }
    res.send(stocks);
});

//get stock by purchaseorder
router.get("/ordertype/:type", (req, res) => {
    logger.debug("Route: stock.get/ordertype/:type");
    StockHeader.find({ sth_type: req.params.type })
        .then((header) => {
            if (header.length == 0) {
                logger.error("Purchase order not found", err);
                res.send("No Data found");
            }
            else {
                logger.debug('Getting Purchase orderType')
                res.send(header);
            }
        })
        .catch((err) => {
            logger.errorObj("Error getting Purchase Order " + req.params.type, err);
        });
});

router.delete('/:orderNumber', async (req, res) => {
    logger.debug("Route: stock.delete/:orderNumber");
    const header = await StockHeader.findOne({ sth_number: req.params.orderNumber })
    if (!header) {
        //console.log('stock header is not exists' + req.params.orderNumber)
        logger.error("Stock header is not  exists for order number " + req.params.orderNumber);
        return res.json({ success: false, msg: "Stock header is not  exists for order number " + req.params.orderNumber });

    }
    const line = await StockLine.findOne({ stl_number: req.params.orderNumber })
    if (!line) {
        logger.error("Stock Line is not  exists for order number " + req.params.orderNumber);

        return res.json({ success: false, msg: "Stock Lines is not exist for order number " + req.params.orderNumber });
    }
    var result = "";
    try {
        logger.debug(' Header Deleted Successfully:', +req.params.orderNumber);
        result = await deleteheader(req.params.orderNumber);
    }
    catch (ex) {
        //console.log(ex);
        logger.errorObj("Error  " + req.params.orderNumber, ex);
        throw ex;
    }
    var result = "";
    try {
        logger.debug(' Line Deleted Successfully:', +req.params.orderNumber);
        result = await deleteOrderLines(req.params.orderNumber);
    }
    catch (ex) {
        //console.log(ex);
        logger.errorObj("Error  " + req.params.orderNumber, ex);
        throw ex;
    }
    return res.json({ success: true, msg: "Order Deleted successfully." });
})



//update api
router.put("/", (req, res) => {
    logger.debug("Route: stock.put/");
    const { stockHeader, stockLines } = req.body;
    var number = stockHeader.sth_number;
    console.log(stockHeader);
    StockHeader.findOne({ sth_number: number }).then((header) => {
        if (!header) {
            logger.error("Stock header does not exist " + number);
            return res.json({ success: false, msg: "Stock header does not exist" });
        }
        StockHeader.updateOne(
            { sth_number: number },
            {
                $set: {
                    sth_type: stockHeader.sth_type,
                    sth_status: stockHeader.sth_status,
                    sth_item_count: stockHeader.sth_item_count,
                    sth_notes: stockHeader.sth_notes,
                    sth_date_created: stockHeader.sth_date_created,
                    sth_date_confirmed: stockHeader.sth_date_confirmed,
                    sth_date_updated: stockHeader.sth_date_updated,
                    sth_update_by: stockHeader.sth_update_by,
                    sth_warehouse: stockHeader.sth_warehouse,
                    sth_supplier: stockHeader.sth_supplier,
                    sth_customer: stockHeader.sth_customer,
                    sth_warehouse_from: stockHeader.sth_warehouse_from,
                    sth_warehouse_to: stockHeader.sth_warehouse_to,
                    sth_total_quantity: stockHeader.sth_total_quantity,
                    sth_total_weight: stockHeader.sth_total_weight,
                    sth_weight_unit: stockHeader.sth_weight_unit,
                    sth_total_price: stockHeader.sth_total_price,
                    sth_total_tax: stockHeader.sth_total_tax,
                    sth_currency: stockHeader.sth_currency,
                    sth_src_tran: stockHeader.sth_src_tran,
                    sth_src_tran_type: stockHeader.sth_src_tran_type,
                    sth_hh_user: stockHeader.sth_hh_user,
                },
            }
        )
            .then((resp) => {
                StockLine.find({ stl_number: number }).then(async (line) => {
                    console.log(stockLines);
                    await deleteOrderLines(number);
                    for (i = 0; i < stockLines.length; i++) {
                        const stockItem = new StockLine(stockLines[i]);
                        try {
                            updatedata = await insertStockLine(stockItem);
                        }
                        catch (ex) {
                            throw ex;
                        }
                        if (updatedata !== "OK")
                            return res.send(updatedata);
                    }
                }).then(() => {
                    logger.debug('Stock Updated Successfully');
                    res.json({
                        success: true,
                        msg: "Stock Updated",
                    });
                })
            })
            .catch((err) => {
                if (err) {
                    logger.errorObj('Stock Not Updated' + number, err);
                    res.json({ success: false, msg: "Error" });
                }
            });
    });

});

// functions
async function insertHeader(stockHeader) {
    //console.log("insertHeader");
    const data = await stockHeader.save()
    if (data) {
        logger.debug("Stock header inserted : " + stockHeader.sth_number);
        return "OK";
    }
    else {
        logger.error("Error inserting stock header : " + stockHeader.sth_number, err);
        throw err
    }

}

async function insertStockLine(stockItem) {
    const data = await stockItem.save()
    if (data) {
        logger.debug("Stock line inserted : " + stockItem.stl_number);
        return "OK";
    }
    else {
        logger.error("Error inserting stock line : " + stockItem.stl_number, err);
        throw err
    }
}


async function deleteOrderLines(number) {
    await StockLine.deleteMany({ stl_number: number }, function (err) {
        if (err) {
            logger.error("Error deleting stock lines " + number, err);
            return err.message;
        }
        else {
            logger.debug("Stock lines delete for : " + number);
            return 'OK';
        }
    });
}

async function deleteheader(number) {
    await StockHeader.deleteOne({ sth_number: number }, function (err) {
        if (err) {
            return err.message;
        }
        else {
            return 'OK';
        }
    });
}

module.exports = router;
