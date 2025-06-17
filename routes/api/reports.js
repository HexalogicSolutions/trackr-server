var express = require("express");
var router = express.Router();
var request = require("request");
const Sale = require("../../models/Sale");
const Entity = require("../../models/Entity");
const logger = require("../../helpers/logger");

router.get("/test", async function (req, res, next) {
  logger.debug("Getting Reports: ");
  logger.debug("Route: reports.get/test");
  let dataApi = await Sale.find();
  var data = {
    template: { shortid: "faXzusepxf" },
    data: {
      data: dataApi,
    },
    options: {
      preview: true,
    },
  };
  var options = {
    uri: "http://localhost:5488/api/report",
    method: "POST",
    json: data,
  };

  request(options).pipe(res);
});
router.get("/sales", async function (req, res, next) {
  logger.debug("Getting Reports by sales: ");
  logger.debug("Route: reports.get/sales");
  const subtype = req.query.subtype;
  const entitytype = req.query.entitytype;
  const warehouse = req.query.warehouse;
  const fromDt = req.query.fromDt;
  const toDt = req.query.toDt;
  const material = req.query.material;
  let subTypeFilter = {};
  if (subtype) {
    const newsubtype = subtype.split("|");
    subTypeFilter = {
      sal_subtype: { $in: newsubtype },
    };
  }
  let entityTypeFilter = {};
  if (entitytype) {
    const newentitytype = entitytype.split("|");
    entityTypeFilter = {
      sal_type: { $in: newentitytype },
    };
  }
  let warehouseFilter = {};
  if (warehouse) {
    const newWarehouse = warehouse.split("|");
    warehouseFilter = {
      sal_warehouse: { $in: newWarehouse },
    };
  }
  let dateFilter = {};
  if (fromDt && toDt) {
    dateFilter = {
      sal_date: {
        $gte: fromDt,
        $lt: toDt,
      },
    };
  }
  let materialFilter = {};
  if (material) {
    const newmaterial = material.split("|");
    materialFilter = {
      sal_material: { $in: newmaterial },
    };
  }

  let dataApi = await Sale.find({
    $and: [
      subTypeFilter,
      entityTypeFilter,
      materialFilter,
      dateFilter,
      warehouseFilter,
    ],
  });
  var data = {
    template: { shortid: "faXzusepxf" },
    data: {
      from: fromDt,
      to: toDt,
      data: dataApi,
    },
    options: {
      preview: true,
    },
  };
  var options = {
    uri: "http://localhost:5488/api/report",
    method: "POST",
    json: data,
  };
  request(options).pipe(res);
});
router.get("/salesnew", async function (req, res, next) {
  logger.debug("Getting reports by salesnew: ");
  logger.debug("Route: reports.get/salesnew");
  const subtype = req.query.subtype;
  const entitytype = req.query.entitytype;
  const warehouse = req.query.warehouse;
  const fromDt = req.query.fromDt;
  const toDt = req.query.toDt;
  const material = req.query.material;

  let subTypeFilter = {};
  if (subtype) {
    const newsubtype = subtype.split("|");
    subTypeFilter = {
      sal_subtype: { $in: newsubtype },
    };
  }

  let entityTypeFilter = {};
  if (entitytype) {
    const newentitytype = entitytype.split("|");
    entityTypeFilter = {
      sal_type: { $in: newentitytype },
    };
  }

  let warehouseFilter = {};
  if (warehouse) {
    const newWarehouse = warehouse.split("|");
    warehouseFilter = {
      sal_warehouse: { $in: newWarehouse },
    };
  }

  let dateFilter = {};
  if (fromDt && toDt) {
    dateFilter = {
      sal_date: {
        $gte: fromDt,
        $lt: toDt,
      },
    };
  }

  let materialFilter = {};
  if (material) {
    const newmaterial = material.split("|");
    materialFilter = {
      sal_material: { $in: newmaterial },
    };
  }

  let dataApi = await Sale.find({
    $and: [
      subTypeFilter,
      entityTypeFilter,
      materialFilter,
      dateFilter,
      warehouseFilter,
    ],
  });
  var data = {
    template: { shortid: "faXzusepxf" },
    data: {
      from: fromDt,
      to: toDt,
      data: dataApi,
    },
    options: {
      preview: true,
    },
  };
  var options = {
    uri: "http://localhost:5488/api/report",
    method: "POST",
    json: data,
  };

  request(options).pipe(res);
});
router.get("/stock", (req, res) => {
  logger.debug("Getting reports by stock: ");
  logger.debug("Route: reports.get/stock");
  const mydata = Entity.aggregate([
    { $group: { _id: "$ent_material", TotalMaterial: { $sum: 1 } } },
  ])
    .then((entity) => {
      if (entity.length == 0) {
        logger.error('Not found');
        res.send("Not found");
      }
      else {
        res.send(entity);
      }
    })
    .catch((err) => {
      logger.errorObj('Error to find reports by stock', err);
    });
});

router.get("/stocktest", (req, res) => {
  logger.debug("Getting reports by stocktest: ");
  logger.debug("Route: reports.get/stocktest");
  const subtype = req.query.subtype;
  const material = req.query.material;
  const warehouse = req.query.warehouse;
  const status = req.query.status;
  //////////////////////////SUBTYPE////////////////////////////////////
  let subTypeFilter = {};
  if (subtype) {
    var newsubtype = subtype.split("|").map(function (item) {
      return parseInt(item, 10);
    });

    subTypeFilter = {
      ent_subtype: { $in: newsubtype },
    };
  }
  /////////////////////////////////////MATERIAL///////////////////////////////////////
  let materialFilter = {};
  if (material) {
    var newmaterial = material.split("|");
    materialFilter = {
      ent_material: { $in: newmaterial },
    };
  }
  ///////////////////////////////////////WAREHOUSE///////////////////////////////////////
  let warehouseFilter = {};
  if (warehouse) {
    var newwarehouse = warehouse.split("|").map(function (item) {
      return parseInt(item, 10);
    });

    warehouseFilter = {
      ent_warehouse: { $in: newwarehouse },
    };
  }
  ////////////////////////////////////////////STATUS///////////////////////////////////////
  let statusFilter = {};
  if (status) {
    var newstatus = status.split("|");
    statusFilter = {
      ent_status: { $in: newstatus },
    };
  }
  const mydata = Entity.aggregate([
    {
      $lookup: {
        from: "material",
        localField: "ent_material",
        foreignField: "mat_code",
        as: "material",
      },
    },
    {
      $lookup: {
        from: "entity_subtype",
        localField: "ent_subtype",
        foreignField: "est_code",
        as: "subtype",
      },
    },
    {
      $lookup: {
        from: "warehouse",
        localField: "ent_warehouse",
        foreignField: "whs_code",
        as: "warehouse",
      },
    },
    {
      $lookup: {
        from: "entity_status",
        localField: "ent_status",
        foreignField: "sta_code",
        as: "status",
      },
    },
    {
      $match: {
        $and: [

          materialFilter,
          subTypeFilter,
          warehouseFilter,
          statusFilter,
        ],
      },
    },
    {
      $group: {
        _id: {
          material: "$material.mat_name",
          subtype: "$subtype.est_name",
          warehouse: "$warehouse.whs_name",
          status: "$status.sta_desc",
        },
        Total: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])
    .then((entity) => {
      if (entity.length == 0) res.send("");
      else res.send(entity);

    })
    .catch((err) => {
      logger.errorObj('Error to find reports by stocktest', err);
    });
});

module.exports = router;
