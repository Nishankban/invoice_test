const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        productNo: {
            type: Number,
            default: 0
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        productCurrency: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        images: [String],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
