const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");
const LocationArea = require("../../models/LocationArea");

router.post("/", (req, res) => {
  logger.debug("Route: locationarea.post/");
  logger.debug("Inserting locationarea record: " + JSON.stringify(req.body))
  const { code, name, active } = req.body;


  if (!name) {
    logger.error('Please enter all the data');
    res.json({ success: false, msg: "Please enter all the data" });
  }

  LocationArea.findOne({ lar_name: name })
    .collation({ locale: 'en_US', strength: 2 })
    .then((locationarea) => {
      if (locationarea) {
        logger.error('Name already exits');
        return res.json({ success: false, msg: "Name already exits" });
      }
      if (code === undefined || code.length == 0) {

        LocationArea.find({})
          .select("lar_code")
          .sort({ lar_code: -1 })
          .limit(1)
          .exec(function (err, doc) {
            let max_code = doc[0].lar_code;

            const newlocationarea = new LocationArea({
              lar_company: "HLS",
              lar_code: max_code + 1,
              lar_name: name,
              lar_active: active,
            });

            newlocationarea
              .save()
              .then((data) => {
                logger.debug('location area added');
                return res.json({ success: true, msg: " location area added" });
              })
              .catch((err) => {
                logger.errorObj('location area name could not be saved', err);
                return res.json({
                  success: false,
                  msg: "location area name could not be saved",
                });
              });
          });
      } else {
        const newlocationarea = new LocationArea({
          lar_company: "HLS",
          lar_code: code,
          lar_name: name,
          lar_active: active,
        });

        newlocationarea
          .save()
          .then((data) => {
            logger.debug('location area added');
            return res.json({ success: true, msg: " location area added" });
          })
          .catch((err) => {
            logger.errorObj('location area name could not be saved', err);
            return res.json({
              success: false,
              msg: "location area name could not be saved",
            });
          });
      }
    });
});

// get all groups
router.get("/", (req, res) => {
  logger.debug("Getting list of all location area: ");
  logger.debug("Route: locationarea.get/");
  LocationArea.find()
    .then((locationarea) => {
      res.send(locationarea);
    })
    .catch((err) => {
      logger.errorObj('Error to find location area', err);
    });
});


router.get("/active/:isActive", (req, res) => {
  let activeFilter = {};
  const isActive = req.params.isActive;

  if (isActive && isActive.toUpperCase() == "Y") {
    activeFilter = {
      lar_active: "true",
    };
  }

  LocationArea.find(activeFilter)
    .then((lar) => {
      res.send(lar);
    })
    .catch((err) => {
      logger.errorObj("Error to find location area list", err);
    });
});




// get group by code
router.get("/:code", (req, res) => {
  logger.debug("Getting location area by code: ");
  logger.debug("Route: locationarea.get/:code");
  LocationArea.find({ lar_code: req.params.code })
    .then((locationarea) => {
      if (locationarea.length == 0) {
        logger.error('No location area found');
        res.send("No location area found");
      }
      else res.send(locationarea[0]);
    })
    .catch((err) => {
      logger.errorObj('Error to find location area', err);
    });
});


router.delete("/:code", (req, res) => {
  logger.debug("Deleting location area: ");
  logger.debug("Route: locationarea.delete/:code");
  LocationArea.find({ lar_code: req.params.code })
    .then((locationarea) => {
      if (locationarea.length == 0) {
        logger.error('Location  area not  found')
        res.send("Location  area not  found");
      }
      else {
        const locationArea = locationarea[0];
        locationArea
          .delete()
          .then((larea) => {
            logger.debug('Location area deleted successfully');
            res.send(
              `Location area code ${req.params.code} deleted successfully.`
            );
          })
          .catch((e) => {
            logger.errorObj('Error to delete loction area')
            throw e;
          });
      }
    })
    .catch((err) => {
      logger.errorObj('Error to delete loction area', err)
      throw err;
    });
});

//update api
router.put("/", (req, res) => {
  const { code, name, active, type } = req.body;

  logger.debug("Route: locationarea.put/");
  logger.debug("Updating locationarea record: " + JSON.stringify(req.body))

  LocationArea.findOne({ lar_code: code }).then((locationarea) => {
    if (!locationarea) {
      logger.error('location area not exist');
      return res.json({ success: false, msg: "location area not exist" });
    }
    LocationArea.updateOne(
      { lar_code: code },
      {
        $set: {
          lar_type: type,
          lar_name: name,
          lar_active: active,
        },
      }
    )
      .then((resp) => {
        logger.debug('Locaiton area Updated');
        res.json({
          success: true,
          msg: "Locaiton area Updated",
        });
      })
      .catch((err) => {
        logger.errorObj('Error to update location area', err);
        if (err) {
          throw err;
        }
      });
  });
});

module.exports = router;
