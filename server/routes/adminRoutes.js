const express = require('express');
const {
  getAllUsers,
  getDashboardStats,
  getPendingApprovals,
  approveUser,
  banUser,
  unbanUser
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

// Apply protect and authorize middleware to all routes in this router
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/stats', getDashboardStats);
router.get('/pending', getPendingApprovals);
router.get('/users/pending', getPendingApprovals); // alias for frontend

router.put('/approve/:id', approveUser);
router.put('/users/:id/approve', approveUser); // alias for frontend
router.patch('/users/:id/approve', approveUser); // alias for frontend (PATCH)

router.put('/ban/:id', banUser);
router.put('/users/:id/ban', banUser); // alias for frontend
router.patch('/users/:id/ban', banUser); // alias for frontend (PATCH)

router.put('/unban/:id', unbanUser);
router.put('/users/:id/unban', unbanUser);
router.patch('/users/:id/unban', unbanUser);

module.exports = router;
