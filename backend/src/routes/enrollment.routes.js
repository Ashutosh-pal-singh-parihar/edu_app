import express from 'express'
import { authMiddleware, restrictTo } from '../middleware/user.middleware.js'
import {
    enrollInCourse,
    getMyEnrollment,
    checkEnrollment,
    unEnroll
} from '../controllers/enrollment.controller.js'

const enrollmentRouter = express.Router()

enrollmentRouter.post('/:courseId', authMiddleware, restrictTo('student'), enrollInCourse)
enrollmentRouter.get('/my-courses', authMiddleware, restrictTo('student'), getMyEnrollment)
enrollmentRouter.get('/:courseId/check', authMiddleware, checkEnrollment)
enrollmentRouter.delete('/:courseId', authMiddleware, restrictTo('student'), unEnroll)

export {
    enrollmentRouter
}