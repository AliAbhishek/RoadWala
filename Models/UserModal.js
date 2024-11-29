import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: Number,
      default: 0,
      description: "0=>user,1=>service provider",
    },
    isGuest:{
      type:Boolean,
      default:false
    },
    name: { type: String, default: null },
    email: { type: String, default: null },
    phoneotp: { type: Number, default: null },
    countryCode: { type: String, default:null },
    phoneNumber: { type: Number, default:null },
    tempCountryCode: { type: String, default: null },
    tempPhoneNumber: { type: Number, default: null },
    profileImage: { type: String, default: null },
    address:{type:String,default:null},
    availiability:{type:Number,default:0,description:"0=>not available,1=available"},
    location: {
      type: {
        type: String,
        enum: ["Point", "Coordinates"],
        default: "Point",
      },
      coordinates: { type: [Number], default: [0.0, 0.0] },
    },
    servicesOffered: {
      type: [
        {
          serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ServicesOffered",
          },
          imagesArray: [String],
        },
      ],
      default: [],
    },
    availableParts: {
      type: [{ partName: String, price: Number }],
      default: [],
    },
    vehicleRegistrationNumber: { type: String, default: null },
    device_type: {
      type: Number,
      default: 3,
      description: "0:Web; 1:Android; 2:iOS; 3:default",
    },
    device_token: { type: String, default: null },
    device_model: {
      type: String,
      default: null,
      description: "OS-browser name for web; DEVICE-model for mobile apps",
    },
    isProfileCompleted: {
      type: Number,
      default: 0,
      enum: [0, 1],
      description: "0=>incomplete,1=>complete",
    },
    isOnline: { type: Boolean, default: false },
    isPhoneVerified: {
      type: Number,
      default: 0,
      description: "0=>unverified,1=>verified",
    },
    isActive: {
      type: Number,
      default: 1,
      enum: [0, 1],
      description: " 0: Inactive; 1: Active",
    },
    isDeleted: {
      type: Number,
      default: 0,
      enum: [0, 1],
      description: " 0: not Deleted; 1: Deleted",
    },
    isAdminDeleted: {
      type: Number,
      default: 0,
      enum: [0, 1],
      description: " 0: not Deleted; 1: Deleted",
    },
    isAdminVerified: {
      type: Number,
      default: 0,
      enum: [0, 1],
      description: " 0: not Verified; 1: Verified",
    },
    companyPicture:{
      type:String,
      default:null
    },
    companyName:{
      type:String,
      default:null
    },
    companyEmail:{
      type:String,
      default:null
    },
    companyCountryCode:{
      type:String,
      default:null
    },
    companyNumber:{
      type:Number,
      default:null
    },
    primaryOwner:{
      type:String,
      default:null
    },
    contact:{
      type:String,
      default:null
    },
    bussinessAddress:{
      type:String,
      default:null
    },
    streetAddress:{
      type:String,
      default:null
    },
    country:{
      type:String,
      default:null
    },
    state:{
      type:String,
      default:null
    },
    city:{
      type:String,
      default:null
    },
    zipcode:{
      type:Number,
      default:null
    },

  },
  { timestamps: true }
);

const   UserModel = mongoose.model("User", UserSchema);
export default UserModel;
