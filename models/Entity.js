const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create new schema
const EntitySchema = new Schema({
  ent_company: {
    type: String,
    required: true,
  },
  ent_code: {
    type: String,
    required: true,
  },
  ent_extcode: {
    type: String,
  },
  ent_serial: {
    type: String,
  },
  ent_epc: {
    type: String,
  },
  ent_desc: {
    type: String,
  },
  ent_material: {
    type: String,
  },
  ent_type: {
    type: Number,
  },
  ent_subtype: {
    type: Number,
  },
  ent_brand: {
    type: String,
  },
  ent_unit: {
    type: String,
  },
  ent_sku: {
    type: String,
  },
  ent_lot: {
    type: String,
  },
  ent_status: {
    type: String,
  },
  ent_warehouse: {
    type: Number,
  },
  ent_area: {
    type: Number,
  },
  ent_location: {
    type: Number,
  },
  ent_weight: {
    type: Number,
  },
  ent_purity: {
    type: Number,
  },
  ent_price: {
    type: Number,
  },
  ent_price: {
    type: Number,
  },
  ent_lastseen: {
    type: Date,
  },
  ent_duration: {
    type: Number,
  },
  ent_active: {
    type : Boolean,
  },
});

module.exports = Entity = mongoose.model("entity", EntitySchema, "entity");
