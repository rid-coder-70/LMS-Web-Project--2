const express = require('express');
const router = express.Router();
const {
    getMyCertificates,
    getCertificate,
} = require('../controllers/certificateController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/my', protect, restrictTo('learner'), getMyCertificates);
router.get('/:id', getCertificate); // Public route for certificate verification

module.exports = router;
