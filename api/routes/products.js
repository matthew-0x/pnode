const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/products')
const authenticator = require('../authMiddleware/jwtChecker');


// Handle incoming requests to "/products"
router.get('/', ProductController.findAllProducts);
router.post('/',  authenticator, ProductController.createProduct);
router.get('/:id',  ProductController.findProduct);
router.put('/:id',  authenticator, ProductController.modifyProduct);
router.delete('/:id',  authenticator, ProductController.deleteProduct);


module.exports = router;