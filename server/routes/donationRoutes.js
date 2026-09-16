const express = require('express');
const {
  createDonation,
  getMyDonations,
  getAllDonations,
  verifyDonation,
  updateDonation,
  deleteDonation
} = require('../controllers/donationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.use(protect); // All donation routes require authentication

router.post('/', createDonation);
router.get('/my', getMyDonations);
router.get('/me', getMyDonations); // alias
router.get('/', authorize('admin', 'volunteer'), getAllDonations);
router.put('/:id/verify', authorize('admin', 'volunteer'), verifyDonation);
router.put('/:id', protect, updateDonation);
router.delete('/:id', protect, deleteDonation);

module.exports = router;
