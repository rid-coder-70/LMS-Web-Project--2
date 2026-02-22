const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Transaction = require('../models/Transaction');
const Certificate = require('../models/Certificate');
const { processBankTransaction } = require('../utils/bankSimulator');

const enrollInCourse = async (req, res) => {
    try {
        const { courseId, secretNumber } = req.body;

        const course = await Course.findById(courseId).populate('instructor');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const existingEnrollment = await Enrollment.findOne({
            learner: req.user._id,
            course: courseId,
        });

        if (existingEnrollment) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        const bankResult = await processBankTransaction(
            req.user._id,
            course.instructor._id,
            course.price,
            secretNumber
        );

        if (!bankResult.success) {
            return res.status(400).json({ message: bankResult.message });
        }
t
        const enrollment = await Enrollment.create({
            learner: req.user._id,
            course: courseId,
        });

        await Transaction.create({
            from: req.user._id,
            to: course.instructor._id,
            amount: course.price,
            course: courseId,
            transactionType: 'payment',
            description: `Enrollment payment for course: ${course.title}`,
        });

        course.enrollmentCount += 1;
        await course.save();

        res.status(201).json({
            enrollment,
            message: 'Successfully enrolled in the course',
            newBalance: bankResult.newBalance,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ learner: req.user._id })
            .populate('course')
            .populate({
                path: 'course',
                populate: {
                    path: 'instructor',
                    select: 'name email',
                },
            });

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const completeCourse = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id).populate('course');

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        if (enrollment.learner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (enrollment.completionStatus === 'completed') {
            return res.status(400).json({ message: 'Course already completed' });
        }

        enrollment.completionStatus = 'completed';
        enrollment.completedAt = Date.now();
        enrollment.certificateIssued = true;
        await enrollment.save();

        const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const certificate = await Certificate.create({
            learner: req.user._id,
            course: enrollment.course._id,
            certificateId: certificateId
        });

        res.json({
            enrollment,
            certificate,
            message: 'Congratulations! Course completed and certificate issued.',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    enrollInCourse,
    getMyEnrollments,
    completeCourse,
};
