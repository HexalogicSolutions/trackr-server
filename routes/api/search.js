const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const ActionGroup = require("../../models/ActionGroup");
const Entity = require("../../models/Entity");
const Sale = require("../../models/Sale");
const logger = require("../../helpers/logger");
router.get("/find", (req, res) => {
  logger.debug("Route: search.get/find");
  const subtype = req.query.subtype;
  const entitytype = req.query.entitytype;
  const status = req.query.status;
  const location = req.query.location;
  const warehouse = req.query.warehouse;
  const locationArea = req.query.locationarea;
  const material = req.query.material;
  const ent_code = req.query.entitycode;
  const ent_serial = req.query.serial;
  const ent_extcode = req.query.custcode;
  const fromDt = req.query.fromDt;
  const toDt = req.query.toDt;
  let entCodeFilter = {};
  if (ent_code) {
    entCodeFilter = {
      ent_code: { $in: ent_code },
    };
  }
  let entSerialFilter = {};
  if (ent_serial) {
    entSerialFilter = {
      ent_serial: { $in: ent_serial },
    };
  }
  let extCodeFilter = {};
  if (ent_extcode) {
    extCodeFilter = {
      ent_extcode: { $in: ent_extcode },
    };
  }
  let lastSeenFilter = {};
  if (fromDt && toDt) {
    lastSeenFilter = {
      ent_lastseen: {
        $gte: fromDt,
        $lt: toDt,
      },
    };
  }
  let subTypeFilter = {};

  if (subtype) {
    const newsubtype = subtype.split("|");
    subTypeFilter = {
      ent_subtype: { $in: newsubtype },
    };

  }
  let locationFilter = {};
  if (location) {
    const newlocation = location.split("|");
    locationFilter = {
      ent_location: { $in: newlocation },
    };
  }
  let warehouseFilter = {};
  if (warehouse) {
    const newWarehouse = warehouse.split("|");
    warehouseFilter = {
      ent_warehouse: { $in: newWarehouse },
    };
  }
  let locationAreaFilter = {};
  if (locationArea) {
    const newlocationArea = locationArea.split("|");
    locationAreaFilter = {
      ent_area: { $in: newlocationArea },
    };
  }
  let entityTypeFilter = {};
  if (entitytype) {
    const newentitytype = entitytype.split("|");
    entityTypeFilter = {
      ent_type: { $in: newentitytype },
    };
  }
  let statusFilter = {};
  if (status) {
    const newstatus = status.split("|");
    statusFilter = {
      ent_status: { $in: newstatus },
    };
  }
  let materialFilter = {};
  if (material) {
    const newmaterial = material.split("|");
    materialFilter = {
      ent_material: { $in: newmaterial },
    };
  }
  Entity.find({
    $and: [
      locationFilter,
      subTypeFilter,
      entityTypeFilter,
      statusFilter,
      materialFilter,
      entCodeFilter,
      extCodeFilter,
      entSerialFilter,
      lastSeenFilter,
      locationAreaFilter,
      warehouseFilter,
    ],
  })
    .then((entity) => {
      res.send(entity);
    })
    .catch((err) => {
      logger.errorObj('Error to find entity', err);
    });
});
////
router.get("/lastseen/:mylastseen", (req, res) => {
  logger.debug("Route: search.get/lastseen/:mylastseen");
  const fromDt = req.query.fromDt;
  const toDt = req.query.toDt;
  Entity.find({
    ent_lastseen: {
      $gte: fromDt,
      $lt: toDt,
    },
  })
    .then((entity) => {
      if (entity.length == 0) {
        logger.error('Data not found')
        res.send("No data found");
      }
      else res.send(entity);
    })
    .catch((err) => {
      logger.errorObj('Error to find entity', err);
    });
});

module.exports = router;
