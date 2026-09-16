const express = require('express');
const {
  createRequest,
  getAllRequests,
  getMyRequests,
  getRequestById,
  updateRequest,
  deleteRequest
} = require('../controllers/bloodRequestController');
const { protect } = require('../middleware/auth');
const { bloodRequestRules } = require('../middleware/validator');

const router = express.Router();

router.route('/')
  .post(protect, bloodRequestRules, createRequest)
  .get(getAllRequests);

router.get('/my', protect, getMyRequests);
router.get('/me', protect, getMyRequests); // alias for frontend

router.route('/:id')
  .get(getRequestById)
  .put(protect, updateRequest)
  .delete(protect, deleteRequest);

module.exports = router;
