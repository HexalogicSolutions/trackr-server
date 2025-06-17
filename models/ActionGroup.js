const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const ActionGroupSchema = new Schema({
    act_company : {
        type : String,
       
    },
    act_code : {
        type : Number,
    },
    act_name : {
        type : String,
    },
    act_material: {
        type : String,
      
    },
    act_entity_type: {
        type : String,
      
    },
    act_entity_subtype : {
        type : String,
        
    },
    act_warehouse: {
        type : String,
       
    },
    act_location_area : {
        type : String,
       
    },
    act_location: {
        type : String,
    
    },
    act_status : {
        type : String,
       
    },
    act_enabled: {
        type :Boolean,
      
    },
     act_entity_count: {
        type : Number,
     
    }
})

module.exports = ActionGroup = mongoose.model('action_group', ActionGroupSchema ,'action_group');