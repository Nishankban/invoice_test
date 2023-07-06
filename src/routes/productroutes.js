const express = require('express');
const router = express.Router();
const generateStorage = require('../helpers/multerhelper');

const productController = require('../controllers/productcontroller');
const {authenticateToken} = require("../helpers/jwt");
const upload = generateStorage('product');

router.route('/')
    .get(authenticateToken,productController.getProducts)
    .post(authenticateToken,upload.array('images'), productController.createProduct);

router.route('/:id')
    .get(authenticateToken,productController.getProductById)
    .put(authenticateToken,upload.array('images'), productController.updateProduct)
    .delete(authenticateToken,productController.deleteProduct);

module.exports = router;
