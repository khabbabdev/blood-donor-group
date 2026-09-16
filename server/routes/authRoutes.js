const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerRules, loginRules } = require('../middleware/validator');

const router = express.Router();

router.post('/register', registerRules, register);
router.post('/login', loginRules, login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/profile', protect, updateProfile); // alias for frontend
router.put('/change-password', protect, changePassword);
router.put('/password', protect, changePassword); // alias for frontend

module.exports = router;
