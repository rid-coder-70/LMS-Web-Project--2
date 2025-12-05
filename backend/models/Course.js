const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a course description'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a course price'],
        min: 0,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    materials: {
        type: String,
        default: 'Course materials will be provided after enrollment.',
    },
    enrollmentCount: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        default: 'General',
    },
    duration: {
        type: String,
        default: '4 weeks',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Course', courseSchema);
