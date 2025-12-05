const Course = require('../models/Course');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'name email');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name email');

        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = async (req, res) => {
    try {
        const { title, description, price, materials, category, duration } = req.body;

        // Instructor payment from LMS organization (simulated)
        const lmsOrg = await User.findOne({ role: 'admin' });

        if (!lmsOrg) {
            return res.status(400).json({ message: 'LMS organization not found' });
        }

        const course = await Course.create({
            title,
            description,
            price,
            instructor: req.user._id,
            materials: materials || 'Course materials will be provided after enrollment.',
            category: category || 'General',
            duration: duration || '4 weeks',
        });

        // Create transaction: LMS pays instructor for uploading course
        const instructorPayment = 500; // Fixed payment for uploading course

        const transaction = await Transaction.create({
            from: lmsOrg._id,
            to: req.user._id,
            amount: instructorPayment,
            course: course._id,
            transactionType: 'instructor_payment',
            description: `Payment for uploading course: ${course.title}`,
        });

        // Update instructor balance
        const instructor = await User.findById(req.user._id);
        instructor.balance += instructorPayment;
        await instructor.save();

        res.status(201).json({
            course,
            payment: {
                amount: instructorPayment,
                message: 'Course created! You received payment for uploading.',
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            // Check if user is the course instructor
            if (course.instructor.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this course' });
            }

            course.title = req.body.title || course.title;
            course.description = req.body.description || course.description;
            course.price = req.body.price || course.price;
            course.materials = req.body.materials || course.materials;
            course.category = req.body.category || course.category;
            course.duration = req.body.duration || course.duration;

            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            // Check if user is the course instructor
            if (course.instructor.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to delete this course' });
            }

            await course.deleteOne();
            res.json({ message: 'Course removed' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get instructor's courses
// @route   GET /api/courses/my/instructor
// @access  Private/Instructor
const getInstructorCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user._id });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getInstructorCourses,
};
