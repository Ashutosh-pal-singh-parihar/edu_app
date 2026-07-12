import { text } from "express";
import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    type : {
        type : String,
        enum : ["video", "text", "pdf"],
        default : "video"
    },
    videoUrl : {
        type : String
    },
    videoPublicId : {
        type : String
    },
    pdfUrl : {
        type : String
    },
    duration : {
        type : Number,
        default : 0
    },
    isPreview : {
        type : Boolean,
        default : false
    },
    order : {
        type : Number,
        required : true
    }
},{ timestamps : true })

const sectionSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    order : {
        type : String,
        required : true
    },
    lectures : {lectureSchema}
})

const courseSchema = new mongoose.Schema({
    title : { type : String, required : true, trim : true },
    slug : {type : String, unique : true, index : true},
    description : { type : String, required : true },
    category : { type : String, required : true, index : true },
    level : {
        type : String,
        enum : ["beginner", "intermediate", "advanced"],
        default : "beginner"
    },
    price : { type : Number, required : true, default : 0, min : 0 },
    thumbnailUrl : { type : String },
    instructor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
        index : true
    },
    sections : {sectionSchema},
    status : {
        type : String,
        enum : ["draft", "pending_review", "published", "rejected"],
        default : "draft"
    },
    ratingAvg : { type : Number, default : 0, min : 0, max : 5 },
    ratingCount : { type : Number, default : 0 },
    enrollmentCount : { type : Number, default : 0 }
},{ timestamps : true })

courseSchema.virtual('totalLectures').get( function () {
    return this.sections.reduce(
        (sum, s)=> sum + s.lectures.length, 0
    )
})

courseSchema.set('toJSON', { virtuals : true} )
courseSchema.index({ title : 'text', description : "text" })

courseSchema.pre('save', function(next){
    if(this.isModified('title')){
        this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    }
} )

export const courseModel = mongoose.model("Course", courseSchema)