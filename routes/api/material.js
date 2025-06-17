const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();

// User model
const Material = require("../../models/Material");
const logger = require("../../helpers/logger");

// router.post("/", (req, res) => {
//   //const { grp_code, grp_name } = req.body;
//   const { code, name, enabled } = req.body;

//   //console.log(code);
//   //console.log(name);
//   //console.log(enabled);

//   if (!code || !name) {
//     res.json({ success: false, msg: "Please enter all the data" });
//   }

//   UserGroup.findOne({ grp_code: code }).then((group) => {
//     if (group) {
//       return res.json({ success: false, msg: "Group code already exits" });
//     }
//     const newUserGroup = new UserGroup({
//       grp_company: "HLS",
//       grp_code: code,
//       grp_name: name,
//       grp_enabled: enabled,
//     });
//     newUserGroup
//       .save()
//       .then((data) => {
//         //console.log(data);
//         return res.json({ success: true, msg: " Group added" });
//       })
//       .catch((err) => {
//         //console.log(err);
//         return res.json({
//           success: false,
//           msg: "Group code could not be saved",
//         });
//       });
//   });
// });

// get all groups
router.get("/", (req, res) => {
 logger.debug('Get Material');
  Material.find()
    .then((mat) => {
      res.send(mat);
    })
    .catch((err) => {
      logger.errorObj('Error to find material', err);
    });
});

// // get group by code
// router.get("/:code", (req, res) => {
//   UserGroup.find({ grp_code: req.params.code })
//     .then((groups) => {
//       if (groups.length == 0) res.send("No group found");
//       else res.send(groups[0]);
//     })
//     .catch((err) => {
//       //console.log(err);
//     });
// });

// router.delete("/:code", (req, res) => {
//   UserGroup.find({ grp_code: req.params.code })
//     .then((groups) => {
//       if (groups.length == 0) res.send("group not  found");
//       else {
//         const group = groups[0];
//         //console.log(group);
//         group
//           .delete()
//           .then((grp) => {
//             //console.log("group not found");
//             res.send(`Group ${req.params.code} deleted successfully.`);
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

// //update api
// router.put("/", (req, res) => {
//   const { code, name, enabled } = req.body;
//   //console.log(name);

//   UserGroup.findOne({ grp_code: code }).then((group) => {
//     if (!group) {
//       return res.json({ success: false, msg: "group does not exist" });
//     }
//     //console.log("group exists");
//     UserGroup.updateOne(
//       { grp_code: code },
//       {
//         $set: {
//           grp_name: name,
//           grp_enabled: enabled,
//         },
//       }
//     )
//       .then((resp) => {
//         //console.log("success");
//         res.json({
//           success: true,
//           msg: " Group Profile Updated",
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
