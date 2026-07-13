import { courseModel } from "../models/course.model.js";

export const getAllCourses = async (req, res, next)=>{
    const { search, category, level, minPrice, maxPrice, page = 1, limit=12 } = req.query

    const filter = { status : 'published' };
    if (search) filter.$text = { $search : search }
    if(category) filter.category = category
    if(level) filter.level = level 
    if(minPrice || maxPrice) {
        filter.price = {}
        if(minPrice) filter.price.$gte = Number(minPrice)
        if(maxPrice) filter.price.$lte = Number(maxPrice)
    }

    try {
        const courses = await courseModel.find(filter)
        .populate('instructor', 'firstname lastname')
        .select('-sections')
        .skip((page - 1 ) * limit)
        .limit(Number(limit))
        .sort('-createdAt')

        const total = await courseModel.countDocuments(filter)

        return res.status(200).json({
            courses,
            total,
            page : Number(page),
            pages : Math.ceil(total/limit)
        })
    } catch (error) {
        return res.status(400).json({ message : 'error fetching courses' })
    }

}

export const getCourseById = async (req, res, next)=>{
    try {
        const course = await courseModel.findById(req.params.courseId)
        .populate('instructor', 'name bio')

        if(!course){
            return res.status(404).json({ message : 'course not found' })
        }

        if( course.status !== 'published'){
            return res.status(404).json({ message : 'course not found' })
        }

        return res.status(200).json({ course })
    } catch (error) {
        return res.status(400).json({ message : 'error fetching course' })
    }
}

export const createCourse = async (req, res, next)=>{
    if(!req.user.isInstructorApproved){
        return res.status(400).json({ message : "your instructor account is pending admin approval" })
    }

    try {
        const course = await courseModel.create({...req.body, instructor: req.user._id})

        return res.status(200).json({
            course
        })
    } catch (error) {
        return res.status(400).json({ message : 'error creating course' })
    }
}

export const getMyCourses = async (req, res, next)=>{
    try {
        const courses = await courseModel.find({ instructor : req.user._id }).sort('-createdAt')

        return res.status(200).json({ courses })

    } catch (error) {
        return res.status(400).json({ message : 'error fectching courses' })
    }
}

export const updateCourse = async (req, res, next)=>{
    try {
        Object.assign(req.course, req.body)
        await req.course.save()
        return res.status(200).json({
            course : req.course
        })
    } catch (error) {
        
    }
}

export const deleteCourse = async (req, res, next)=>{
    if(req.course.enrollmentCount > 0){
        return res.status(400).json({ message : 'cannot delete course with active enrollements' })
    }

    try {
        await req.course.deleteOne()
        return res.status(200).json({ message : 'course deleted successfully' })
    } catch (error) {
        return res.status(200).json({ message : 'error deleting course' })
    }
}

export const submitForReview = async (req, res, next)=>{
    if(req.course.totalLectures === 0){
        return res.status(400).json({ message : 'add at least one lecture before submitting for review' })
    }

    try {
        req.course.status = 'pending_review'
        await req.course.save()

        return res.status(200).json({ course : req.course })
    } catch (error) {
        return res.status(400).json({ message : 'error while submitting course for review' })
    }
}

export const publishCourse = async (req, res, next)=>{
    try {
        req.course.status = 'published'
        await req.course.save()

        return res.status(200).json({ course : req.course })
    } catch (error) {
        return res.status(400).json({ message : 'error while publishing course' })
    }

}