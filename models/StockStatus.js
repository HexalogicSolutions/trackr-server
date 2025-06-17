const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create new schema
const StockStatusSchema = new Schema({
    sth_code: {
        type: String,
        required: true,
        unique: true,
    },
    sth_desc: {
        type: String,
        required: true,
    },
    sth_enabled: {
        type: Boolean,
    },
});

module.exports = StockStatus = mongoose.model(
    "stock_status",
    StockStatusSchema,
    "stock_status"
);
