const { Number } = require('mongoose');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const StockLevelSchema = new Schema({
    stk_item: {
        type: String,
        required: true
    },
    stk_item_desc: {
        type: String,
    },
    stk_lot: {
        type: String,
    },
    stk_warehouse: {
        type: String,
    },
    stk_sku: {
        type: String,
    },
    stk_qty: {
        type: Number,
    },
    stk_weight: {
        type: Number,
    },
    stk_weight_unit: {
        type: Number,
    }
})
module.exports = StockLevel = mongoose.model('stock_level', StockLevelSchema, 'stock_level');