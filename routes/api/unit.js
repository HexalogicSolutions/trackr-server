const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");

const Unit = require('../../models/Unit');
router.post("/", (req, res) => {
  logger.debug("Route: unit.post/");
  logger.debug("Inserting unit record: " + JSON.stringify(req.body))
  const { code, name } = req.body;
  if (!code || !name) {
    logger.error('Please enter all the data');
    res.json({ success: false, msg: "Please enter all the data" });
  }

  Unit.findOne({ unt_code: code }).then((unit) => {
    if (unit) {
      logger.error('Unit code already exits');
      return res.json({ success: false, msg: "Unit code already exits" });
    }
    const newUnit = new Unit({
      unt_code: code,
      unt_name: name,
    });
    newUnit
      .save()
      .then((data) => {
        logger.debug('Unit added');
        return res.json({ success: true, msg: " Unit added" });
      })
      .catch((err) => {
        logger.errorObj('Unit code could not be saved', err);
        return res.json({
          success: false,
          msg: "Unit code could not be saved",
        });
      });
  });
});


router.get("/", (req, res) => {
 
  logger.debug("Getting list of all unit: ");
  logger.debug("Route: unit.get/");
  Unit.find()
    .then((unit) => {
      res.send(unit);
    })
    .catch((err) => {
      logger.errorObj('Error to find unit list', err);
    });
});


router.get("/:code", (req, res) => {
  logger.debug("Getting unit by code: ");
  logger.debug("Route: unit.get/:code");
  Unit.find({ unt_code: req.params.code })
    .then((unit) => {
      if (unit.length == 0) {
        logger.error('Unit not found');
        res.send("Unit not found");
      }
      else res.send(unit[0]);
    })
    .catch((err) => {
      logger.errorObj('Error to find unit', err);
    });
});

router.delete("/:code", (req, res) => {
  logger.debug("Route: unit.delete/:code");
  Unit.find({ unt_code: req.params.code })
    .then((units) => {
      if (units.length == 0) {
        logger.error('Unit not found')
        res.send("unit not  found");
      }
      else {
        const unit = units[0];
        unit
          .delete()
          .then((unt) => {
            logger.debug(`Unit ${req.params.code} deleted successfully.`)
            res.send(`Unit ${req.params.code} deleted successfully.`);
          })
          .catch((e) => {
            logger.errorObj('Error to delete unit by code', err);
            throw e;
          });
      }
    })
    .catch((err) => {
      logger.errorObj('Error to delete unit by code', err);
      throw err;
    });
});

//update api
router.put("/", (req, res) => {
  logger.debug("Route: unit.put/");
  logger.debug("Updating unit record: " + JSON.stringify(req.body))
  const { code, name } = req.body;
  Unit.findOne({ unt_code: code }).then((unit) => {
    if (!unit) {
      logger.error('unit does not exist');
      return res.json({ success: false, msg: "unit does not exist" });
    }
    Unit.updateOne(
      { unt_code: code },
      {
        $set: {
          unt_name: name,
        },
      }
    )
      .then((resp) => {
        logger.debug('Unit Profile Updated')
        res.json({
          success: true,
          msg: "Unit Profile Updated",
        });
      })
      .catch((err) => {
        logger.errorObj('Error to update unit', err);
        if (err) {
          throw err;
        }
      });
  });
});
module.exports = router;
