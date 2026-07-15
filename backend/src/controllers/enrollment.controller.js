import { courseModel } from "../models/course.model.js";
import { enrollmentModel } from "../models/enrollement.model.js";

export const enrollInCourse = async (req, res, next)=>{
    try {
        const course = await courseModel.findById(req.params.courseId)
        if(!course || course.status !== 'published'){
            return res.status(404).json({ message : 'course not found' })
        }

        const existing = await enrollmentModel.findOne({ student = req.user._id, course : course ._id })
        
        if(existing){
            return res.status(400).json({ message : 'you are already enrolled in this course' })
        }

        const enrollment = await enrollmentModel.create({
            student : req.user._id,
            course : course._id,
            payment : null
        })
        
        await courseModel.findByIdAndUpdate(course._id, { $inc : { enrollmentCount : 1 } })

        return res.status(200).json({ message : "enrolled successfully", enrollment })

    } catch (error) {
        return res.status(400).json({ message : 'error during enrolling in a course' })
    }
}

export const getMyEnrollment = async (req, res, next)=>{
    try {
        const enrollments = await enrollmentModel.find({ student : req.user._id })
        .populate('course', 'title thumbnailUrl instructor ratingAvg')
        .sort('-createdAt')

        return res.status(200).json({ message : 'enrollements fetched successfully', enrollments })
    } catch (error) {
        return res.status(400).json({ message : 'error fetching enrollments' })
    }
}

export const checkEnrollment = async (req, res, next)=>{
    try {
        const enrollment = await enrollmentModel.findOne({ student : req.user._id, course : req.params.courseId })

        return res.status(200).json({ isEnrolled : !!enrollment })
    } catch (error) {
        return res.status(400).json({ message : 'error checking enrollment' })
    }
}

export const unEnroll = async (req, res, next)=>{
    try {
        const enrollment = await enrollmentModel.findOneAndDelete({ student : req.user._id, course : req.params.courseId  })

        if(!enrollment){
            return res.status(404).json({ message : 'enrollmrnt not found' })
        }

        await courseModel.findByIdAndUpdate(req.params.courseId, { $inc : { enrollmentCount : -1 } })
        return res.status(200).json({ message : 'unenrolled successfully' })

    } catch (error) {
        return res.status(400).json({ message : 'error unenrolling ' })
    }
}