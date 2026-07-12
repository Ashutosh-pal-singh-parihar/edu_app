import { courseModel } from "../models/course.model";

export const checkCourseOwnership = async (req, res, next)=>{
    try {
        const course = await courseModel.findById(req.params.courseId)
        if (!course ){
            return res.status(404).json({message : "course not found"})
        }

        if ( course.instructor.toString() !== req.user._id.toString() ){
            return res.status(403).json({ message : "you do not own this course" })
        }

        req.course = course
        next()

    } catch (error) {
        throw new Error(error)  
    } 
}