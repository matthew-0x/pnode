const express = require('express');
const router = express.Router();


const authenticator = require('../authMiddleware/jwtChecker');
const OrderController = require('../controllers/orders');

// Handle incoming requests to "/orders"
router.get('/', OrderController.findAllOrders);
router.get('/:id', OrderController.findOrder);
router.post('/', authenticator, OrderController.createOrder);
router.delete('/:id', authenticator, OrderController.deleteOrder);


module.exports = router;