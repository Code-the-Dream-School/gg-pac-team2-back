const express = require('express');
const router = express.Router();

const {
  readProfile,
  updateProfile,
  deleteProfile,
  readAllProfiles,
  viewProfileById
} = require('../controllers/profileController');

const authMiddleware = require('../middleware/authMiddleware')

router.route('/').get(authMiddleware, readProfile).patch(authMiddleware, updateProfile);
router.route('/allprofiles').get(authMiddleware, readAllProfiles)
router.route('/:id').delete(authMiddleware, deleteProfile).get(authMiddleware, viewProfileById)

module.exports = router;