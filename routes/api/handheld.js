const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const express = require("express");
const router = express.Router();
const Material = require("../../models/Material");
const EntityStatus = require("../../models/EntityStatus");
const EntityType = require("../../models/EntityType");
const Entity = require("../../models/Entity");
const EntitySubType = require("../../models/EntitySubType");
const Location = require("../../models/Location");
const Warehouse = require("../../models/Warehouse");
const LocationArea = require("../../models/LocationArea");
const ActionGroup = require("../../models/ActionGroup");
const UserGroup = require("../../models/UserGroup");
const logger = require("../../helpers/logger");
const HandheldTran = require("../../models/HandheldTran");

router.post("/upload", async (req, res) => {

  const { header, entities } = req.body;
  logger.debug("Route: handheld.post/");
  logger.debug("Inserting handheld record: " + JSON.stringify(req.body))
  if (!header || !entities) {
    logger.error('Invalid data uploaded');
    res.json({ success: false, msg: "Invalid data uploaded." });
  }
  var msg = "";
  var hht_scanned_entities = [];
  var hht_missing_entities = [];

  for (i = 0; i < entities.length; i++) {
    const entity = entities[i];

    var hhEnt = {
      id: entity._id,
      code: entity.ent_code,
      epc: entity.ent_epc,
    };

    if (header.operation == "I" || header.operation == "N") {
      // Induction or New entry
      if (entity.ent_modified == "Y") {
        const updatedEntity = (({ _id, ...o }) => o)(entity); //removing _id from entity  object
        Entity.findOneAndUpdate(
          { ent_code: entity.ent_code },
          updatedEntity,
          { new: true, strict: true },
          function (error, result) {
            if (error) {
              logger.error('Entity could not be updated')
              return res.json({
                success: false,
                msg: "Entity could not be updated.",
              });
            }
          }
        );
        hht_scanned_entities.push(hhEnt);
      }
    } else if (header.operation == "L") {
      // Record sale
      // check if item already sold
      try {
        var saleFound = await Sale.findOne({
          sal_entity: entity.ent_code,
          sal_serial: entity.ent_serial,
        });
        if (saleFound) {
          logger.error('Sale already recorded for this item. Please contact admin to resolve this issue' + saleFound)
          return res.json({
            success: false,
            msg:
              "Sale already recorded for this item. Please contact admin to resolve this issue.",
          });
          return;
        }
      } catch (err) {
        logger.errorObj('Error to record item', err);
        throw err;
      }

      // create new sale record
      const sale = new Sale({
        sal_company: header.company,
        sal_user: header.user_code,
        sal_date: header.datetime,
        sal_warehouse: entity.ent_warehouse,
        sal_entity: entity.ent_code,
        sal_serial: entity.ent_serial,
        sal_extcode: entity.ent_extcode,
        sal_material: entity.ent_material,
        sal_type: entity.ent_type,
        sal_subtype: entity.ent_subtype,
        sal_price: entity.ent_price,
        sal_notes: header.note,
        sal_epc: entity.ent_epc,
        sal_weight: entity.ent_weight,
      });

      sale
        .save()
        .then((data) => {
          logger.debug('Sale record added');
          msg = "Sale record added";
        })
        .catch((err) => {
          logger.errorObj('Sale record could not be saved', err);
          return res.json({
            success: false,
            msg: "Sale record could not be saved",
          });
        });

      // update entity - status & last seen
      const updatedEntity = (({ _id, ...o }) => o)(entity); //removing _id from entity  object
      Entity.findOneAndUpdate(
        { ent_code: entity.ent_code },
        updatedEntity,
        {
          new: true,
          strict: true,
        },
        function (error, result) {
          if (error) {
            logger.error('Entity could not be updated');
            return res.json({
              success: false,
              msg: "Entity could not be updated.",
            });
          }
        }
      );
      hht_scanned_entities.push(hhEnt);
    } else if (header.operation == "S") {
      // Inventory scan
      var status = "STK";
      if (entity.ent_action == "M") status = "MSG";

      Entity.findOneAndUpdate(
        { ent_code: entity.ent_code },
        {
          ent_lastseen: header.datetime,
          ent_status: status,
        },
        {
          new: true,
          strict: true,
        },
        function (error, result) {
          if (error) {
            logger.error('Handheld Tran could not be saved');
            return res.json({
              success: false,
              msg: "HH Tran could not be saved",
            });
          }
        }
      );

      if (entity.ent_action == "S") {
        // Scanned
        hht_scanned_entities.push(hhEnt);
      } else if (entity.ent_action == "M") {
        // Missing
        hht_missing_entities.push(hhEnt);
      }
    }
  }

  // create handheld tran record
  const hhtran = new HandheldTran({
    hht_company: header.company,
    hht_user: header.user_code,
    hht_user_name: header.user_name,
    hht_operation: header.operation,
    hht_datetime: header.datetime,
    hht_device_id: header.device_id,
    hht_device_name: header.device_name,
    hht_action_group: header.action_group,
    hht_scanned_entities,
    hht_missing_entities,
  });
  hhtran
    .save()
    .then((data) => {
      logger.debug('Handheld Tran added successfully');
      msg = "HH Tran added successfully!";
    })
    .catch((err) => {
      logger.errorObj('Handheld Tran could not be saved');
      return res.json({
        success: false,
        msg: "HH Tran could not be saved",
      });
    });

  return res.json({
    msg,
    success: true,
  });
});

