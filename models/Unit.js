const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const UnitSchema = new Schema({
    unt_code: {
        type: String,
        required: true,
    },
    unt_name: {
        type: String,
        required: true,
    }
})
module.exports = Unit = mongoose.model('unit', UnitSchema, 'unit');