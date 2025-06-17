const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const CustomerSchema = new Schema({
    cus_company: {
        type: String,
        required: true,
    },
    cus_code: {
        type: String,
        required: true,
    },
    cus_name: {
        type: String,
        required: true,
    },
    cus_addr: {
        type: String,
    },
    cus_phone: {
        type: String,
    },
    cus_mobile: {
        type: String,
    },
    cus_email: {
        type: String,

    },
    cus_status: {
        type: String,
        required: true,

    },
    cus_other_details: {
        type: String,

    },
    cus_created: {
        type: Date,
        required: true,

    },
    cus_updated: {
        type: Date,
        required: true,
    },
    cus_updated_by: {
        type: String,

    },
})
module.exports = Customer = mongoose.model('customer', CustomerSchema, 'customer');