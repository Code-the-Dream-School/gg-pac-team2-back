const express = require('express');
const router = express.Router();

const { login, register, forgotPassword, resetPassword, logout } = require('../controllers/authController.js');

const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword )
router.post('/reset-password/:id/:token', resetPassword)
router.post('/logout', authMiddleware, logout)

module.exports = router;
