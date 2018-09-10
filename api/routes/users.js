const express = require('express');
const router = express.Router();

const authenticator = require('../authMiddleware/jwtChecker');
const UserController = require('../controllers/users')

// Handle incoming requests to "/users"
router.post('/signup', UserController.signupUser);
router.post('/login', UserController.loginUser);
router.delete('/:id', authenticator, UserController.deleteUser);


module.exports = router;