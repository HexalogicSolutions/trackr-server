const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create new schema
const TraceSchema = new Schema({
    trc_company_code: {
        type: String
    },
    trc_date_time: {
        type: Date
    },
    trc_status: {
        type: String
    },
    trc_order_type: {
        type: String
    },
    trc_order_no: {
        type: String
    },
    trc_user: {
        type: String
    },
    trc_description: {
        type: String
    },
    trc_operation: {
        type: String
    },
    trc_file: {
        type: String
    },
});

module.exports = Trace = mongoose.model(
    "trace",
    TraceSchema,
    "trace"
);
