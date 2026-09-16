const express = require('express');
const {
  getAllDonors,
  getDonorStats,
  getDonorsByBloodGroup,
  getDonorById,
  toggleAvailability,
  addDonor,
  updateDonor,
  deleteDonor,
  toggleDonorAvailability
} = require('../controllers/donorController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.get('/', getAllDonors);
router.get('/stats', getDonorStats);
router.get('/blood-group/:group', getDonorsByBloodGroup);
router.get('/group/:group', getDonorsByBloodGroup); // alias for frontend

// Volunteer/Admin management routes
router.post('/', protect, authorize('volunteer', 'admin'), addDonor);

// Fixed-path routes must come before parameterized /:id routes
router.put('/availability', protect, toggleAvailability);
router.patch('/availability', protect, toggleAvailability); // alias for frontend (PATCH)

// Parameterized routes
router.get('/:id', getDonorById);
router.put('/:id', protect, authorize('volunteer', 'admin'), updateDonor);
router.delete('/:id', protect, authorize('volunteer', 'admin'), deleteDonor);
router.patch('/:id/availability', protect, authorize('volunteer', 'admin'), toggleDonorAvailability);

module.exports = router;
