const express = require('express');
const { uploadAvatar } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
