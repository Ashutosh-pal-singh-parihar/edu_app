import jwt from 'jsonwebtoken'
import { blacklistTokenModel } from '../models/blacklistToken.model.js'
import { userModel } from '../models/user.model.js'

export const authMiddleware = async (req, res, next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

    if(!token){
        return res.status(401).json({ message : "unathorized" })
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token : token })

    if(isBlacklisted){
        return res.status(401).json({ message : "unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById( decoded._id )

        if(!user){
            return res.status(401).json({ message : 'user not exist' })
        }

        if(user.status !== 'active'){
            return res.status(403).json({ message : 'account suspended or banned ' })
        }

        req.user = user
        return next()

    } catch (error) {
        return res.status(401).json({ message : 'unauthorized' })
    }

}

export const restrictTo = (...roles) => (req, res, next) =>{
    if(!roles.includes(req.user.role)){
        return res.status(403).json({ message : "you do not have permission to perform this action" })
    }
    next()
}

export const optionalAuth = async (req, res, next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

    if(!token){
        return next()
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token : token })

    if(isBlacklisted){
        return res.status(401).json({ message : 'unauthorized' })
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById( decoded._id )

        if(!user){
            return res.status(401).json({  message : 'user not exist' })
        }

        if(user.status !== 'active' ){
            return res.status(401).json({ message : 'unauthorized' })
        }

        req.user = user
        return next()

    } catch (error) {
        return next()
    }
}