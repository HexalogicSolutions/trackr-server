const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");


const Category = require('../../models/Category');
router.post("/", (req, res) => {
  logger.debug("Route: category.post/");
  logger.debug("Inserting category record: " + JSON.stringify(req.body))

  const { code, desc } = req.body;
  if (!code || !desc) {
    logger.error('Please enter all the data');
    res.json({ success: false, msg: "Please enter all the data" });
  }
  Category.findOne({ cat_code: code }).then((category) => {
    if (category) {
      logger.error('Category code already exits' + code)
      return res.json({ success: false, msg: "Category code already exits" });
    }
    const newCategory = new Category({
      cat_company: "HLS",
      cat_code: code,
      cat_desc: desc,
    });
    newCategory
      .save()
      .then((data) => {
        logger.debug('Category added' + data)
        return res.json({ success: true, msg: " Category added" });
      })
      .catch((err) => {
        logger.errorObj('Category code could not be saved', err)
        return res.json({
          success: false,
          msg: "Category code could not be saved",
        });
      });
  });
});

// get all categories
router.get("/", (req, res) => {
  logger.debug("Route: category.get/");
  logger.debug("Getting category list");

  Category.find()
    .then((category) => {
      res.send(category);
    })
    .catch((err) => {
      logger.errorObj('Error getting category list', err)
    });
});

//get category by code
router.get("/:code", (req, res) => {
  logger.debug("Route: category.get/");
  logger.debug("Getting category record " + req.params.code);

  Category.find({ cat_code: req.params.code })
    .then((category) => {
      if (category.length == 0) {
        logger.error('Category not found' + req.params.code);
        res.send("No category found");
      }
      else
        res.send(category[0]);
    })
    .catch((err) => {
      logger.errorObj('Category not found: ' + req.params.code, err);
    });
});

router.delete("/:code", (req, res) => {
  Category.find({ cat_code: req.params.code })
    .then((categorys) => {
      if (categorys.length == 0) {
        logger.error('Category not found' + req.params.code);
        res.send("No category found");
      }
      else {
        const category = categorys[0];
        category
          .delete()
          .then((cat) => {
            res.send(`Category ${req.params.code} deleted successfully.`);
          })
          .catch((e) => {
            logger.errorObj('Error deleting category: ' + req.params.code, e);
            throw e;
          });
      }
    })
    .catch((err) => {
      logger.errorObj('Category not found: ' + req.params.code, err);
      throw err;
    });
});

//update api
router.put("/", (req, res) => {
  logger.debug("Route: category.post/");
  logger.debug("Updating category record: " + req.body.toString())
  const { code, desc } = req.body;
  Category.findOne({ cat_code: code }).then((category) => {
    if (!category) {
      logger.error('cateogory does not exitst')
      return res.json({ success: false, msg: "category does not exist" });
    }
    Category.updateOne(
      { cat_code: code },
      {
        $set: {
          cat_desc: desc,
        },
      }
    )
      .then((resp) => {
        logger.debug('Category updated successfully')
        res.json({
          success: true,
          msg: " Category Updated",
        });
      })
      .catch((err) => {
        logger.errorObj('Category not updated')
        if (err) {
          throw err;
        }
      });
  });
});
module.exports = router;
