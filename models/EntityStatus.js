const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create new schema
const EntityStatusSchema = new Schema({
  sta_code: {
    type: String,
    required: true,
    unique: true,
  },
  sta_desc: {
    type: String,
    required: true,
  },
  sta_enabled: {
    type: Boolean,
  },
});

module.exports = EntityStatus = mongoose.model(
  "entity_status",
  EntityStatusSchema,
  "entity_status"
);
