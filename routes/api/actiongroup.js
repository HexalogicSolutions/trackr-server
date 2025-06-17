const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();

// User model
const ActionGroup = require("../../models/ActionGroup");

const Entity = require("../../models/Entity");
const logger = require("../../helpers/logger");

router.post("/", (req, res) => {
  logger.debug("Route: actiongroup.post/");
  logger.debug("Inserting action group record: " + req.body)
  const {
    code,
    name,
    material,
    enabled,
    entitytype,
    entitysubtype,
    warehouse,
    locationarea,
    location,
    status,
    entitycount,
  } = req.body;


  if (!name) {
    logger.error('Please Enter all the data');
    return res.json({ success: false, msg: "Please enter all the data" });
  }

  ActionGroup.findOne({ act_name: name })
    .collation({ locale: "en_US", strength: 2 })
    .then((actiongroup) => {
      if (actiongroup) {
        logger.error('Name already exits for Action group' + name);
        return res.json({ success: false, msg: "Name already exits" });
      }

      ActionGroup.find({})
        .select("act_code")
        .sort({ act_code: -1 })
        .limit(1)
        .exec(function (err, doc) {
          let max_code = doc[0].act_code;

          const newActiongroup = new ActionGroup({
            act_company: "HLS",
            act_code: max_code + 1,
            act_name: name,
            act_material: material,
            act_entity_type: entitytype,
            act_entity_subtype: entitysubtype,
            act_warehouse: warehouse,
            act_location_area: locationarea,
            act_locataion: location,
            act_status: status,
            act_enabled: enabled,
            act_entity_count: entitycount,
          });

          newActiongroup
            .save()
            .then((data) => {
              // //console.log(data);
              logger.debug('Action Group Added' + newActiongroup)
              return res.json({ success: true, msg: " Action group added" });
            })
            .catch((err) => {
              // //console.log(err);
              logger.errorObj('ActionGroup could not be saved', err)
              return res.json({
                success: false,
                msg: "Actiongroup could not be saved",
              });
            });
        });
    });
});

// entity list count
router.get("/findcount", (req, res) => {
  logger.debug("Route: actiongroup.get/findcount");
  const subtype = req.query.subtype;
  const entitytype = req.query.entitytype;
  const status = req.query.status;
  const location = req.query.location;
  const material = req.query.material;
  const lastseen = req.query.lastseen;
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
  let EntityTypeFilter = {};
  if (entitytype) {
    const newentitytype = entitytype.split("|");
    EntityTypeFilter = {
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
      EntityTypeFilter,
      statusFilter,
      materialFilter,
    ],
  })
    .then((entities) => {
      res.send(entities.length + "");
    })
    .catch((err) => {
      logger.errorObj('Entity Not Find', err)
    });
});

// entity list
router.get("/find", (req, res) => {
  logger.debug("Route: actiongroup.get/find");
  const subtype = req.query.subtype;
  const entitytype = req.query.entitytype;
  const status = req.query.status;
  const warehouse = req.query.warehouse;
  const locationArea = req.query.locationarea;
  const location = req.query.location;
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

  let extCodeFilter = {};
  if (ent_extcode) {
    extCodeFilter = {
      ent_extcode: { $in: ent_extcode },
    };
  }
  let serialFilter = {};
  if (ent_serial) {
    serialFilter = {
      ent_serial: { $in: ent_serial },
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
  // todo
  let warehouseFilter = {};
  if (warehouse) {
    const newWarehouse = warehouse.split("|");
    warehouseFilter = {
      ent_warehouse: { $in: newWarehouse },
    };
  }
  // todo
  let locationAreaFilter = {};
  if (locationArea) {
    const newlocationArea = locationArea.split("|");
    locationAreaFilter = {
      ent_area: { $in: newlocationArea },
    };
  }
  let EntityTypeFilter = {};
  if (entitytype) {
    const newentitytype = entitytype.split("|");
    EntityTypeFilter = {
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
      EntityTypeFilter,
      statusFilter,
      materialFilter,
      entCodeFilter,
      extCodeFilter,
      serialFilter,
      lastSeenFilter,
      locationAreaFilter,
      warehouseFilter,
    ],
  })
    .then((entity) => {
      logger.debug('Entity Find' + entity)
      res.send(entity);
    })
    .catch((err) => {
      logger.errorObj('Entity Not Find', err);
    });
});

// get all action Groups
router.get("/", (req, res) => {
  logger.debug("Route: actiongroup.get/");
  ActionGroup.find()
    .then((groups) => {
      logger.debug('Action Groups find' + groups);
      res.send(groups);
    })
    .catch((err) => {
      logger.errorObj('Action Groups not find', err)
    });
});

// get group by code
router.get("/:code", (req, res) => {
  logger.debug("Route: actiongroup.get/:code");
  ActionGroup.find({ act_code: req.params.code })
    .then((groups) => {
      if (groups.length == 0) {
        logger.error('Action group not found for:' + req.params.code)
        res.send("No action group found");
      }
      else res.send(groups[0]);
    })
    .catch((err) => {
      logger.errorObj('Error finding action group', err);
    });
});

router.delete("/:code", (req, res) => {
  logger.debug("Route: actiongroup.delete/:code");
  ActionGroup.find({ act_code: req.params.code })
    .then((groups) => {
      if (groups.length == 0) {
        logger.error('action group not found')
        res.send("action group not  found");
      }
      else {
        const group = groups[0];
        group
          .delete()
          .then((grp) => {
            logger.debug('Action Group deleted successfully' + req.params.code)
            res.send(` Action Group ${req.params.code} deleted successfully.`);
          })
          .catch((e) => {
            logger.errorObj('Action group not deleted', e);
            throw e;
          });
      }
    })
    .catch((err) => {
      logger.errorObj('Action group not deleted', err);
      throw err;
    });
});

//update api
router.put("/", (req, res) => {
  logger.debug("Route: actiongroup.put/");
  logger.debug("updating action group record: " + req.body)
  const {
    code,
    name,
    material,
    enabled,
    entitytype,
    entitysubtype,
    warehouse,
    locationarea,
    location,
    status,
    entitycount,
  } = req.body;
  //console.log(location);

  ActionGroup.findOne({ act_code: code }).then((group) => {
    if (!group) {
      logger.error('Action group does not exist')
      return res.json({ success: false, msg: "action group does not exist" });
    }
    ActionGroup.updateOne(
      { act_code: code },
      {
        $set: {
          act_name: name,
          act_material: material,
          act_entity_type: entitytype,
          act_entity_subtype: entitysubtype,
          act_warehouse: warehouse,
          act_location_area: locationarea,
          act_location: location,
          act_status: status,
          act_enabled: enabled,
          act_entity_count: entitycount,
        },
      }
    )
      .then((resp) => {
        logger.debug('Action group profile updated')
        res.json({
          success: true,
          msg: " Action Group Profile Updated",
        });
      })
      .catch((err) => {
        logger.errorObj('Error in updation', err);
        if (err) {
          throw err;
        }
      });
  });
});

module.exports = router;
