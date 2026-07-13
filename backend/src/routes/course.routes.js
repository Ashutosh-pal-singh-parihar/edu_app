import express from 'express'

import { validate } from '../middleware/validate.middleware.js'
import { authMiddleware, restrictTo } from '../middleware/user.middleware.js'
import { checkCourseOwnership } from '../middleware/courseOwnership.middleware.js'
import { createCourseSchema, updateCourseSchema, sectionSchema, lectureSchema } from '../validators/course.validator.js'
import { getAllCourses, getCourseById } from '../controllers/course.controller.js'

const courseRouter = express.Router()

courseRouter.get('/', getAllCourses)
courseRouter.get('/:courseId', getCourseById)



export {
    courseRouter
}