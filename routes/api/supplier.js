const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");
const Supplier = require("../../models/Supplier");
const { createLogger } = require("winston");
router.post("/", (req, res) => {
  logger.debug("Route: supplier.post/");
  logger.debug("Inserting supplier record: " + JSON.stringify(req.body));
  const {
    code,
    name,
    addr,
    phone,
    mobile,
    email,
    status,
    otherDetails,
    created,
    updated,
    updatedBy,
  } = req.body;
  if (!code || !name) {
    logger.error("Please enter all the data");
    res.json({ success: false, msg: "Please enter all the data" });
  }
  Supplier.findOne({ itm_code: code }).then((item) => {
    if (item) {
      logger.error("Supplier code already exits");
      return res.json({ success: false, msg: "Supplier code already exits" });
    }
    const newSupplier = new Supplier({
      sup_company: "HLS",
      sup_code: code,
      sup_name: name,
      sup_addr: addr,
      sup_phone: phone,
      sup_mobile: mobile,
      sup_email: email,
      sup_status: status,
      sup_other_details: otherDetails,
      sup_created: created,
      sup_updated: updated,
      sup_updated_by: updatedBy,
    });
    newSupplier
      .save()
      .then((data) => {
        logger.debug("Supplier added");
        return res.json({ success: true, msg: " Supplier added" });
      })
      .catch((err) => {
        logger.errorObj("Supplier code could not be saved", err);
        return res.json({
          success: false,
          msg: "Supplier code could not be saved",
        });
      });
  });
});

router.get("/", (req, res) => {
  logger.debug("Getting list of all supplier: ");
  logger.debug("Route: supplier.get/");
  Supplier.find()
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      logger.errorObj("Error to find supplier list", err);
    });
});

router.get("/active/:isActive", (req, res) => {
  let activeFilter = {};
  const isActive = req.params.isActive;

  if (isActive && isActive.toUpperCase() == "Y") {
    activeFilter = {
      sup_status: "ACT",
    };
  }

  Supplier.find(activeFilter)
    .then((sup) => {
      res.send(sup);
    })
    .catch((err) => {
      logger.errorObj("Error to find supplier status list", err);
    });
});

router.get("/:code", (req, res) => {
  logger.debug("Getting supplier by code: ");
  logger.debug("Route: supplier.get/:code");
  Supplier.find({ sup_code: req.params.code })
    .then((item) => {
      if (item.length == 0) {
        logger.error("Supplier not found");
        res.json({ status: 500, msg: "Not Found" });
      } else res.send(item[0]);
    })
    .catch((err) => {
      logger.ererrorObjror("Error to find supplier by code", err);
    });
});
router.delete("/:code", (req, res) => {
  logger.debug("Route: supplier.delete/:code");
  Supplier.find({ sup_code: req.params.code })
    .then((suppliers) => {
      if (suppliers.length == 0) {
        logger.error("Supplier not  found");
        res.send("Supplier not  found");
      } else {
        const supplier = suppliers[0];
        supplier
          .delete()
          .then((sup) => {
            logger.debug(`Supplier ${req.params.code} deleted successfully.`);
            res.send(`Supplier ${req.params.code} deleted successfully.`);
          })
          .catch((e) => {
            logger.errorObj("Error to delete supplier", e);
            throw e;
          });
      }
    })
    .catch((err) => {
      logger.errorObj("Error to delete supplier", err);
      throw err;
    });
});
//update api
router.put("/", (req, res) => {
  logger.debug("Route: supplier.put/");
  logger.debug("Updating supplier record: " + JSON.stringify(req.body));
  const {
    code,
    name,
    addr,
    phone,
    mobile,
    email,
    status,
    otherDetails,
    created,
    updated,
    updatedBy,
  } = req.body;
  Supplier.findOne({ sup_code: code }).then((supplier) => {
    if (!supplier) {
      logger.error("supplier does not exist");
      return res.json({ success: false, msg: "supplier does not exist" });
    }
    Supplier.updateOne(
      { sup_code: code },
      {
        $set: {
          sup_name: name,
          sup_addr: addr,
          sup_phone: phone,
          sup_mobile: mobile,
          sup_email: email,
          sup_status: status,
          sup_other_details: otherDetails,
          sup_created: created,
          sup_updated: updated,
          sup_updated_by: updatedBy,
        },
      }
    )
      .then((resp) => {
        logger.debug("Supplier Profile Updated");
        res.json({
          success: true,
          msg: " Supplier Profile Updated",
        });
      })
      .catch((err) => {
        logger.errorObj("Error to update supplier", err);
        if (err) {
          throw err;
        }
      });
  });
});
module.exports = router;
