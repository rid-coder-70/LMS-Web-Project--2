const express = require('express');
const router = express.Router();
const { register, login, setupBank, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.put('/setup-bank', protect, setupBank);
router.get('/me', protect, getMe);

module.exports = router;
