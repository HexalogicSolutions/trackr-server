const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();

const Test = require("../../models/Entity");


//cobination of and ,or
router.get("/find", (req, res) => {
  const subtype = req.query.subtype;
  const location = req.query.location;

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


  Entity.find({
    $and: [
      locationFilter,
      subTypeFilter,
    ],
  })
    .then((entity) => {
      res.send(entity);
    })
    .catch((err) => {
      //////////console.log(err);
    });
});



//cobination of and ,or
router.get("/qa", async (req, res) => {
  const subtype = req.query.subtype;
  //////////console.log("calling combination");

  let query = Entity.find({});
  //////////console.log(subtype);
  // let subTypeQuery="";
  if (subtype) {
    const newsubtype = subtype.split("|");
    //subTypeQuery="{ent_subtype: { $in: [{"+newsubtype+ "}]}}";
    subTypeQuery = "{ent_subtype: " + subtype + "}";
    //////////console.log("subTypeQuery:"+subTypeQuery);
    query.where('ent_subtype').equals(subtype);
  }



  let result = await query.exec();
  // //////////console.log(result);
  res.send(result);

});




module.exports = router;
