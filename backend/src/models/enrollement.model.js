import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
    lectureId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    completed : {
        type : boolean,
        default : false
    },
    watchedSeconds : {
        type : Number,
        default : 0
    },
    lastWatchedAt : Date
}, { _id : false })

const enrollmentSchema = new mongoose.Schema({
    student : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Student',
        required : true,
        index : true
    },
    course : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Course',
        required : true,
        index : true
    },
    payment : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Payment',
        default : null
    },
    progress : [lectureProgressSchema],
    progressPercent : { type : Number, default : 0 },
    completedAt : Date,
    certificateIssued :  { type : Boolean, default : false },
    certificateUrl : String,
    lastAccessedAt : Date
}, { timestamps : true })

enrollmentSchema.index({ student : 1, course : 1 }, { unique : true })

export const enrollmentModel = mongoose.model('Enrollment', enrollmentSchema)