const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");
const Sale = require("../../models/Sale");

// get all sales
router.get("/", (req, res) => {
  logger.debug("Getting list of all sales: ");
  logger.debug("Route: sales.get/");
  Sale.find()
    .then((sale) => {
      res.send(sale);
    })
    .catch((err) => {
      logger.errorObj('Error to find sales', err);
    });
});
router.get("/sale-quantity-by-material", (req, res) => {
  logger.debug("Getting sales by sale-quantity-by-material: ");
  logger.debug("Route: sales.get/sale-quantity-by-material");
  const fromDt = req.query.fromDt;
  const toDt = req.query.toDt;
  const mydata = Sale.aggregate([
    {
      $lookup: {
        from: "material",
        localField: "sal_material",
        foreignField: "mat_code",
        as: "mydata",
      },
    },
    {
      $match: {
        sal_date: {
          $gte: new Date(fromDt),
          $lt: new Date(toDt),
        },
      },
    },
    {
      $group: { _id: "$mydata.mat_name", TotalMaterial: { $sum: 1 } },

    },
    { $sort: { _id: 1 } }
  ])
    .then((sale) => {
      if (sale.length == 0) res.send("");
      else res.send(sale);

    })
    .catch((err) => {
      logger.errorObj('Error to find sales by sale-quantity-by-material', err)
    });
});
router.get("/sale-report", (req, res) => {
  logger.debug("Getting sales by sale-report: ");
  logger.debug("Route: sales.get/sale-report");
  const fromDt = req.query.fromDt;
  const toDt = req.query.toDt;
  const subtype = req.query.subtype;
  const warehouse = req.query.warehouse;
  const material = req.query.material;
  let dateFilter = {};
  if (fromDt && toDt) {
    dateFilter = {
      sal_date: {
        $gte: fromDt,
        $lt: toDt,
      },
    };
  }

  let subTypeFilter = {};
  if (subtype) {
    const newsubtype = subtype.split("|");
    subTypeFilter = {
      sal_subtype: { $in: newsubtype },
    };
  }

  let warehouseFilter = {};
  if (warehouse) {
    const newWarehouse = warehouse.split("|");
    warehouseFilter = {
      sal_warehouse: { $in: newWarehouse },
    };
  }

  let materialFilter = {};
  if (material) {
    const newmaterial = material.split("|");
    materialFilter = {
      sal_material: { $in: newmaterial },
    };
  }
  var mysort = { hht_datetime: 1 };
  Sale.find({
    $and: [
      subTypeFilter,
      materialFilter,
      dateFilter,
      warehouseFilter,
    ],
  }).sort(mysort)
    .then((sale) => {
      res.send(sale);
    })
    .catch((err) => {
      logger.errorObj('Error to find sales by sale-report', err)
    });
});



router.get("/sale-quantity-by-subtype", (req, res) => {
  logger.debug("Getting sales by sale-quantity-by-subtype : ");
  logger.debug("Route: sales.get/sale-quantity-by-subtype");
  const fromDt = req.query.fromDt;
  const toDt = req.query.toDt;
  const mydata = Sale.aggregate([
    {
      $lookup: {
        from: "entity_subtype",
        localField: "sal_subtype",
        foreignField: "est_code",
        as: "mydata",
      },
    },
    {
      $match: {
        sal_date: {
          $gte: new Date(fromDt),
          $lt: new Date(toDt),
        },
      },
    },
    {
      $group: { _id: "$mydata.est_name", TotalSubtype: { $sum: 1 } },
    },
    { $sort: { _id: 1 } }
  ])
    .then((sale) => {
      if (sale.length == 0) res.send("");
      else res.send(sale);

    })
    .catch((err) => {
      logger.errorObj('Error to find sales by sale-quantity-by-subtype', err)
    });
});

router.get("/sale-amount-by-material", (req, res) => {
  logger.debug("Getting sales by sale-amount-by-material: ");
  logger.debug("Route: sales.get/sale-amount-by-material");
  const fromDt = req.query.fromDt;
  const toDt = req.query.toDt;
  const mydata = Sale.aggregate([
    {
      $lookup: {
        from: "material",
        localField: "sal_material",
        foreignField: "mat_code",
        as: "mydata",
      },
    },
    {
      $match: {
        sal_date: {
          $gte: new Date(fromDt),
          $lt: new Date(toDt),
        },
      },
    },
    { $group: { _id: "$mydata.mat_name", TotalMaterial: { $sum: "$sal_price" } } },
    { $sort: { _id: 1 } }
  ])
    .then((sale) => {
      if (sale.length == 0) res.send("");
      else res.send(sale);

    })
    .catch((err) => {
      logger.errorObj('Error to find sales by sale-amount-by-material', err)
    });
});

router.get("/sale-amount-by-subtype", (req, res) => {
  logger.debug("Getting sales by sale-amount-by-subtype: ");
  logger.debug("Route: sales.get/sale-amount-by-subtype");
  const fromDt = req.query.fromDt;
  const toDt = req.query.toDt;
  const mydata = Sale.aggregate([
    {
      $lookup: {
        from: "entity_subtype",
        localField: "sal_subtype",
        foreignField: "est_code",
        as: "mydata",
      },
    },
    {
      $match: {
        sal_date: {
          $gte: new Date(fromDt),
          $lt: new Date(toDt),
        },
      },
    },
    {
      $group: { _id: "$mydata.est_name", TotalSubtype: { $sum: "$sal_price" } },
    },
    { $sort: { _id: 1 } }
  ])
    .then((entity) => {
      if (entity.length == 0) res.send("");
      else {
        res.send(entity);
      }
    })
    .catch((err) => {
      logger.errorObj('Error to find sales by sale-amount-by-subtype', err);
    });
});

module.exports = router;