// router.get("/scans-by-date", (req, res) => {
router.get("/handheld-scan", (req, res) => {
  const fromDt = req.query.fromDt;
  const toDt = req.query.toDt;

  const mydata = HandheldTran.aggregate([
    {

      $match: {
        $and: [
          {
            hht_datetime: {
              $gte: new Date(fromDt),
              $lt: new Date(toDt),
            },
          },
          {
            hht_operation: "S",
          },
        ],
      },
    },
    {
      $group: {
        _id: "$hht_datetime",
        missing: {
          $sum: { $size: "$hht_missing_entities" },
        },
        scanned: {
          $sum: { $size: "$hht_scanned_entities" },
        },
        total: {
          $sum: {
            $add: [
              { $size: "$hht_scanned_entities" },
              { $size: "$hht_missing_entities" },
            ],
          },
        },
      },
    },
    { $sort: { _id: 1 } },

  ])
    .then((entity) => {
      if (entity.length == 0) res.send("Not found");
      else res.send(entity);

    })
    .catch((err) => {
      logger.errorObj('Entity not found', err);
    });
});

// router.get("/scans-by-date", (req, res) => {
router.get("/handheld-induction", (req, res) => {
  const fromDt = req.query.fromDt;
  const toDt = req.query.toDt;

  const mydata = HandheldTran.aggregate([
    {
      $match: {
        $and: [
          {
            hht_datetime: {
              $gte: new Date(fromDt),
              $lt: new Date(toDt),
            },
          },
          {
            hht_operation: "I",
          },
        ],
      },
    },
    {
      $group: {
        _id: "$hht_datetime",
        inducted: {
          $sum: { $size: "$hht_scanned_entities" },
        },
      },
    },
    { $sort: { _id: 1 } },

  ])
    .then((entity) => {
      if (entity.length == 0) {
        logger.error('Entity not found')
        res.send("Not found");
      }
      else res.send(entity);
      // //console.log("Totolmaterial:" + mydata);
    })
    .catch((err) => {
      logger.errorObj('Error to find entity', err)
    });
});

