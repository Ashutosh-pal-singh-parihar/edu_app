import { number } from "joi";
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
        .populate('instructor', 'name')
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