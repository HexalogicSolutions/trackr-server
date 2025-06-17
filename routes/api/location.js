const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");
const Location = require("../../models/Location");

router.post("/", (req, res) => {
  const { code, name, enable, area } = req.body;
  logger.debug("Route: location.post/");
  logger.debug("Inserting location record: " + JSON.stringify(req.body))

  if (!name) {
    logger.error('Please enter all the data');
    res.json({ success: false, msg: "Please enter all the data" });
  }

  Location.findOne({ loc_name: name })
    .collation({ locale: 'en_US', strength: 2 })
    .then((location) => {
      if (location) {
        logger.error('Name already exits');
        return res.json({ success: false, msg: "Name already exits" });
      }
      if (code === undefined || code.length == 0) {
        Location.find({})
          .select("loc_code")
          .sort({ loc_code: -1 })
          .limit(1)
          .exec(function (err, doc) {
            let max_code = doc[0].loc_code;
            const newLocation = new Location({
              loc_company: "HLS",
              loc_code: max_code + 1,
              loc_area: area,
              loc_name: name,
              loc_enable: enable,
            });

            newLocation
              .save()
              .then((data) => {
                logger.debug('Location added');
                return res.json({ success: true, msg: "  Location added" });
              })
              .catch((err) => {
                logger.errorObj('Location name could not be saved', err);
                return res.json({
                  success: false,
                  msg: "Location name could not be saved",
                });
              });
          });
      }
      else {
        const newLocation = new Location({
          loc_company: "HLS",
          loc_code: code,
          loc_area: area,
          loc_name: name,
          loc_enable: enable,
        });

        newLocation
          .save()
          .then((data) => {
            logger.debug('Location added');
            return res.json({ success: true, msg: "  Location added" });
          })
          .catch((err) => {
            logger.errorObj('Location name could not be saved', err);
            return res.json({
              success: false,
              msg: "Location name could not be saved",
            });
          });
      }
    });
});

// get all locations
router.get("/", (req, res) => {
  logger.debug("Getting list of all location: ");
  logger.debug("Route: location.get/");
  Location.find()
    .then((location) => {
      res.send(location);
    })
    .catch((err) => {
      logger.errorObj('Error to find location', err);
    });
});

router.get("/active/:isActive", (req, res) => {
  let activeFilter = {};
  const isActive = req.params.isActive;

  if (isActive && isActive.toUpperCase() == "Y") {
    activeFilter = {
      loc_enable: "true",
    };
  }

  Location.find(activeFilter)
    .then((loc) => {
      res.send(loc);
    })
    .catch((err) => {
      logger.errorObj("Error to find location list", err);
    });
});

// get locations by code
router.get("/:code", (req, res) => {
  logger.debug("Getting list of all location by code: ");
  logger.debug("Route: stock.get/:code");
  Location.find({ loc_code: req.params.code })
    .then((location) => {
      if (location.length == 0) {
        logger.error('No Location found');
        res.send("No Location found");
      }
      else res.send(location[0]);
    })
    .catch((err) => {
      logger.errorObj('Error to find location by code', err);
    });
});


// get locations by area
router.get("/area/:code", (req, res) => {
  logger.debug("Getting list of all location by area: ");
  logger.debug("Route: location.get/area/:code");
  Location.find({ loc_area: req.params.code })
    .then((location) => {
      if (location.length == 0) {
        logger.error('No locations found');
        res.send("No locations found");
      }
      else res.send(location[0]);
    })
    .catch((err) => {
      logger.errorObj('Error to find locations by area');
    });
});


router.delete("/:code", (req, res) => {
  logger.debug(" Deleting locations: ");
  logger.debug("Route: location.delete/:code");
  Location.find({ loc_code: req.params.code })
    .then((Location) => {
      if (Location.length == 0) {
        logger.error('location not found');
        res.send("location not found");
      }
      else {
        const location = Location[0];
        location
          .delete()
          .then((etsub) => {
            logger.debug('location deleted successfully' + req.params.code);
            res.send(
              `location code ${req.params.code} deleted successfully.`
            );
          })
          .catch((e) => {
            logger.errorObj('Error to delete location', e);
            throw e;
          });
      }
    })
    .catch((err) => {
      logger.errorObj('Error to delete location', err);
      throw err;
    });
});

//update api
router.put("/", (req, res) => {
  logger.debug("Updating location: ");
  logger.debug("Route: location.put/");
  const { code, name, enable, type, area } = req.body;

  Location.findOne({ loc_code: code }).then((location) => {
    if (!location) {
      logger.error('Location not exist');
      return res.json({ success: false, msg: "Location not exist" });
    }

    Location.updateOne(
      { loc_code: code },
      {
        $set: {
          loc_type: type,
          loc_area: area,
          loc_name: name,
          loc_enable: enable,
        },
      }
    )
      .then((resp) => {
        logger.debug('Location Updated');
        res.json({
          success: true,
          msg: " Location Updated",
        });
      })
      .catch((err) => {
        logger.errorObj('Error to update location', err)
        if (err) {
          throw err;
        }
      });
  });
});
module.exports = router;
