import mongoose from "mongoose";


const DeleteProfileSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type:Number, enum:[0,1], default:0,description:"0: User; 1: Admin" },
    reason: { type: String, default: null },
    description: { type: String, default: null },
    
}, {timestamps: true});

const DeleteProfileModel = mongoose.model("DeleteProfileModel", DeleteProfileSchema);
export default DeleteProfileModel;
