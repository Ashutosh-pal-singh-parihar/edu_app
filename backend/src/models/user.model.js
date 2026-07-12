import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true 
    },
    lastname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    role : {
        type : String,
        enum : ['student', 'instructure', 'admin'],
        default : 'student'
    },
    status : {
        type : String,
        enum : ['active', 'suspended', 'banned'],
        default : 'active'
    },
    isInstructorApproved : {
        type : Boolean,
        default : false
    }
},{timestamps : true})

userSchema.pre("save",async function (next){
    if(!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model('User', userSchema)

export {
    userModel
}