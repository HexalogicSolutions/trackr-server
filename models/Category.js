const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create new schema
const CategorySchema = new Schema({
     cat_company: {
        type: String,
        required: true,
    },
    cat_code: {
        type: String,
        required: true,
    },
    cat_desc: {
        type: String,
        required: true,
    }
})
module.exports = Category = mongoose.model('category', CategorySchema, 'category');