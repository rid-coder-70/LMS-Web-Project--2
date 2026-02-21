const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getInstructorCourses,
} = require('../controllers/courseController');
const { protect, restrictTo } = require('../middleware/auth');

router.route('/')
    .get(getCourses)
    .post(protect, restrictTo('instructor'), createCourse);

router.get('/my/instructor', protect, restrictTo('instructor'), getInstructorCourses);

router.route('/:id')
    .get(getCourse)
    .put(protect, restrictTo('instructor'), updateCourse)
    .delete(protect, restrictTo('instructor'), deleteCourse);

module.exports = router;
