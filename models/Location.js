const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const LocationSchema = new Schema({
    loc_company : {
        type : String,
        required : true
    },
    loc_code : {
        type : Number,
        required : true
     },
    loc_area : {
        type :Number,
        required : true,
      
    },
    loc_name : {
        type : String,
        required : true,
      
    },
    loc_enable: {
        type : Boolean,       
    }
})

module.exports = Location = mongoose.model('location', LocationSchema, 'location');