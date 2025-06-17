const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const LocationTypeSchema = new Schema({
    lat_company : {
        type : String,
        required : true
    },
    lat_code : {
        type : Number,
        required : true
  
    },
    lat_name : {
        type : String,
        required : true,
      
    },
    lat_active: {
        type : Boolean,       
    }
})

module.exports = LocationType = mongoose.model('location_type', LocationTypeSchema, 'location_type');