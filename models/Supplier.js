const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const SupplierSchema = new Schema({
    sup_company: {
        type: String,
        required: true,
    },
    sup_code: {
        type: String,
        required: true,
    },
    sup_name: {
        type: String,
        required: true,
    },
    sup_addr: {
        type: String,
    },
    sup_phone: {
        type: String,
    },
    sup_mobile: {
        type: String,
    },
    sup_email: {
        type: String,

    },
    sup_status: {
        type: String,
        required: true,

    },
    sup_other_details: {
        type: String,

    },
    sup_created: {
        type: Date,
        required: true,

    },
    sup_updated: {
        type: Date,
        required: true,
    },
    sup_updated_by: {
        type: String,

    },
})
module.exports = Supplier = mongoose.model('supplier', SupplierSchema, 'supplier');