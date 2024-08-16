const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true,
        index: true,
        trim: true
    },
    price: {
        type: Number,
        min: 0,
        max: 10000000000,
        required: true
    },
    description: {
        type: String,
        minlength: 0,
        maxlength: 1000,
        required: true,
        trim: true
    },
    image: {
        
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref:"Category"    
    },
});

module.exports = mongoose.model("Product", productSchema);
