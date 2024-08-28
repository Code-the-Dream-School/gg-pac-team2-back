const express = require('express');
const router = express.Router();

const {
  readProfile,
  updateProfile,
  deleteProfile,
  readAllProfiles,
  viewProfileById,
  changePassword
} = require('../controllers/profileController');

const authMiddleware = require('../middleware/authMiddleware')

router.route('/').get(authMiddleware, readProfile).patch(authMiddleware, updateProfile);
router.route('/allprofiles').get(authMiddleware, readAllProfiles)
router.route('/:id').delete(authMiddleware, deleteProfile).get(authMiddleware, viewProfileById)
router.route('/:id/change-password').patch(authMiddleware, changePassword)

module.exports = router;