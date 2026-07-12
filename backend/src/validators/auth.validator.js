import joi from 'joi'

export const registerSchema = joi.object({
    firstname : joi.string().min(2).max(50).required(),
    lastname : joi.string().min(2).max(50).required(),
    email : joi.string().email().required(),
    password : joi.string().min(6).required(),
    role : joi.string().valid('student','instructor').optional(),

})

export const loginSchema = joi.object({
    email : joi.string().email().required(),
    password : joi.string().required(),
})