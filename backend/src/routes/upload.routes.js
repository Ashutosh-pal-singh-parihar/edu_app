import express from 'express'
import { authMiddleware, restrictTo } from '../middleware/user.middleware.js'
import { checkCourseOwnership } from '../middleware/courseOwnership.middleware.js'
import { uploadThumbnail, uploadVideo, uploadPdf } from '../config/multerCloudinary.config.js'
import { uploadThumbnailHandler, uploadLectureVideo, uploadLecturePdf } from '../controllers/upload.controller.js'

const uploadRouter = express.Router()

uploadRouter.patch('/:courseId/thumbnail', authMiddleware, restrictTo('instructor'), checkCourseOwnership, uploadThumbnail.single('thumbnail'), uploadThumbnailHandler)
uploadRouter.patch('/:courseId/sections/:sectionId/lectures/:lectureId/video', authMiddleware, restrictTo('instructor'), checkCourseOwnership, uploadVideo.single('video'), uploadLectureVideo)
uploadRouter.patch('/:courseId/sections/:sectionId/lectures/:lectureId/pdf', authMiddleware, restrictTo('instructor'), checkCourseOwnership, uploadPdf.single('pdf'), uploadLecturePdf)

export {
    uploadRouter
}