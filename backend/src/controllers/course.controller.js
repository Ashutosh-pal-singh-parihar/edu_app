import { courseModel } from "../models/course.model.js";
import { enrollmentModel } from "../models/enrollement.model.js";
import { generateSignedVideoUrl } from "../utils/generateSignedVideoUrl.js";

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
        .populate('instructor', 'firstname lastname bio')

        if(!course){
            return res.status(404).json({ message : 'course not found' })
        }

        const isOwner = req.user && course.instructor._id.toString() === req.user._id.toString();
        const isAdmin = req.user && req.user.role === 'admin';


        if( course.status !== 'published' && !isOwner && !isAdmin){
            return res.status(404).json({ message : 'course not found' })
        }

        let isEnrolled = false
        if(req.user && req.user.role === 'student'){
            const enrollment = await enrollmentModel.findOne({ student : req.user._id, course : course._id })
            isEnrolled = !!enrollment
        }

         const courseObj = course.toObject();
        if (!isOwner && !isAdmin && !isEnrolled) {
            courseObj.sections = courseObj.sections.map((section) => ({
            ...section,
            lectures: section.lectures.map((lecture) => ({
                ...lecture,
                videoUrl: lecture.isPreview ? lecture.videoUrl : undefined,
                pdfUrl: lecture.isPreview ? lecture.pdfUrl : undefined,
            })),
            }));
        }



        return res.status(200).json({ course : courseObj, isEnrolled })
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


export const addSection = async (req, res, next)=>{
    try {
        req.course.sections.push(req.body)
        await req.course.save()

        return res.status(201).json({
            message : 'section added successfully', 
            course : req.course 
        })
    } catch (error) {
        return res.status(400).json({ message : 'error adding section' })
    }
}

export const updateSection = async (req, res, next)=>{
    try {
        const section = req.course.sections.id(req.params.sectionId)

        if(!section){
            return res.status(404).json({ message : 'section not found' })
        }

        Object.assign(section, req.body)
        await req.course.save()

        return res.status(200).json({
            message : 'section updated successfully',
            course : req.course
        })

    } catch (error) {
        return res.status(400).json({ message : 'error updating section' })        
    }
}

export const deleteSection = async (req, res, next)=>{
    try {
        const section = req.course.sections.id(req.params.sectionId)
        
        if(!section){
            return res.status(400).json({ message : 'section not found' })
        }
        
        section.deleteOne()

        await req.course.save()

        return res.status(200).json({
            message : 'section deleted successfully',
            course : req.course
        })
    } catch (error) {
        return res.status(400).json({ message : 'error deleting section' })       
    }
}

export const addLecture = async (req, res, next)=>{
    try {
        const section = req.course.sections.id(req.params.sectionId)

        if(!section){
            return res.status(404).json({ message : 'section not found' })
        }

        section.lectures.push(req.body)

        await req.course.save()

        return res.status(201).json({
            message : 'lecture added successfully',
            course : req.course
        })
    } catch (error) {
        return res.status(400).json({ message : 'error adding lecture' })
    }
}

export const updateLecture = async (req, res, next)=>{
    try {
        const section = req.course.sections.id(req.params.sectionId)

        if(!section){
            return res.status(404).json({ message : 'section not found' })
        }

        const lecture = section.lectures.id(req.params.lectureId)
        if(!lecture){
            return res.status(404).json({ message : 'lecture not found' })
        }

        Object.assign(lecture, req.body)

        await req.course.save()

        return res.status(200).json({
            message : 'lecture updated successfully',
            course : req.course
        })

    } catch (error) {
        return res.status(400).json({ message : 'error updating lecture' })
    }
}

export const deleteLecture = async (req, res, next)=>{
    try {
        const section = req.course.sections.id(req.params.sectionId)

        if(!section){
            return res.status(404).json({ message : 'section not found' })
        }

        const lecture = section.lectures.id(req.params.lectureId)
        if(!lecture){
            return res.status(404).json({ message : 'lecture not found' })
        }

        lecture.deleteOne()

        await req.course.save()

        return res.status(200).json({
            message : 'lecture deleted successfully',
            course : req.course
        })
    } catch (error) {
        return res.status(400).json({ message : 'error deleting lecture' })
    }
}

export const getSignedVideoUrl = async (req, res, next)=>{
    try {
        const course = await courseModel.findById(req.params.courseId);
        if (!course) return res.status(404).json({ message : 'course not found' })

        const lecture = course.sections
            .flatMap((s) => s.lectures)
            .find((l) => l._id.toString() === req.params.lectureId);
        if (!lecture) return res.status(404).json({ message : 'lecture not found' })

        const isOwner = course.instructor.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!lecture.isPreview && !isOwner && !isAdmin) {
            const enrollment = await enrollmentModel.findOne({ student: req.user._id, course: course._id });
            if (!enrollment) return res.status(403).json({ message : 'You must enroll in this course to watch this lecture' })
        }

        const signedUrl = generateSignedVideoUrl(lecture.videoPublicId);

        return res.status(200).json({ url : signedUrl })
    } catch (error) {
        return res.status(400).json({ message : 'error getting signed url' })
    }
}