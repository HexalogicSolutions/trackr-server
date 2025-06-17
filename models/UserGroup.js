const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const UserGroupSchema = new Schema({
    grp_company : {
        type : String,
        required : true
    },
    grp_code : {
        type : String,
        required : true,
        unique : true
    },
    grp_name : {
        type : String,
        required : true
    },
    grp_enabled: {
        type : Boolean,
       
    }
})

module.exports = UserGroup = mongoose.model('user_group', UserGroupSchema, 'user_group');