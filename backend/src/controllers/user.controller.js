import { blacklistTokenModel } from "../models/blacklistToken.model.js";
import { userModel } from "../models/user.model.js";
import jwt from 'jsonwebtoken'

const generateAuthToken = (userId)=>{
    const token = jwt.sign({ _id : userId }, process.env.JWT_SECRET, {expiresIn : '2d'})
    return token 
}

export const register = async (req, res, next)=>{
    const { firstname, lastname, email, password, role } = req.body

    if(!firstname || !lastname || !email || !password){
        return res.status(400).json({ message : 'all fields are required' })
    }

    const normalizedEmail = email.trim().toLowerCase();

    const isExist = await userModel.findOne({ email : normalizedEmail })

    if(isExist){
        return res.status(400).json({ message : "user already exists" })
    }

    const safeRole = ['student', 'instructor'].includes(role) ? role : 'student' 

    const user = await userModel.create({ firstname, lastname, email : normalizedEmail, password, role : safeRole })

    const token = generateAuthToken(user._id)

    res.cookie('token', token)

    return res.status(201).json({ token, user })

}

export const login = async (req, res, next)=>{
    const { email, password } = req.body

    if(!email || !password){
        return res.status(400).json({ message : 'all fields are required' })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const user = await userModel.findOne({ email : normalizedEmail }).select('+password')

    if(!user || !(await user.comparePassword(password))){
        return res.status(401).json({ message : "Invalid credentials" })
    }

    if(user.status !== 'active'){
        return res.status(403).json({ message : 'account suspended or banned' })
    }

    const token = generateAuthToken(user._id)

    res.cookie('token', token)

    return res.status(200).json({
        token,
        user
    })

}

export const logout = async(req, res, next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

    if(!token){
        return res.status(201).json({ message : 'token not found' })
    }

    await blacklistTokenModel.create({ token })

    res.clearCookie('token')

    return res.status(200).json({ message : 'loggod out successfullt' })

}

export const getMe = async (req, res, next)=>{
    return res.status(200).json({ user : req.user })
}