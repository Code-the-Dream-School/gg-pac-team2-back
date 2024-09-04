const express = require('express');
const router = express.Router();

const {
  createRequest,
  readRequest,
  readSentRequests,
  readReceivedRequests,
  updateRequest,
  updateStatus,
  deleteRequest,
} = require('../controllers/requestController');

const authMiddleware = require('../middleware/authMiddleware');

router.route('/').post(authMiddleware, createRequest);
router.route('/sent').get(authMiddleware, readSentRequests);
router.route('/received').get(authMiddleware, readReceivedRequests);
router
  .route('/:id')
  .get(authMiddleware, readRequest)
  .patch(authMiddleware, updateRequest)
  .delete(authMiddleware, deleteRequest);
router.route('/:id/status').patch(authMiddleware, updateStatus);

module.exports = router;
