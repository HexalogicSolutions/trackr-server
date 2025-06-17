const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const Entity = require("../../models/Entity");
const logger = require("../../helpers/logger");

router.post("/", (req, res) => {
  logger.debug("Route: entity.post/");
  logger.debug("Inserting entity record: " + JSON.stringify(req.body))
  const {
    code,
    extcode,
    serial,
    epc,
    desc,
    material,
    weight,
    purity,
    type,
    subtype,
    brand,
    status,
    warehouse,
    area,
    location,
    lastseen,
    duration,
    price,
    unit,
    sku,
    lot,
    active
  } = req.body;
  //console.log("Your price is :"+price);
  if (!code || !desc) {
    logger.error('Please enter all the data');
    res.json({ success: false, msg: "Please enter all the data" });
  }
  Entity.findOne({ ent_code: code }).then((entity) => {
    if (entity) {
      logger.error('Entity code already exits');
      return res.json({ success: false, msg: "Entity code already exits" });
    }
    const newEntity = new Entity({
      ent_company: "HLS",
      ent_code: code,
      ent_desc: desc,
      ent_serial: serial,
      ent_extcode: extcode,
      ent_epc: epc,
      ent_material: material,
      ent_type: type,
      ent_subtype: subtype,
      ent_brand: brand,
      ent_status: status,
      ent_warehouse: warehouse,
      ent_area: area,
      ent_location: location,
      ent_weight: weight,
      ent_purity: purity,
      ent_lastseen: lastseen,
      ent_duration: duration,
      ent_price: price,
      ent_unit: unit,
      ent_sku: sku,
      ent_lot: lot,
      ent_active:active
    });
    newEntity
      .save()
      .then((data) => {
        logger.debug('Entity added')
        return res.json({ success: true, msg: "Entity added" });
      })
      .catch((err) => {
        logger.errorObj('Entitycode could not be saved:', err)
        return res.json({
          success: false,
          msg: " Entitycode could not be saved",
        });
      });
  });
});

router.get("/", (req, res) => {
  logger.debug("Route: entity.get/");
  logger.debug("Find entity lines: " + req.body)
  Entity.find()
    .then((entity) => {
      res.send(entity);
    })
    .catch((err) => {
      logger.errorObj('Error to found entity:', err)
    });
});

