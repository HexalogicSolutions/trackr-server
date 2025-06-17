const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const WarehouseSchema = new Schema({
    whs_company: {
        type: String,
        required: true
    },
    whs_code: {
        type: Number,
        required: true

    },
    whs_name: {
        type: String,
        required: true,

    },
    whs_active: {
        type: Boolean,
    }
})

module.exports = Warehouse = mongoose.model('warehouse', WarehouseSchema, 'warehouse');