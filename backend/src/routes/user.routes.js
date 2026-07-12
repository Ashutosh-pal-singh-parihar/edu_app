import express from "express";

import { register, login, logout, getMe } from '../controllers/user.controller.js'
import { authMiddleware } from "../middleware/user.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const userRouter = express.Router()

userRouter.post('/register', validate(registerSchema), register )
userRouter.post('/login', validate(loginSchema), login )
userRouter.get('/logout', logout )
userRouter.get('/get-me', authMiddleware, getMe )

export { userRouter }