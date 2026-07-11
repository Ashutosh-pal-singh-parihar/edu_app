import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema({
    token : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now,
        expires : 172800
    }
})

const blacklistTokenModel = mongoose.model('BlacklistToken', blacklistTokenSchema)

export {
    blacklistTokenModel
}