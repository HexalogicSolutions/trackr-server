const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const express = require("express");
const logger = require("../../helpers/logger");
const router = express.Router();
router.post("/", (req, res) => {
  logger.debug("Route: auth.post/");
  logger.debug("Inserting auth record: " + req.body)
  const { code, password, token } = req.body;
  if (token) {

    console.log("code- "+code);
    console.log("pasword- "+password);
    try {
      const decoded = jwt.verify(token, config.get("jwtSecret"));
      req.user = decoded;
      User.findById(req.user.id)
        .then((user) => {
          jwt.sign(
            { id: user.id },
            config.get("jwtSecret"),
            { expiresIn: 36000 },
            (err, token) => {
              if (err) {
                logger.error('Error in Jwt Token' + err)
                throw err;
              }
              logger.debug('Profile authenticated successfully')
              res.json({
                token,
                msg: "Profile authenticated successfully",
                user,
                success: true,
              });
            }
          );
        })
        .catch((err) => {
          logger.errorObj('User not Found', err)
          return res.json({ msg: "User not found", success: false });
        });
    } catch (e) {
      logger.errorObj('Token not valid', e)
      return res.json({ msg: "Token not valid", success: false });
    }
  } else {
    // Simple validation
    if (!code || !password) {
      logger.error('Please Enter All the data');
      res.json({ success: false, msg: "Please enter all the data" });
    }
    // Check user
    User.findOne({ usr_code: code })
      .then((user) => {
        if (!user) {
          logger.error('User does not exist')
          return res.json({ msg: "User Does not exist", success: false });
        }
        //
        if (user.usr_active === false) {
          logger.error('User not active')
          return res.json({ msg: "User not active", success: false });
        }



        // Validate password
        bcrypt.compare(password, user.usr_password).then((isMatch) => {
          if (!isMatch) {
            logger.error('Invalid Credentials')
            return res.json({ msg: "Invalid Credentials", success: false });
          }

          jwt.sign(
            { id: user.id },
            config.get("jwtSecret"),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) { throw err; }
              logger.debug('Jwt Sign Successfully')
              res.json({
                success: true,
                token,
                user,
              });
            }
          );
        });
      })
      .catch((err) => {
        logger.errorObj('Jwt Sign in Error:', err)
      });
  }
});

module.exports = router;
