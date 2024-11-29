import mongoose from "mongoose";


const contactSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    name:{
        type:String,
        default:null
    },
    email:{
        type:String,
        default:null
    },
    subject:{
        type:String,
        default:null
    },
    message:{
        type:String,
        default:null
    }
})

const contactModel=mongoose.model("contact",contactSchema)

export default contactModel