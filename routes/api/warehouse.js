const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");
const Warehouse = require("../../models/Warehouse");

router.post("/", (req, res) => {
  logger.debug("Route: warehouse.post/");
  logger.debug("Inserting warehouse record: " + JSON.stringify(req.body))
  const { code, name, active } = req.body;

  if (!name) {
    logger.error('Please enter all the data');
    res.json({ success: false, msg: "Please enter all the data" });
  }

  Warehouse.findOne({ whs_name: name })
    .collation({ locale: 'en_US', strength: 2 })
    .then((warehouse) => {
      if (warehouse) {
        logger.error('Name already exits');
        return res.json({ success: false, msg: "Name already exits" });
      }
      if (code == undefined || code.length == 0) {
        Warehouse.find({})
          .select("whs_code")
          .sort({ whs_code: -1 })
          .limit(1)
          .exec(function (err, doc) {
            let max_code = doc[0].whs_code;
            const newLocation = new Warehouse({
              whs_company: "HLS",
              whs_code: max_code + 1,
              whs_name: name,
              whs_active: active,
            });

            newLocation
              .save()
              .then((data) => {
                logger.debug('Warehouse added');
                return res.json({ success: true, msg: " Warehouse added" });
              })
              .catch((err) => {
                logger.errorObj('Warehouse name could not be saved', err)
                return res.json({
                  success: false,
                  msg: "Warehouse name could not be saved",
                });
              });
          });
      }
      else {
        const newLocation = new Warehouse({
          whs_company: "HLS",
          whs_code: code,
          whs_name: name,
          whs_active: active,
        });

        newLocation
          .save()
          .then((data) => {
            logger.debug('Warehouse added')
            return res.json({ success: true, msg: " Warehouse added" });
          })
          .catch((err) => {
            logger.errorObj('Warehouse name could not be saved', err)
            return res.json({
              success: false,
              msg: "Warehouse name could not be saved",
            });
          });
      }
    });
});

router.get("/active/:isActive", (req, res) => {
  let activeFilter = {};
  const isActive = req.params.isActive;

  if (isActive && isActive.toUpperCase() == "Y") {
    activeFilter = {
      whs_active: "true",
    };
  }

  Warehouse.find(activeFilter)
    .then((wr) => {
      res.send(wr);
    })
    .catch((err) => {
      logger.errorObj("Error to find warehouse list", err);
    });
});


router.get("/", (req, res) => {
  logger.debug("Getting list of all warehouse: ");
  logger.debug("Route: warehouse.get/");
  Warehouse.find()
    .then((warehouse) => {
      res.send(warehouse);
    })
    .catch((err) => {
      logger.errorObj('Error to find warehouse list', err);
    });
});


router.get("/:code", (req, res) => {
  logger.debug("Getting warehouse by code: ");
  logger.debug("Route: warehouse.get/:code");
  Warehouse.find({ whs_code: req.params.code })
    .then((warehouse) => {
      if (warehouse.length == 0) {
        logger.error('Warehouse not found')
        res.send("Warehouse not found");
      }
      else res.send(warehouse[0]);
    })
    .catch((err) => {
      logger.errorObj('Error to find warehouse by code', err)
    });
});

router.delete("/:code", (req, res) => {
  logger.debug("Delete warehouse by code: ");
  logger.debug("Route: warehouse.get/:code");
  Warehouse.find({ whs_code: req.params.code })
    .then((Warehouse) => {
      if (Warehouse.length == 0) {
        logger.error('Warehouse not found');
        res.send("warehouse not found");
      }
      else {
        const warehouse = Warehouse[0];
        warehouse.delete()
          .then((ett) => {
            logger.debug(`Warehouse code ${req.params.code} deleted successfully.`)
            res.send(
              `Warehouse code ${req.params.code} deleted successfully.`
            );
          })
          .catch((e) => {
            logger.errorObj('Error to delete wareshouse', e);
            throw e;
          });
      }
    })
    .catch((err) => {
      logger.errorObj('Error to delete wareshouse', err);
      throw err;
    });
});

//update api
router.put("/", (req, res) => {
  logger.debug("Route: warehouse.put/");
  logger.debug("Updating warehouse record: " + JSON.stringify(req.body))
  const { code, name, active } = req.body;

  Warehouse.findOne({ whs_code: code }).then((warehouse) => {
    if (!warehouse) {
      logger.error('Location type not exist');
      return res.json({ success: false, msg: "Location type not exist" });
    }

    Warehouse.updateOne(
      { whs_code: code },
      {
        $set: {
          whs_name: name,
          whs_active: active,
        },
      }
    )
      .then((resp) => {
        logger.debug('Location type Updated');
        res.json({
          success: true,
          msg: " Location type Updated",
        });
      })
      .catch((err) => {
        logger.errorObj('Error to update wareshouse', err);
        if (err) {
          throw err;
        }
      });
  });
});

module.exports = router;
