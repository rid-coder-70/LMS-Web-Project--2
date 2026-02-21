const Transaction = require('../models/Transaction');

// @desc    Get user's transactions
// @route   GET /api/transactions/my
// @access  Private
const getMyTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            $or: [{ from: req.user._id }, { to: req.user._id }],
        })
            .populate('from', 'name email')
            .populate('to', 'name email')
            .populate('course', 'title')
            .sort('-createdAt');

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate('from', 'name email')
            .populate('to', 'name email')
            .populate('course', 'title price');

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Check if user is part of the transaction
        if (
            transaction.from.toString() !== req.user._id.toString() &&
            transaction.to.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized to view this transaction' });
        }

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMyTransactions,
    getTransaction,
};
