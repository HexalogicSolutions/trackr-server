const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create new schema
const SaleSchema = new Schema({
  sal_company: {
    type: String,
    required: true,
  },
  sal_entity: {
    type: String,
    required: true,
  },
  sal_serial: {
    type: String,
  },
  sal_extcode: {
    type: String,
  },
  sal_warehouse: {
    type: String,
  },
  sal_material: {
    type: String,
  },
  sal_type: {
    type: Number,
  },
  sal_subtype: {
    type: Number,
  },
  sal_date: {
    type: Date,
  },
  sal_price: {
    type: Number,
  },
  sal_weight: {
    type: Number,
  },
  sal_user: {
    type: String,
  },
  sal_notes: {
    type: String,
  },
  sal_epc: {
    type: String,
  },
});

module.exports = Sale = mongoose.model("sale", SaleSchema, "sale");
