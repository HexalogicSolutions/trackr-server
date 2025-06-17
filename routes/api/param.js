const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");

const Param = require('../../models/Param');
// router.post("/", (req, res) => {
//   //const { grp_code, grp_name } = req.body;
//   const { code, name } = req.body;
//   //console.log(code);
//   //console.log(name);
//   if (!code || !name) {
//     res.json({ success: false, msg: "Please enter all the data" });
//   }

//   Unit.findOne({ unt_code: code }).then((unit) => {
//     if (unit) {
//       return res.json({ success: false, msg: "Unit code already exits" });
//     }
//     const newUnit = new Unit({
//       unt_code: code,
//       unt_name: name,
//     });
//     newUnit
//       .save()
//       .then((data) => {
//         //console.log(data);
//         return res.json({ success: true, msg: " Unit added" });
//       })
//       .catch((err) => {
//         //console.log(err);
//         return res.json({
//           success: false,
//           msg: "Unit code could not be saved",
//         });
//       });
//   });
// });

// get all groups

// router.get("/", (req, res) => {
//     Param.find()
//         .then((par) => {
//             res.send(par);
//         })
//         .catch((err) => {
//             //console.log(err);
//         });
// });

//Get Param 
router.get("/:tag", (req, res) => {
    logger.debug("Getting params: ");
    logger.debug("Route: param.get/:tag");
    Param.find({ par_tag: req.params.tag })
        .then((data) => {
            if (data.length == 0) {
                logger.error('No Data found');
                res.send("No Data found");
            }
            else res.send(data[0]);
        })
        .catch((err) => {
            logger.errorObj('Error to find param by tag', err);
        });
});

// router.delete("/:code", (req, res) => {
//   Unit.find({ unt_code: req.params.code })
//     .then((units) => {
//       if (units.length == 0) res.send("unit not  found");
//       else {
//         const unit = units[0];
//         //console.log(unit);
//         unit
//           .delete()
//           .then((unt) => {
//             //console.log("unit not found");
//             res.send(`Unit ${req.params.code} deleted successfully.`);
//           })
//           .catch((e) => {
//             //console.log("error: " + e);
//             throw e;
//           });
//       }
//     })
//     .catch((err) => {
//       //console.log(err);
//       throw err;
//     });
// });

//update api
// router.put("/", (req, res) => {
//   const { code, name } = req.body;
//   //console.log(name);

//   Unit.findOne({ unt_code: code }).then((unit) => {
//     if (!unit) {
//       return res.json({ success: false, msg: "unit does not exist" });
//     }
//     //console.log("unit exists");
//     Unit.updateOne(
//       { unt_code: code },
//       {
//         $set: {
//           unt_name: name,
//         },
//       }
//     )
//       .then((resp) => {
//         //console.log("success");
//         res.json({
//           success: true,
//           msg: " Unit Profile Updated",
//         });
//       })
//       .catch((err) => {
//         //console.log(err);
//         if (err) {
//           throw err;
//         }
//       });
//   });
// });
module.exports = router;
