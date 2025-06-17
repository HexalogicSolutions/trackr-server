const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const SupplierStatusSchema = new Schema({
    sup_sta_code: {
        type: String,
        required: true,
    },
    sup_sta_desc: {
        type: String,
        required: true,
    },

})

module.exports = SupStatus = mongoose.model('sup_status', SupplierStatusSchema, 'sup_status');