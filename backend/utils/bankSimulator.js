const User = require('../models/User');

/**
 * Simulates a bank transaction between two accounts
 * @param {String} fromUserId - Sender's user ID
 * @param {String} toUserId - Receiver's user ID
 * @param {Number} amount - Transaction amount
 * @param {String} secretNumber - Sender's secret number for validation
 * @returns {Object} Transaction result
 */
const processBankTransaction = async (fromUserId, toUserId, amount, secretNumber) => {
    try {
        // Get sender with secret number
        const sender = await User.findById(fromUserId).select('+secretNumber');
        const receiver = await User.findById(toUserId);

        // Validation checks
        if (!sender) {
            return {
                success: false,
                message: 'Sender account not found',
            };
        }

        if (!receiver) {
            return {
                success: false,
                message: 'Receiver account not found',
            };
        }

        if (!sender.bankAccountNumber || !sender.secretNumber) {
            return {
                success: false,
                message: 'Sender has not set up bank information',
            };
        }

        if (sender.secretNumber !== secretNumber) {
            return {
                success: false,
                message: 'Invalid secret number',
            };
        }

        if (sender.balance < amount) {
            return {
                success: false,
                message: 'Insufficient balance',
            };
        }

        // Process transaction
        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        return {
            success: true,
            message: 'Transaction completed successfully',
            newBalance: sender.balance,
        };
    } catch (error) {
        console.error('Bank transaction error:', error);
        return {
            success: false,
            message: 'Transaction failed: ' + error.message,
        };
    }
};

module.exports = {
    processBankTransaction,
};
