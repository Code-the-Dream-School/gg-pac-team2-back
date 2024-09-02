const express = require('express');
const router = express.Router();

const {
  createRequest,
  readRequest,
  updateRequest,
  updateStatus,
  deleteRequest
} = require('../controllers/requestController');

const authMiddleware = require('../middleware/authMiddleware');

router.route('/').post(authMiddleware, createRequest);
router.route('/:id').get(authMiddleware, readRequest).patch(authMiddleware, updateRequest).delete(authMiddleware, deleteRequest);
router.route('/:id/status').patch(authMiddleware, updateStatus);

module.exports = router;