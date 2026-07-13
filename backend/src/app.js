import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cookieParser from 'cookie-parser'

import { userRouter } from './routes/user.routes.js'
import { adminRouter } from './routes/admin.routes.js'
import { courseRouter } from './routes/course.routes.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/users', userRouter)
app.use('/api/admins', adminRouter)
app.use('/api/courses', courseRouter)

export {
    app
}