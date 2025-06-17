const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const EntitySubTypeSchema = new Schema({
    est_company : {
        type : String,
        required : true
    },
    est_code : {
        type : Number,
        required : true,

    },
    est_type : {
        type : Number,
        required : true,
    },
    est_name: {
        type : String,
        required : true,
    },
    est_active : {
        type : Boolean,
   
    }
})

module.exports = EntitySubType = mongoose.model('entity_subtype', EntitySubTypeSchema ,'entity_subtype');