router.post("/login", (req, res) => {

  const { code, password } = req.body;
  logger.debug("Route: handheld.post/login");
  logger.debug("Inserting handheld record: " + JSON.stringify(req.data));
  {
    // Simple validation
    if (!code || !password) {
      logger.error('Please Enter all the data');
      res.json({ success: false, msg: "Please enter all the data" });
    }
    // Check user
    User.findOne({ usr_code: code })
      .then((user) => {
        logger.error('User does not exist' + code);
        if (!user) {
          return res.json({
            msg: "User Does not exist",
            success: false,
            user: null,
            data: null,
          });
        }
        //
        if (user.usr_active === false) {
          logger.error('User not active');
          return res.json({
            msg: "User not active",
            success: false,
            user: null,
            data: null,
          });
        }

        // Validate password
        bcrypt.compare(password, user.usr_password).then(async (isMatch) => {
          if (!isMatch) {
            logger.error('Invalid credentials')
            return res.json({
              msg: "Invalid Credentials",
              success: false,
              user: null,
              data: null,
            });
          }

          // build data object

          // materials
          var materials = [];
          try {
            materials = await Material.find({ mat_enable: true }).exec();
          } catch (err) {
            logger.errorObj('Error to find materials', err)
          }

          // entity Statuses
          var statuses = [];
          try {
            statuses = await EntityStatus.find({ sta_enabled: true }).exec();
          } catch (err) {
            logger.errorObj('Error to find status', err);
          }

          // entitytypes
          var entityTypes = [];
          try {
            entityTypes = await EntityType.find({ ett_active: true }).exec();

          } catch (err) {
            logger.errorObj('Error to find entity types', err);
          }

          // entitytypes
          var entitySubtypes = [];
          try {
            entitySubtypes = await EntitySubType.find({
              est_active: true,
            }).exec();

          } catch (err) {
            logger.errorObj('Error to find entitysubtype', err);
          }

          // Warehouses
          var warehouses = [];
          try {
            warehouses = await Warehouse.find({ whs_active: true }).exec();

          } catch (err) {
            logger.errorObj('Error to find warehouses', err);
          }

          // locationAreas
          var locationAreas = [];
          try {
            locationAreas = await LocationArea.find({
              lar_active: true,
            }).exec();

          } catch (err) {
            logger.errorObj('Error to find location area', err);
          }

          // locations
          var locations = [];
          try {
            locations = await Location.find({ loc_enable: true }).exec();
            // //console.log(locations);
          } catch (err) {
            logger.errorObj('Error to find locations');
          }

          // actionGroups
          var actionGroups = [];
          try {
            actionGroups = await ActionGroup.find({ act_enabled: true }).exec();
            // //console.log(actionGroups);
          } catch (err) {
            logger.errorObj('Error to find action groups');
          }

          // groups
          var groups = [];
          try {
            groups = await UserGroup.find({ grp_enabled: true }).exec();
            // //console.log(groups);
          } catch (err) {
            logger.errorObj('Error to find groups', err);
          }

          var data = {
            materials,
            statuses,
            entityTypes,
            entitySubtypes,
            warehouses,
            locationAreas,
            locations,
            actionGroups,
            groups,
          };
          logger.debug('User authenticated successfully');
          return res.json({
            msg: "User authenticated successfully",
            success: true,
            user,
            data,
          });
        });
      })
      .catch((err) => {
        logger.errorObj('Error into user authentication', err);
      });
  }
});

router.get("/hh-report", (req, res) => {
  logger.debug("Route: handheld.get/hh-report");
  logger.debug("find  record: ")
  const fromDt = req.query.fromDt;
  const toDt = req.query.toDt;

  const mydata = HandheldTran.aggregate([
    {
      $lookup: {
        from: "action_group",
        localField: "hht_action_group",
        foreignField: "act_code",
        as: "mydata",
      },
    },
    {
      $match: {
        $and: [
          {
            hht_datetime: {
              $gte: new Date(fromDt),
              $lt: new Date(toDt),
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: {
          dateTime: "$hht_datetime",
          userCode: "$hht_user",
          userName: "$hht_user_name",
          operation: "$hht_operation",
          actionGroup: "$mydata.act_name"
        },
        missing: {
          $sum: { $size: "$hht_missing_entities" },
        },
        scanned: {
          $sum: { $size: "$hht_scanned_entities" },
        },
        total: {
          $sum: {
            $add: [
              { $size: "$hht_scanned_entities" },
              { $size: "$hht_missing_entities" },
            ],
          },
        },
      },
    },
    { $sort: { _id: 1 } },

  ])
    .then((entity) => {
      if (entity.length == 0) res.send([]);
      else res.send(entity);

    })
    .catch((err) => {
      logger.errorObj('Error to find', err);
    });
});

router.get("/", (req, res) => {
  logger.debug('Get return');
  return res.json({
    msg: "Get return",
    success: true,
  });
});

module.exports = router;
