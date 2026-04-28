const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

// Routes không cần xác thực
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);

module.exports = router;
