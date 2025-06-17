const { Number } = require('mongoose');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const StockLineSchema = new Schema({
    stl_number: {
        type: String,
        required: true
    },
    stl_line: {
        type: String,
    },
    stl_item: {
        type: String,
    },
    stl_item_desc: {
        type: String,
    },
    stl_sku: {
        type: String,
    },
    stl_lot: {
        type: String,
    },
    stl_notes: {
        type: String,
    },
    stl_qty: {
        type: Number,
    },
    stl_qty_requested: {
        type: Number,
    },
    stl_qty_variance: {
        type: String,
    },
    stl_weight: {
        type: Number,
    },
    stl_weight_requested: {
        type: Number,
    },
    stl_weight_variance: {
        type: String,
    },
    stl_wgt_unit: {
        type: String,
    },
    stl_price: {
        type: Number,
    },
    stl_tax: {
        type: Number,
    },
    stl_currency: {
        type: String,
    }
})
module.exports = StockLine = mongoose.model('stock_line', StockLineSchema, 'stock_line');