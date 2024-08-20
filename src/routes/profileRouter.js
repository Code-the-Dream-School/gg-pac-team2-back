const express = require('express');
const router = express.Router();

const {
  readProfile,
  updateProfile,
  deleteProfile,
  readAllProfiles
} = require('../controllers/profileController');

const authMiddleware = require('../middleware/authMiddleware')

router.route('/').get(authMiddleware, readAllProfiles).get(authMiddleware, readProfile).patch(authMiddleware, updateProfile);
router.route('/:id').delete(authMiddleware, deleteProfile)

module.exports = router;