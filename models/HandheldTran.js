const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create nested schema
var hhEntity = new Schema({
    id: String,
    code: String,
    epc: String
  });

// Create parent Schema
const HandheldTranSchema = new Schema({
    hht_company : {
        type : String,
        required : true
    },
    hht_user : {
        type : String,
        required : true
    },
    hht_user_name : {
        type : String,
        required : true
    },
    hht_operation : {
        type : String,
        required : true
    },
    hht_device_id : {
        type : String
    },
    hht_device_name : {
        type : String
    },
    hht_action_group : {
        type : Number,
    },
    hht_datetime : {
        type : Date,
        required : true
    },
    hht_scanned_entities : [hhEntity],

    hht_missing_entities : [hhEntity]

})

module.exports = HandheldTran= mongoose.model('handheld_tran', HandheldTranSchema ,'handheld_tran');