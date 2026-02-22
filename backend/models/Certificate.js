const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
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
    certificateId: {
        type: String,
        unique: true,
        required: true,
    },
    issuedAt: {
        type: Date,
        default: Date.now,
    },
});

certificateSchema.pre('save', function (next) {
    if (!this.certificateId) {
        this.certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
    next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
