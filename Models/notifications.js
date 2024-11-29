import mongoose from "mongoose";

const notification=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    body:{
        title:String,
    },
    title:{
        title:String
    },
    type:{
        type:Number
    }
},{timestamps:true})

const notificationModal = mongoose.model("notification",notification)

export default notificationModal