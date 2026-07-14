import cloudinary from "../config/cloudinary.config.js";

export const uploadThumbnailHandler = async (req, res, next)=>{
    try {
        if(!req.file){
            return res.status(400).json({ message : 'No file uploaded' })
        }

        if(req.course.thumbnailPublicId){
            await cloudinary.uploader.destroy(req.course.thumbnailPublicId)
        }

        req.course.thumbnailUrl = req.file.path
        req.course.thumbnailPublicId = req.file.filename
        await req.course.save()

        return res.status(200).json({
            message : 'thumbnail uploaded successfully',
            course : req.course
        })

    } catch (error) {
        return res.status(400).json({ message : 'error uploading thumbnail' })
    }
}

export const uploadLectureVideo = async (req, res, next)=>{
    try {
        if(!req.file){
            return res.status(400).json({ message : 'no file uploaded' })
        }

        const section = req.course.sections.id(req.params.sectionId)
        if(!section){
            return res.status(404).json({ message : 'section not found' })
        }

        const lecture = section.lectures.id(req.params.lectureId)
        if(!lecture){
            return res.status(404).json({ message : 'lecture not found' })
        }

        if(lecture.videoPublicId){
            await cloudinary.uploader.destroy(lecture.videoPublicId, { resource_type : 'video' } )
        }

        lecture.videoUrl = req.file.path
        lecture.videoPublicId = req.file.filename

        const result = await cloudinary.api.resource(req.file.filename, { resource_type : 'video' })
        lecture.duration = Math.round(result.duration || 0)

        await req.course.save()

        return res.status(200).json({
            message : 'video uploaded successfully',
            course : req.course
        })

    } catch (error) {
        return res.status(400).json({ message : 'error uploading video' })
    }
}

export const uploadLecturePdf = async (req, res, next)=>{
    try {
        if(!req.file){
            return res.status(400).json({ message : 'no file uploaded' })
        }

        const section = req.course.sections.id(req.params.sectionId)
        if(!section){
            return res.status(404).json({ message : 'section not found' })
        }

        const lecture = section.lectures.id(req.params.lectureId)
        if(!lecture){
            return res.status(404).json({ message : 'lecture not found' })
        }

        if(lecture.pdfPublicId){
            await cloudinary.uploader.destroy(lecture.pdfPublicId, { resource_type : 'raw' })
        }

        lecture.pdfUrl = req.file.path
        lecture.pdfPublicId = req.file.filename

        await req.course.save()

        return res.status(200).json({
            message : 'pdf uploaded successfully',
            course : req.course
        })

    } catch (error) {
        return res.status(400).json({ message : 'error uploading pdf' })
    }
}