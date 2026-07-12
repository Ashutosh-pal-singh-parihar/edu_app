import express from 'express'
import { authMiddleware, restrictTo } from '../middleware/user.middleware.js'
import { approveInstructor } from '../controllers/admin.controller.js'

const adminRouter = express.Router()

adminRouter.use(authMiddleware)
adminRouter.use(restrictTo('admin'))

adminRouter.patch('/instructors/:userId/approve', approveInstructor  )

export {
    adminRouter
}