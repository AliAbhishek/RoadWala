import mongoose, { model } from "mongoose"

const AdminSchema = new mongoose.Schema({
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    profile_image: {
      type: String,
    },
    phone_number:{
      type: Number,
    },
    country_code:{
      type: String,
    },
    otp: {
      type: Number,
      default: null,
    },
   
    
},{timestamps:true})


 const Admin=model("Admin",AdminSchema,"Admins")

 export default Admin