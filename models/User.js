const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const UserSchema = new Schema({
    usr_company : {
        type : String,
        required : true
    },
    usr_code : {
        type : String,
        required : true,
        unique : true
    },
    usr_name : {
        type : String,
        required : true
    },
    usr_password : {
        type : String,
        required : true
    },
    usr_email : {
        type : String
    },
    usr_group : {
        type : String,
        required : true
    },
    usr_active : {
        type : Boolean,
   
    }
})

module.exports = User = mongoose.model('user', UserSchema,'user');