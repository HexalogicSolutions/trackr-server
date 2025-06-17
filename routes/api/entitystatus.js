const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");
const EntityStatus = require("../../models/EntityStatus");

router.post("/", (req, res) => {
  logger.debug("Route: entitystatus.post/");
  logger.debug("Inserting entitystatus record: " + JSON.stringify(req.body))
  const { code, desc, enabled } = req.body;
  if (!code || !desc) {
    logger.debug('Please enter all the data');
    res.json({ success: false, msg: "Please enter all the data" });
  }
  if (code.length > 3) {
    logger.error('Status code should not be longer than 3 charecters' + code);
    res.json({
      success: false,
      msg: "Status code should not be longer than 3 charecters",
    });
  }
  EntityStatus.findOne({ sta_code: code }).then((status) => {
    if (status) {
      logger.error('Status code already exists' + code)
      return res.json({ success: false, msg: "Status code already exists" });
    }
    const newEntityStatus = new EntityStatus({
      sta_code: code,
      sta_desc: desc,
      sta_enabled: enabled,
    });
    newEntityStatus
      .save()
      .then((data) => {
        logger.debug('Status Added')
        return res.json({ success: true, msg: " Status added" });
      })
      .catch((err) => {
        logger.errorObj('Status could not be saved', err)
        return res.json({
          success: false,
          msg: "Status code could not be saved",
        });
      });
  });
});

router.get("/", (req, res) => {
  logger.debug("Route: entitystatus.get/");
  EntityStatus.find()
    .then((status) => {
      res.send(status);
    })
    .catch((err) => {
      logger.errorObj('Error to find entity status', err)
    });
});

router.get("/active/:isActive", (req, res) => {
  let activeFilter = {};
  const isActive = req.params.isActive;

  if (isActive && isActive.toUpperCase() == "Y") {
    activeFilter = {
      sta_enabled: "ACT",
    };
  }

  EntityStatus.find(activeFilter)
    .then((sup) => {
      res.send(sup);
    })
    .catch((err) => {
      logger.errorObj("Error to find entity status list", err);
    });
});

router.get("/:code", (req, res) => {
  logger.debug("Route: entitystatus.get/:code");
  logger.debug("Getting entity status record: " + JSON.stringify(req.body))
  EntityStatus.find({ sta_code: req.params.code })
    .then((status) => {
      if (status.length == 0) {
        logger.error('Entity status not found')
        res.send("No status found");
      }
      else res.send(status[0]);
    })
    .catch((err) => {
      logger.errorObj('Error to find entity status', err);
    });
});

router.delete("/:code", (req, res) => {
  logger.debug("Route: entitystatus.delete/");
  EntityStatus.find({ sta_code: req.params.code })
    .then((status) => {
      if (status.length == 0) {
        logger.error('Entity status not found');
        res.send("status not  found");
      }
      else {
        const Status = status[0];
        Status.delete()
          .then((sts) => {
            logger.debug('Status deleted successfully')
            res.send(`status ${req.params.code} deleted successfully.`);
          })
          .catch((e) => {
            logger.errorObj('Error to delete entity status', e)
            throw e;
          });
      }
    })
    .catch((err) => {
      logger.errorObj('Error to delete entity status', err)
      throw err;
    });
});

//update api
router.put("/", (req, res) => {
  logger.debug("Route: entitystatus.put/");
  logger.debug("Updating entitystatus record: " + JSON.stringify(req.data))
  const { code, desc, enabled } = req.body;

  EntityStatus.findOne({ sta_code: code }).then((status) => {
    if (!status) {
      logger.error('entity status does not exist');
      return res.json({ success: false, msg: "Status does not exist" });
    }

    EntityStatus.updateOne(
      { sta_code: code },
      {
        $set: {
          sta_desc: desc,
          sta_enabled: enabled,
        },
      }
    )
      .then((resp) => {
        logger.debug('Entity status updated')
        res.json({
          success: true,
          msg: " Status Profile Updated",
        });
      })
      .catch((err) => {
        logger.errorObj('Error to update entity status', err);
        if (err) {
          throw err;
        }
      });
  });
});

module.exports = router;
