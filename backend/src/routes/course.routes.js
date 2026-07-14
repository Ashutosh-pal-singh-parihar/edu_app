import express from 'express'

import { validate } from '../middleware/validate.middleware.js'
import { authMiddleware, restrictTo } from '../middleware/user.middleware.js'
import { checkCourseOwnership } from '../middleware/courseOwnership.middleware.js'
import { createCourseSchema, updateCourseSchema, sectionSchema, lectureSchema } from '../validators/course.validator.js'
import { 
    getAllCourses,
    getCourseById,
    createCourse,
    getMyCourses,
    updateCourse,
    deleteCourse,
    submitForReview,
    publishCourse,
    addSection,
    updateSection,
    deleteSection,
    addLecture,
    updateLecture,
    deleteLecture
} from '../controllers/course.controller.js'

const courseRouter = express.Router()

courseRouter.get('/', getAllCourses)
courseRouter.get('/my/courses', authMiddleware, restrictTo('instructor'), getMyCourses)

courseRouter.get('/:courseId', getCourseById)
courseRouter.post('/', authMiddleware, restrictTo('instructor'), validate(createCourseSchema), createCourse)
courseRouter.patch('/:courseId', authMiddleware, restrictTo('instructor', 'admin'), checkCourseOwnership, validate(updateCourseSchema), updateCourse)
courseRouter.delete('/:courseId', authMiddleware, restrictTo('instructor', 'admin'), checkCourseOwnership, deleteCourse)
courseRouter.patch('/:courseId/submit', authMiddleware, restrictTo('instructor'), checkCourseOwnership, submitForReview)
courseRouter.patch('/:courseId/publish', authMiddleware, restrictTo('admin'), checkCourseOwnership, publishCourse)

courseRouter.post('/:courseId/sections', authMiddleware, restrictTo('instructor'), validate(sectionSchema), checkCourseOwnership, addSection)
courseRouter.patch('/:courseId/sections/:sectionId', authMiddleware, restrictTo('instructor'), checkCourseOwnership, updateSection)
courseRouter.delete('/:courseId/sections/:sectionId', authMiddleware, restrictTo('instructor'), checkCourseOwnership, deleteSection)


export {
    courseRouter
}