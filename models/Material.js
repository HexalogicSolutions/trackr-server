const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const MaterialSchema = new Schema({
    mat_code: {
        type: String,
        required: true
    },
    mat_name: {
        type: String,
        required: true,

    },
    mat_enable: {
        type: Boolean,
    }
})

module.exports = Material = mongoose.model('material', MaterialSchema, 'material');