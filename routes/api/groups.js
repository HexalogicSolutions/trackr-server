const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const { compare } = require("bcryptjs");
const logger = require("../../helpers/logger");

// User model
const UserGroup = require("../../models/UserGroup");


router.post("/", (req, res) => {
  logger.debug("Route: groups.post/");
  logger.debug("Inserting groups record: " + JSON.stringify(req.body))
  const { code, name, enabled } = req.body;

  if (!code || !name) {
    logger.error('Please enter all the data')
    res.json({ success: false, msg: "Please enter all the data" });
  }

  UserGroup.findOne({ grp_code: code }).then((group) => {
    if (group) {
      logger.error('Group code already exits', code);
      return res.json({ success: false, msg: "Group code already exits" });
    }
    const newUserGroup = new UserGroup({
      grp_company: "HLS",
      grp_code: code,
      grp_name: name,
      grp_enabled: enabled,
    });
    newUserGroup
      .save()
      .then((data) => {
        logger.debug('Group added' + data);
        return res.json({ success: true, msg: " Group added" });
      })
      .catch((err) => {
        logger.errorObj('Group code could not be saved', err);
        return res.json({
          success: false,
          msg: "Group code could not be saved",
        });
      });
  });
});

// get all groups
router.get("/", (req, res) => {
  logger.debug("Route: groups.get/");
  logger.debug("find record: ")
  UserGroup.find()
    .then((groups) => {

      res.send(groups);
    })
    .catch((err) => {
      logger.errorObj('Error to find groups', err)
    });
});

router.get("/active/:isActive", (req, res) => {
  let activeFilter = {};
  const isActive = req.params.isActive;
  console.log("isActive : " + isActive);
  
  if (isActive && isActive.toUpperCase() == "Y") {
    activeFilter = {
      grp_enabled: "true",
    };
  }

  UserGroup.find(activeFilter)
    .then((grp) => {
      res.send(grp);
    })
    .catch((err) => {
      logger.errorObj("Error to find supplier status list", err);
    });
});
// get group by code
router.get("/:code", (req, res) => {
  logger.debug("Route: groups.get/:code");
  logger.debug("find group by code: " + req.params.code);
  UserGroup.find({ grp_code: req.params.code })
    .then((groups) => {
      if (groups.length == 0) {
        logger.error('Group not found');
        res.send("No group foundyy");
      }
      else res.send(groups[0]);
    })
    .catch((err) => {
      logger.errorObj('Error to find group', err);
    });
});

router.delete("/:code", (req, res) => {
  logger.debug("Route: groups.delete/:code");
  logger.debug("Delete record: " + req.params.code)
  UserGroup.find({ grp_code: req.params.code })
    .then((groups) => {
      if (groups.length == 0) {
        logger.error('Group not found')
        res.send("group not  found");
      }
      else {
        const group = groups[0];
        group
          .delete()
          .then((grp) => {
            logger.debug('Group deleted successfully' + req.params.code);
            res.send(`Group ${req.params.code} deleted successfully.`);
          })
          .catch((e) => {
            logger.errorObj('Error to delete group', e);
            throw e;
          });
      }
    })
    .catch((err) => {
      logger.errorObj('Error to delete group', e);
      throw err;
    });
});

//update api
router.put("/", (req, res) => {
  const { code, name, enabled } = req.body;
  logger.debug("Route: groups.put/");
  logger.debug("Updating group record: " + JSON.stringify(req.body))
  UserGroup.findOne({ grp_code: code }).then((group) => {
    if (!group) {
      logger.error('Group does not exist' + code)
      return res.json({ success: false, msg: "group does not exist" });
    }
    UserGroup.updateOne(
      { grp_code: code },
      {
        $set: {
          grp_name: name,
          grp_enabled: enabled,
        },
      }
    )
      .then((resp) => {
        logger.debug('Group updated' + resp)
        res.json({
          success: true,
          msg: " Group Profile Updated",
        });
      })
      .catch((err) => {
        logger.errorObj('Error to update group', err);
        if (err) {
          throw err;
        }
      });
  });
});


module.exports = router;
