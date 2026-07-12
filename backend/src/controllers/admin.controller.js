import { userModel } from "../models/user.model.js"

export const approveInstructor = async (req, res, next)=>{
    try {
        const user = await userModel.findById(req.params.userId)
        if(!user || user.role !== 'instructor'){
            return res.status(404).json({ message : 'instructor not exist' })
        }

        if(user.isInstructorApproved === true){
            return res.status(400).json({ message : 'instructor already approved' })
        }

        user.isInstructorApproved = true
        await user.save()

        return res.status(200).json({ message : 'instructor approved', user })
    } catch (error) {
        return res.status(500).json({ message : 'error approving instructor' })
    }
}