import mongoose from "mongoose";

const servicesOfferedSchema = new mongoose.Schema({
    service_name:{
        type:String,
        required:true
    },
    service_image:{
        type:"String",
        default:null
    },
    type:{
        type:Number,
        description:"0 = pickup services 1 = non pickup services ",
        default:1
    },
    price:{
        type:Number,
        default:0

    },
    pricePerMile:{
        type:Number,
        default:0

    },
    status:{
        type:Number,
        default:1,
        description:"1 = active 0 = inactive",
    }

}, {timestamps:true})

const ServicesOfferedModel = mongoose.model("ServicesOffered", servicesOfferedSchema);
export default ServicesOfferedModel;

