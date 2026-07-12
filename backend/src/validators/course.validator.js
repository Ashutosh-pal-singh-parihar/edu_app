import Joi from "joi";

export const createCourseSchema = Joi.object({
    title : Joi.string().min(5).max(100).required() ,
    description : Joi.string().min(5).required(),
    category : Joi.string().required(),
    level : Joi.string.valid('beginner', 'intermediate', 'advanced'),
    price : Joi.number().min(0).required()
})

export const updateCourseSchema = Joi.object({
    title: Joi.string().min(5).max(100),
    description: Joi.string().min(20),
    category: Joi.string(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
    price: Joi.number().min(0),
    thumbnailUrl: Joi.string().uri(),
}) 

export const sectionSchema = Joi.object({
    title : Joi.string().required(),
    order : Joi.number().required()
})

export const lectureSchema = Joi.object({
    title : Joi.string().required(),
    type : Joi.string().valid('video', 'text', 'pdf'),
    order : Joi.number().required(),
    isPreview : Joi.boolean()
})