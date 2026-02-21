const express = require('express');
const router = express.Router();
const {
    enrollInCourse,
    getMyEnrollments,
    completeCourse,
} = require('../controllers/enrollmentController');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/', protect, restrictTo('learner'), enrollInCourse);
router.get('/my', protect, restrictTo('learner'), getMyEnrollments);
router.put('/:id/complete', protect, restrictTo('learner'), completeCourse);

module.exports = router;
