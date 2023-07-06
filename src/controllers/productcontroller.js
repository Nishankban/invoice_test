const Product = require('../models/ProductModels/product');

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a specific product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(400).json({ error: 'Product not found' });
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, price, productCurrency, description } = req.body;
        const userId = req.userId; // Assuming you have the authenticated user's ID available in req.userId
        const images = req.files.map((file) => file.path);

        // Find the maximum productNo for the user
       /* const maxProductNo = await Product.findOne({ user: userId })
            .sort({ productNo: -1 })
            .select('productNo')
            .lean();

        const newProductNo = maxProductNo ? maxProductNo.productNo + 1 : 1;*/

        const newProduct = new Product({
            name,
            price,
            productCurrency,
            description,
            images,
/*
            productNo: newProductNo,
*/
            userId: userId
        });

        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getProductCountByUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Count the number of products associated with the user
        const productCount = await Product.countDocuments({ user: userId });

        res.json({ user: user.username, productCount });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Update a product
const updateProduct = async (req, res) => {
    try {
        const { name, price, productCurrency, description } = req.body;
        const images = req.files.map((file) => file.path);

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, productCurrency, description, images },
            { new: true }
        );

        if (!product) {
            res.status(400).json({ error: 'Product not found' });
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            res.status(400).json({ error: 'Product not found' });
        } else {
            res.json({ message: 'Product deleted successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    getProductCountByUser,
    updateProduct,
    deleteProduct
};
