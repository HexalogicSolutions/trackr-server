const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const ItemSchema = new Schema({
    itm_company: {
        type: String,
        required: true,
    },
    itm_code: {
        type: String,
        required: true,
    },
    itm_desc: {
        type: String,
        required: true,
    },
    itm_unit: {
        type: String,
        required: true,
    },
    // itm_sku: {
    //     type: String,

    // },
    itm_default_order_qty: {
        type: Number,

    },
    itm_ext_code: {
        type: String,

    },
    itm_category: {
        type: String,

    },
    itm_status: {
        type: String,

    },
    itm_supplier_id: {
        type: String,

    },
    itm_other_details: {
        type: String,

    },
    itm_created: {
        type: Date,
        required: true,
    },
    itm_updated: {
        type: Date,
        required: true,
    },
    itm_updated_by: {
        type: String,
        required: true,
    },
})
module.exports = Item = mongoose.model('item', ItemSchema, 'item');