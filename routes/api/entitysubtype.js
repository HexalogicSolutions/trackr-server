const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");

const EntitySubType = require("../../models/EntitySubType");

router.post("/", (req, res) => {
  logger.debug("Route: entitysubtype.post/");
  logger.debug("Inserting entitysubtype record: " + JSON.stringify('req.data'))
  const { code, name, type, active } = req.body;
  if (!name) {
    logger.error('Please enter all the data');
    res.json({ success: false, msg: "Please enter all the data" });
  }
  EntitySubType.findOne({ est_name: name })
    .collation({ locale: 'en_US', strength: 2 })
    .then((entitysubType) => {
      if (entitysubType) {
        logger.error('Name already exits')
        return res.json({ success: false, msg: "Name already exits" });
      }

      if (code === undefined || code.length == 0) {
        EntitySubType.find({})
          .select("est_code")
          .sort({ est_code: -1 })
          .limit(1)
          .exec(function (err, doc) {
            let max_code = doc[0].est_code;
            const newEntitySub = new EntitySubType({
              est_company: "HLS",
              est_code: max_code + 1,
              est_type: type,
              est_name: name,
              est_active: active,
            });

            newEntitySub
              .save()
              .then((data) => {
                logger.debug('entity sub type added')
                return res.json({ success: true, msg: " entity sub type added" });
              })
              .catch((err) => {
                logger.errorObj('Entity sub type name could not be saved', err)
                return res.json({
                  success: false,
                  msg: "Entity sub type name could not be saved",
                });
              });
          });
      }
      else {

        const newEntitySub = new EntitySubType({
          est_company: "HLS",
          est_code: code,
          est_type: type,
          est_name: name,
          est_active: active,
        });

        newEntitySub
          .save()
          .then((data) => {
            logger.debug('Entity sub type added successfully');
            return res.json({ success: true, msg: " entity sub type added" });
          })
          .catch((err) => {
            logger.errorObj('Entity sub type name coulod not be saved', err)
            return res.json({
              success: false,
              msg: "Entity sub type name could not be saved",
            });
          });
      }
    });
});


router.get("/", (req, res) => {
  logger.debug("Route: entitysubtype.get/");
  logger.debug("find entitysubtype record: " + JSON.stringify(req.body))
  EntitySubType.find()
    .then((entitysubType) => {
      res.send(entitysubType);
    })
    .catch((err) => {
      logger.errorObj('Error to find entitysubtype', err);
    });
});

router.get("/active/:isActive", (req, res) => {
  let activeFilter = {};
  const isActive = req.params.isActive;

  if (isActive && isActive.toUpperCase() == "Y") {
    activeFilter = {
      est_active: "true",
    };
  }

  EntitySubType.find(activeFilter)
    .then((est) => {
      res.send(est);
    })
    .catch((err) => {
      logger.errorObj("Error to find entity sub type list", err);
    });
});


router.get("/:code", (req, res) => {
  logger.debug("Route: entitysubtype.get/");
  logger.debug("finding entitysubtype record: " + JSON.stringify(req.body))
  EntitySubType.find({ est_code: req.params.code })
    .then((entitysubType) => {
      if (entitysubType.length == 0) {
        logger.error('Entity sub type not found')
        res.send("No entity  sub type found");
      }
      else res.send(entitysubType[0]);
    })
    .catch((err) => {
      logger.errorObj('Error to find entitysubtype', err)
    });
});

router.get("/type/:code", (req, res) => {
  logger.debug("Route: actiongroup.get/");
  logger.debug("Inserting action group record: " + req.body)
  EntitySubType.find({ est_type: req.params.code })
    .then((entitysubType) => {
      if (entitysubType.length == 0) {
        logger.error('Entity sub type not found')
        res.send("No entity  sub type found");
      }
      else res.send(entitysubType);
    })
    .catch((err) => {
      logger.errorObj('Error to find entity sub type', err)
    });
});


router.delete("/:code", (req, res) => {
  logger.debug("Route: entitysubtype.delete/");
  logger.debug("Deleting  entitysubtype: " + req.params.code)
  EntitySubType.find({ est_code: req.params.code })
    .then((entitysubType) => {
      if (entitysubType.length == 0) {
        logger.error('Entity sub type not found');
        res.send("entity sub type not  found");
      }
      else {
        const entitysubtype = entitysubType[0];
        entitysubtype
          .delete()
          .then((est) => {
            logger.debug('Entity sub type deleted successfully' + req.params.code);
            res.send(
              `Entity sub type code ${req.params.code} deleted successfully.`
            );
          })
          .catch((e) => {
            logger.errorObj('Error to delete entitysubtype' + req.params.code, e)
            throw e;
          });
      }
    })
    .catch((err) => {
      logger.errorObj('Error to delete entitysubtype' + req.params.code, e)
      throw err;
    });
});

//update api
router.put("/", (req, res) => {
  logger.debug("Route: entitysubtype.put/");
  logger.debug("Updating entitysubtype  record: " + req.body)
  const { code, name, active, type } = req.body;

  EntitySubType.findOne({ est_code: code }).then((entitysubType) => {
    if (!entitysubType) {
      logger.error('Entity sub type not exist');
      return res.json({ success: false, msg: "Entity sub type not exist" });
    }

    EntitySubType.updateOne(
      { est_code: code },
      {
        $set: {
          est_type: type,
          est_name: name,
          est_active: active,
        },
      }
    )
      .then((resp) => {
        logger.debug('Entity sub type updated')
        res.json({
          success: true,
          msg: " Entity  Sub type Updated",
        });
      })
      .catch((err) => {
        logger.errorObj('Error to delete entity sub type');
        if (err) {
          throw err;
        }
      });
  });
});

module.exports = router;
