const { Number } = require('mongoose');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const StockHeaderSchema = new Schema({
    sth_number: {
        type: String,
        required: true
    },
    sth_type: {
        type: String,
    },
    sth_item_count: {
        type: Number,
    },
    sth_status: {
        type: String,
    },
    sth_notes: {
        type: String,
    },
    sth_date_created: {
        type: Date,
    },
    sth_date_updated: {
        type: Date,
    },
    sth_date_confirmed: {
        type: Date,
    },
    sth_updated_by: {
        type: String,
    },
    sth_warehouse: {
        type: String,
    },
    sth_supplier: {
        type: String,
    },
    sth_customer: {
        type: String,
    },
    sth_warehouse_from: {
        type: String,
    },
    sth_warehouse_to: {
        type: String,
    },
    sth_total_quantity: {
        type: Number,
    },
    sth_total_weight: {
        type: Number,
    },
    sth_weight_unit: {
        type: String,
    },
    sth_total_price: {
        type: Number,
    },
    sth_total_tax: {
        type: Number,
    },
    sth_currency: {
        type: String,
    },
    sth_src_tran: {
        type: String,
    },
    sth_src_tran_type: {
        type: String,
    },
    sth_hh_user: {
        type: String,
    },
})
module.exports = StockHeader = mongoose.model('stock_header', StockHeaderSchema, 'stock_header');