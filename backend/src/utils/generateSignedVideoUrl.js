import cloudinary from "../config/cloudinary.config.js";

export const generateSignedVideoUrl = (publicId, expiresInseconds = 3600)=>{
    const timestamp = Math.floor(Date.now()/1000) + expiresInseconds
    return cloudinary.url(publicId, {
        resource_type: 'video',
        type: 'authenticated',
        sign_url: true,
        secure: true,
        expires_at: timestamp,
    })
}