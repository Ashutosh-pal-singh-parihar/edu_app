import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from './cloudinary.config.js'

const thumbnailStorage = new CloudinaryStorage({
    cloudinary,
    params : {
        folder : 'lms/thumbnails',
        resource_type : 'image',
        allowed_formats : ['jpg', 'jpeg', 'png', 'webp'],
        transformation : [{ width : 1280, height : 720, crop : 'fill' }]
    }
})

const videoStorage = new CloudinaryStorage({
    cloudinary,
    params : {
        folder : 'lms/videos',
        resource_type : 'video',
        type : 'authenticated',
        allowed_formats : ['mp4', 'mov', 'webm']
    }
})

const pdfStorage = new CloudinaryStorage({
    cloudinary,
    params : {
        folder : 'lms/pdfs',
        resource_type : 'raw',
        allowed_formats : ['pdf']
    }
})

export const uploadThumbnail = multer({
    storage : thumbnailStorage,
    limits : { fileSize : 5*1024*1024 }
})

export const uploadVideo = multer({
    storage : videoStorage,
    limits : { fileSize : 500*1024*1024 }
})

export const uploadPdf = multer({
    storage : pdfStorage,
    limits : { fileSize : 20*1024*1024 }
})