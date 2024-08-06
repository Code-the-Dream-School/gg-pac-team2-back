const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', register);

module.exports = router;