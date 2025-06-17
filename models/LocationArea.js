const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const LocationAreaSchema = new Schema({
    lar_company : {
        type : String,
        required : true
    },
    lar_code : {
        type : Number,
        required : true,

    },
    lar_name: {
        type : String,
        required : true,
    },
    lar_active : {
        type : Boolean,
   
    }
})

module.exports = locationArea = mongoose.model('location_area', LocationAreaSchema,'location_area');