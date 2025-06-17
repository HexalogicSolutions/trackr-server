const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const EntityTypeSchema = new Schema({
    ett_company : {
        type : String,
        required : true
    },
    ett_code : {
        type : Number,
        required : true
  
    },
    ett_name : {
        type : String,
        required : true,
      
    },
    ett_active: {
        type : Boolean,       
    }
})

module.exports = EntityType = mongoose.model('entity_type', EntityTypeSchema, 'entity_type');