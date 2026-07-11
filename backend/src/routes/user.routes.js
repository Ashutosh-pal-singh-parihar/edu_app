import express from "express";

import { register, login, logout, getMe } from '../controllers/user.controller.js'
import { authMiddleware } from "../middleware/user.middleware.js";

const userRouter = express.Router()

userRouter.post('/register', register )
userRouter.post('/login', login )
userRouter.get('/logout', logout )
userRouter.get('/get-me', authMiddleware, getMe )

export { userRouter }