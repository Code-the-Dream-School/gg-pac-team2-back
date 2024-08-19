const express = require('express');
const router = express.Router();

const {
  readProfile,
  updateProfile
} = require('../controllers/profileController');

const authMiddleware = require('../middleware/authMiddleware')

router.route('/profile').get(authMiddleware, readProfile).patch(authMiddleware, updateProfile);

module.exports = router;