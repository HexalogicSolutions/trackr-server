const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");
// User model
const User = require("../../models/User");

router.post("/", (req, res) => {
  logger.debug("Route: user.post/");
  logger.debug("Inserting user record: " + JSON.stringify(req.body));
  const { code, name, email, password, group, active } = req.body;
  if (!code || !name || !email || !password || !group) {
    logger.error('please enter all the data');
    res.json({ success: false, msg: "please enter all the data" });
  }
  User.findOne({ usr_code: code }).then((user) => {
    if (user) {
      logger.error('user already exist');
      return res.json({ success: false, msg: "user already exist" });
    }

    const newUser = new User({
      usr_company: "HLS",
      usr_code: code,
      usr_name: name,
      usr_password: password,
      usr_email: email,
      usr_group: group,
      usr_active: active,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err0, hash) => {
        if (err0) throw err0;
        newUser.usr_password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            config.get("jwtSecret"),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                success: true,
                msg: "Profile Created",
                token,
                user,
              });
            }
          );
        });
      });
    });
  });
});

// Get all users
router.get("/", (req, res) => {
  logger.debug("Getting list of all users: ");
  logger.debug("Route: user.get/");
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      logger.errorObj('Error to find all user list', err)
    });
});
router.get("/active/:isActive", (req, res) => {
  let activeFilter = {};
  const isActive = req.params.isActive;
  
  if (isActive && isActive.toUpperCase() == "Y") {
    activeFilter = {
      usr_active: "true",
    };
  }

  User.find(activeFilter)
    .then((usr) => {
      res.send(usr);
    })
    .catch((err) => {
      logger.errorObj("Error to find users list", err);
    });
});
// get user by code
router.get("/:code", (req, res) => {
  logger.debug("Getting user by code: ");
  logger.debug("Route: user.get/:code");
  User.find({ usr_code: req.params.code })
    .then((users) => {
      if (users.length == 0) {
        logger.error('User not found')
        res.send("No user found");
      }
      else res.send(users[0]);
    })
    .catch((err) => {
      logger.errerrorObjor('Error to find user by code', err);
    });
});

//update api
router.put("/", (req, res) => {
  logger.debug("Route: user.put/");
  logger.debug("Updating user record: " + JSON.stringify(req.body))
  const { code, name, email, group, active } = req.body;
  User.findOne({ usr_code: code }).then((user) => {
    if (!user) {
      logger.error('User does not exist')
      return res.json({ success: false, msg: "User does not exist" });
    }
    User.updateOne(
      { usr_code: code },
      {
        $set: {
          usr_name: name,
          usr_email: email,
          usr_group: group,
          usr_active: active,
        }
      }
    )
      .then(resp => {
        logger.debug('Profile Updated')
        res.json({
          success: true,
          msg: "Profile Updated"
        });
      })
      .catch(err => {
        logger.errorObj('Error to update user profile', err)
        if (err) { throw err; }
      });
  });
});


//delete user
router.delete('/:code', (req, res) => {
  logger.debug("Route: user.delete/:code");
  User.find({ usr_code: req.params.code })
    .then((users) => {
      if (users.length == 0) {
        logger.error('User not found');
        res.send(`${req.params.code} user not found`);
      }
      else {
        const user = users[0];

        user.delete()
          .then((usr) => {
            logger.debug(`User ${req.params.code} deleted successfully.`)
            res.send(`User ${req.params.code} deleted successfully.`)
          })
          .catch(e => {
            logger.errorObj('Error to delete user', e);
            throw e;
          });
      }
    })
    .catch((err) => {
      logger.errorObj('Error to delete user', err);
      throw err;
    });


});
module.exports = router;