router.get("/current-stock-by-material", (req, res) => {
  logger.debug("Route: entity.get/current-stock-by-material");
  const mydata = Entity.aggregate([
    {
      $lookup: {
        from: "material",
        localField: "ent_material",
        foreignField: "mat_code",
        as: "mydata",
      },
    },

    { $match: { ent_status: "STK" } },
    { $group: { _id: "$mydata.mat_name", TotalMaterial: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ])
    .then((entity) => {
      if (entity.length == 0) {
        logger.error('Currnet-stock-by-material not found')
        res.send("Not found");
      }
      else {
        res.send(entity);
      }
    })
    .catch((err) => {
      logger.errorObj('Error finding current-stock-by-material', err)
    });
});

router.get("/current-stock-by-status", (req, res) => {
  logger.debug("Route: entity.get/current-stock-by-status");
  const fromDt = req.query.fromDt;
  const toDt = req.query.toDt;
  const mydata = Entity.aggregate([
    {
      $lookup: {
        from: "entity_status",
        localField: "ent_status",
        foreignField: "sta_code",
        as: "mydata",
      },
    },
    { $group: { _id: "$mydata.sta_desc", TotalMaterial: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ])
    .then((status) => {
      if (status.length == 0) {
        logger.error('Current-stock-by-status not found')
        res.send("Not found");
      }
      else res.send(status);
    })
    .catch((err) => {
      logger.errorObj('Error to find current-stock-by-status', err)
    });
});

router.get("/current-stock-by-subtype", (req, res) => {
  logger.debug("Route: entity.get/current-stock-by-subtype");
  const mydata = Entity.aggregate([
    {
      $lookup: {
        from: "entity_subtype",
        localField: "ent_subtype",
        foreignField: "est_code",
        as: "mydata",
      },
    },
    { $match: { ent_status: "STK" } },
    { $group: { _id: "$mydata.est_name", TotalMaterial: { $sum: 1 } } },
    { $sort: { _id: 1 } }


  ])
    .then((entity) => {
      if (entity.length == 0) {
        logger.error('Current-stock-by-subype not found')
        res.send("Not found");
      }
      else {
        for (i = 0; i < entity.length; i++) {
          const entityx = entity[i];
        }
        res.send(entity);
      }
    })
    .catch((err) => {
      logger.errorObj('Error to find current-stock-by-subtype', err)
    });
});

//get entity by epc
router.get("/epc/:epc", (req, res) => {
  logger.debug("Route: entity.get/");
  Entity.find({ ent_epc: req.params.epc })
    .then((entity) => {
      if (entity.length == 0) {
        logger.error('Entity not found by epc:' + req.params.epc)
        res.send("Not found");
      }
      else res.send(entity[0]);
    })
    .catch((err) => {
      logger.errorObj('Error to find entity by epc' + req.params.epc, err)
    });
});

// get entity by code
router.get("/:code", (req, res) => {
  logger.debug("Route: entity.get/:code");
  Entity.find({ ent_code: req.params.code })
    .then((entity) => {
      if (entity.length == 0) {
        logger.error('Entity not found by code:', req.params.code)
        res.send("No entity type found");
      }
      else res.send(entity[0]);
    })
    .catch((err) => {
      logger.errorObj('Error to find entity by code: ' + req.params.code, err)
    });
});

router.delete("/:code", (req, res) => {
  logger.debug("Route: entity.delete/:code");
  Entity.find({ ent_code: req.params.code })
    .then((entity) => {
      if (entity.length == 0) {
        logger.error('Entity not found')
        res.send("Entity  not  found");
      }
      else {
        const entityy = entity[0];
        entityy
          .delete()
          .then((ent) => {
            logger.debug('Entity code deleted successfully' + req.params.code);
            res.send(`Entity  code ${req.params.code} deleted successfully.`);
          })
          .catch((e) => {
            logger.errorObj('Error to delete entity', err)
            throw e;
          });
      }
    })
    .catch((err) => {
      logger.errorObj('Error to delete entity', err);
      throw err;
    });
});

//update api
router.put("/", (req, res) => {
  logger.debug("Route: entity.put/");
  logger.debug("Updating entity record: " + JSON.stringify(req.body))
  const {
    code,
    extcode,
    serial,
    epc,
    desc,
    material,
    type,
    subtype,
    brand,
    status,
    location,
    weight,
    purity,
    lastseen,
    duration,
    price,
    unit,
    sku,
    lot,
    active
  } = req.body;
  Entity.findOne({ ent_code: code }).then((entity) => {
    if (!entity) {
      logger.error('Entity does not exist');
      return res.json({ success: false, msg: "Entity not exist" });
    }

    Entity.updateOne(
      { ent_code: code },
      {
        $set: {
          ent_desc: desc,
          ent_extcode: extcode,
          ent_serial: serial,
          ent_epc: epc,
          ent_material: material,
          ent_type: type,
          ent_subtype: subtype,
          ent_brand: brand,
          ent_status: status,
          ent_location: location,
          ent_weight: weight,
          ent_purity: purity,
          ent_lastseen: lastseen,
          ent_duration: duration,
          ent_price: price,
          ent_unit: unit,
          ent_sku: sku,
          ent_lot: lot,
          ent_active:active
        },
      }
    )
      .then((resp) => {
        logger.debug('Entity updated successfully')
        res.json({
          success: true,
          msg: " Entity  Updated",
        });
      })
      .catch((err) => {
        logger.errorObj('Error to delete entity', err)
        if (err) {
          throw err;
        }
      });
  });
});

module.exports = router;
