const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");

// User model
const Item = require('../../models/Item');
router.post("/", (req, res) => {

    logger.debug("Route: item.post/");
    logger.debug("Inserting item record: " + JSON.stringify(req.body))

    const { code, desc, unit, defaultqty, extCode, category, status, supplierId, otherDetails, created, updated, updatedBy } = req.body;
    if (!code || !desc) {
        logger.error('Please enter all the data');
        res.json({ success: false, msg: "Please enter all the data" });
    }

    Item.findOne({ itm_code: code }).then((item) => {
        if (item) {
            logger.error('Item code already exits' + code);
            return res.json({ success: false, msg: "Item code already exits" });
        }
        const newItem = new Item({
            itm_company: "HLS",
            itm_code: code,
            itm_desc: desc,
            itm_unit: unit,
            // itm_sku: sku,
            itm_default_order_qty: defaultqty,
            itm_ext_code: extCode,
            itm_categroy: category,
            itm_status: status,
            itm_supplier_id: supplierId,
            itm_other_details: otherDetails,
            itm_created: created,
            itm_updated: updated,
            itm_updated_by: updatedBy
        });
        newItem
            .save()
            .then((data) => {
                logger.debug('Item added successfully');
                return res.json({ success: true, msg: " Item added" });
            })
            .catch((err) => {
                logger.errorObj('Error inserting item ' + code, err);
                return res.json({
                    success: false,
                    msg: "Item code could not be saved",
                });
            });
    });
});

// get all groups
router.get("/", (req, res) => {
    logger.debug("Getting list of all items: ");
    logger.debug("Route: item.get/");
    Item.find()
        .then((item) => {
            res.send(item);
        })
        .catch((err) => {
            logger.errorObj("Error getting all items ", err);
        });
});

//get group by code
router.get("/:code", (req, res) => {
    logger.debug("Route: item.get/:code");
    logger.debug("Getting item by code : " + req.params.code);
    Item.find({ itm_code: req.params.code })
        .then((item) => {
            if (item.length == 0) {
                logger.error("No item found " + req.params.code)
                res.send("No item found");
            }
            else res.send(item[0]);
        })
        .catch((err) => {
            logger.errorObj("Error getting item " + req.params.code, err);
        });
});

router.delete("/:code", (req, res) => {
    logger.debug("Route: item.delete/:code");
    Item.find({ itm_code: req.params.code })
        .then((items) => {
            if (items.length == 0) {
                logger.error("Item does not  exists for code " + req.params.code);
                res.send("Item not found");
            }
            else {
                const item = items[0];
                item
                    .delete()
                    .then((itm) => {
                        logger.debug(' Item deleted successfully:', +req.params.code);
                        res.send(`Item ${req.params.code} deleted successfully.`);
                    })
                    .catch((e) => {
                        logger.errorObj("Error deleting item " + req.params.code, e);
                        throw e;
                    });
            }
        })
        .catch((err) => {
            logger.errorObj("Error deleting item " + req.params.code, ex);
            throw err;
        });
});

//update api
router.put("/", (req, res) => {
    logger.debug("Route: item.put/");
    logger.debug("Updating item record: " + JSON.stringify(req.body))
    const { code, desc, unit, defaultqty, extCode, category, status, supplierId, otherDetails, created, updated, updatedBy } = req.body;
    Item.findOne({ itm_code: code }).then((item) => {
        if (!item) {
            logger.error('item does not exist');
            return res.json({ success: false, msg: "item does not exist" });
        }
        Item.updateOne(
            { itm_code: code },
            {
                $set: {
                    itm_desc: desc,
                    itm_unit: unit,
                    // itm_sku: sku,
                    itm_ext_code: extCode,
                    itm_default_order_qty: defaultqty,
                    itm_category: category,
                    itm_status: status,
                    itm_supplier_id: supplierId,
                    itm_other_details: otherDetails,
                    itm_created: created,
                    itm_updated: updated,
                    itm_updated_by: updatedBy
                },
            }
        )
            .then((resp) => {
                logger.debug('Item Profile Updated');
                res.json({
                    success: true,
                    msg: " Item Profile Updated",
                });
            })
            .catch((err) => {
                logger.errorObj('Error to update item' + err);
                if (err) {
                    throw err;
                }
            });
    });
});
module.exports = router;
