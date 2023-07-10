const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        currencySymbol:{
          type: String
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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
