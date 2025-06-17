const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const ParamSchema = new Schema({
    par_tag: {
        type: String
    },
    txt_val1: {
        type: String
    },
    txt_val2: {
        type: String
    },
    num_val1: {
        type: Number
    },
    num_val2: {
        type: Number
    },
})

module.exports = Pram = mongoose.model('param', ParamSchema, 'param');