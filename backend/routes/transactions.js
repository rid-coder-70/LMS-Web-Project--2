const express = require('express');
const router = express.Router();
const {
    getMyTransactions,
    getTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.get('/my', protect, getMyTransactions);
router.get('/:id', protect, getTransaction);

module.exports = router;
