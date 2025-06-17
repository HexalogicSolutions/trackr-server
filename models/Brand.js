const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const BrandSchema = new Schema({
    brn_company : {
        type : String,
        required : true
    },
    brn_code : {
        type : String,
        required : true,
  },
brn_enabled : {
        type : Boolean,
   
    }
})

module.exports = Brand= mongoose.model('brand', BrandSchema ,'brand');