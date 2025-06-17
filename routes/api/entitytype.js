const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");

const EntityType = require("../../models/EntityType");

router.post("/", (req, res) => {
  const { code, name, active } = req.body;
  logger.debug("Route: entitytype.post/");
  logger.debug("Inserting entitytype record: " + JSON.stringify(req.body))
  if (!name) {
    logger.error('Please enter all the data');
    res.json({ success: false, msg: "Please enter all the data" });
  }

  EntityType.findOne({ ett_name: name })
    .collation({ locale: 'en_US', strength: 2 })
    .then((entityType) => {
      if (entityType) {
        logger.error('Name already exits');
        return res.json({ success: false, msg: "Name already exits" });
      }

      if (code === undefined || code.length == 0) {

        EntityType.find({})
          .select("ett_code")
          .sort({ ett_code: -1 })
          .limit(1)
          .exec(function (err, doc) {
            let max_code = doc[0].ett_code;
            const newEntity = new EntityType({
              ett_company: "HLS",
              ett_code: max_code + 1,
              ett_name: name,
              ett_active: active,
            });
            newEntity
              .save()
              .then((data) => {
                logger.debug('Entity type added' + data)
                return res.json({ success: true, msg: " entity type added" });
              })
              .catch((err) => {
                logger.errorObj('Entity type name could not be saved', err)
                return res.json({
                  success: false,
                  msg: "Entity type name could not be saved",
                });
              });
          });
      }
      else {

        const newEntity = new EntityType({
          ett_company: "HLS",
          ett_code: code,
          ett_name: name,
          ett_active: active,
        });

        newEntity
          .save()
          .then((data) => {
            logger.debug('Entity type added' + data);
            return res.json({ success: true, msg: " entity type added" });
          })
          .catch((err) => {
            logger.errorObj('Entity type name could not be saved', err);
            return res.json({
              success: false,
              msg: "Entity type name could not be saved",
            });
          });
      }



    });


});

router.get("/", (req, res) => {
  logger.debug("Route: entitytype.get/");
  logger.debug("Inserting entitytype record: " + JSON.stringify(req.data))
  EntityType.find()
    .then((entityType) => {
      res.send(entityType);
    })
    .catch((err) => {
      logger.errorObj('Error to find entitytype', err)
    });
});
router.get("/active/:isActive", (req, res) => {
  let activeFilter = {};
  const isActive = req.params.isActive;
  if (isActive && isActive.toUpperCase() == "Y") {
    activeFilter = {
      ett_active: "true",
    };
  }

  EntityType.find(activeFilter)
    .then((ett) => {
      res.send(ett);
    })
    .catch((err) => {
      logger.errorObj("Error to find entity type list", err);
    });
});

// get group by code
router.get("/:code", (req, res) => {
  logger.debug("Route: entitytype.get/:code");
  logger.debug("find by code : " + req.params.code);
  EntityType.find({ ett_code: req.params.code })
    .then((entityType) => {
      if (entityType.length == 0) {
        logger.error('Entity type not found')
        res.send("No entity type found");
      }
      else res.send(entityType[0]);
    })
    .catch((err) => {
      logger.errorObj('Error to find entitytyep', err);
    });
});

router.delete("/:code", (req, res) => {
  logger.debug("Route: entitytype.post/");
  logger.debug("Deleting record: " + req.params.code);
  EntityType.find({ ett_code: req.params.code })
    .then((entityType) => {
      if (entityType.length == 0) {
        logger.error('Entity type not found');
        res.send("entity type not  found");
      }
      else {
        const entitytype = entityType[0];
        entitytype
          .delete()
          .then((ett) => {
            logger.debug('Entity type delted successfully' + req.params.code);
            res.send(
              `Entity type code ${req.params.code} deleted successfully.`
            );
          })
          .catch((e) => {
            logger.errorObj('Error to delete entity type', e)
            throw e;
          });
      }
    })
    .catch((err) => {
      logger.errorObj('Error to delete entity type', err)
      throw err;
    });
});

//update api
router.put("/", (req, res) => {
  const { code, name, active } = req.body;
console.log('your databasebody',req.body);
  logger.debug("Route: entitytype.put/");
  logger.debug("Updating  record: " + JSON.stringify(req.data))
  EntityType.findOne({ ett_code: code }).then((entityType) => {
    if (!entityType) {
      logger.error('Entity type not exist' + code);
      return res.json({ success: false, msg: "Entity type not exist" });
    }

    EntityType.updateOne(
      { ett_code: code },
      {
        $set: {
          ett_name: name,
          ett_active: active,
        },
      }
    )
      .then((resp) => {
        logger.debug('Entity type updated' + resp);
        res.json({
          success: true,
          msg: " Entity type Updated",
        });
      })
      .catch((err) => {
        logger.errorObj('Error to update entity type', err);
        if (err) {
          throw err;
        }
      });
  });
});

module.exports = router;
