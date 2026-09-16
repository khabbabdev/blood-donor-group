const express = require('express');
const {
  submitContact,
  getAllContacts,
  markContactAsRead
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { contactRules } = require('../middleware/validator');

const router = express.Router();

// Public route
router.post('/', contactRules, submitContact);

// Admin-only routes
router.get('/', protect, authorize('admin'), getAllContacts);
router.put('/:id/read', protect, authorize('admin'), markContactAsRead);

module.exports = router;
