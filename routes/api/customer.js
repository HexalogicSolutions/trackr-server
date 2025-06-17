const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();

const Customer = require('../../models/Customer');
const logger = require("../../helpers/logger");
router.post("/", (req, res) => {
    logger.debug("Route: customer.post/");
    logger.debug("Inserting customer record: " + JSON.stringify(req.body));
    const { code, name, addr, phone, mobile, email, status, otherDetails, created, updated, updatedBy } = req.body;
    if (!code || !name) {
        logger.error('Please enter all the data');
        res.json({ success: false, msg: "Please enter all the data" });
    }
    Customer.findOne({ itm_code: code }).then((item) => {
        if (item) {
            logger.error('Customer code already exits');
            return res.json({ success: false, msg: "Customer code already exits" });
        }
        const newCustomer = new Customer({
            cus_company: "HLS",
            cus_code: code,
            cus_name: name,
            cus_addr: addr,
            cus_phone: phone,
            cus_mobile: mobile,
            cus_email: email,
            cus_status: status,
            cus_other_details: otherDetails,
            cus_created: created,
            cus_updated: updated,
            cus_updated_by: updatedBy
        });
        newCustomer
            .save()
            .then((data) => {
                logger.debug('Customer Added')
                return res.json({ success: true, msg: " Customer added" });
            })
            .catch((err) => {
                logger.errorObj('Customer code could not be saved', err);
                return res.json({
                    success: false,
                    msg: "Customer code could not be saved",
                });
            });
    });
});
// get all cutomers
router.get("/", (req, res) => {
    logger.debug("Route: customer.get/");
    logger.debug("Getting customer list: ")
    
    Customer.find()
        .then((item) => {
            logger.debug('Customer find' + item)
            console.log(item);
            res.send(item);
        })
        .catch((err) => {
            logger.errorObj('Customer not find', err)
        });
});
//get group by code
router.get("/:code", (req, res) => {
    logger.debug("Route: customer.get/:code");
    logger.debug("Getting customer record: ")
    Customer.find({ cus_code: req.params.code })
        .then((item) => {
            if (item.length == 0) {
                logger.error('Customer not found');
                res.json({ status: 500, msg: 'Not Found' })
            }
            else res.send(item[0]);
        })
        .catch((err) => {
            logger.errorObj('Error finding customer:', err)
        });
});
router.delete("/:code", (req, res) => {
    logger.debug("Route: customer.get/:code");
    logger.debug("Deleting customer record: ")
    Customer.find({ cus_code: req.params.code })
        .then((customers) => {
            if (customers.length == 0) {
                logger.error('Customer not found')
                res.send("Customer not  found");
            }
            else {
                const customer = customers[0];
                customer
                    .delete()
                    .then((sup) => {
                        logger.debug('Customer deleted successfully' + req.params.code)
                        res.send(`Customer ${req.params.code} deleted successfully.`);
                    })
                    .catch((e) => {
                        logger.errorObj('Error Deleting Customer', e)
                        throw e;
                    });
            }
        })
        .catch((err) => {
            logger.errorObj('Error Deleting Customer', err)
            throw err;
        });
});
//update api
router.put("/", (req, res) => {
    logger.debug("Route: customer.post/");
    logger.debug("Updating customer record: " + req.body.toString())
    const { code, name, addr, phone, mobile, email, status, otherDetails, created, updated, updatedBy } = req.body;
    Customer.findOne({ cus_code: code }).then((customer) => {
        if (!customer) {
            logger.error('Customer does not exist');
            return res.json({ success: false, msg: "customer does not exist" });
        }
        Customer.updateOne(
            { cus_code: code },
            {
                $set: {
                    cus_name: name,
                    cus_addr: addr,
                    cus_phone: phone,
                    cus_mobile: mobile,
                    cus_email: email,
                    cus_status: status,
                    cus_other_details: otherDetails,
                    cus_created: created,
                    cus_updated: updated,
                    cus_updated_by: updatedBy
                },
            }
        )
            .then((resp) => {
                logger.debug('Customer Updated')
                res.json({
                    success: true,
                    msg: " Customer Updated",
                });
            })
            .catch((err) => {
                logger.errorObj('Error updating Customer', err)
                if (err) {
                    throw err;
                }
            });
    });
});
module.exports = router;
