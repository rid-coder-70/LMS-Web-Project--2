const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    learner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    enrolledAt: {
        type: Date,
        default: Date.now,
    },
    completionStatus: {
        type: String,
        enum: ['enrolled', 'in-progress', 'completed'],
        default: 'enrolled',
    },
    certificateIssued: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Date,
        default: null,
    },
});

// Prevent duplicate enrollments
enrollmentSchema.index({ learner: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
