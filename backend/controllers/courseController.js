const Course = require('../models/Course');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'name email');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

const createCourse = async (req, res) => {
    try {
        const { title, description, price, materials, category, duration } = req.body;

        const course = await Course.create({
            title,
            description,
            price,
            instructor: req.user._id,
            materials: materials || 'Course materials will be provided after enrollment.',
            category: category || 'General',
            duration: duration || '4 weeks',
        });

        const lmsOrg = await User.findOne({ role: 'admin' });
        const instructorPayment = 500;

        if (lmsOrg) {
            await Transaction.create({
                from: lmsOrg._id,
                to: req.user._id,
                amount: instructorPayment,
                course: course._id,
                transactionType: 'instructor_payment',
                description: `Payment for uploading course: ${course.title}`,
            });

            const instructor = await User.findById(req.user._id);
            instructor.balance += instructorPayment;
            await instructor.save();

            return res.status(201).json({
                course,
                payment: {
                    amount: instructorPayment,
                    message: 'Course created! You received payment for uploading.',
                },
            });
        }

        res.status(201).json({
            course,
            payment: {
                amount: 0,
                message: 'Course created successfully!',
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
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

const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
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
