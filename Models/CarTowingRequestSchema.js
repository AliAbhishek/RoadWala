import mongoose from "mongoose";

const CarTowingRequestSchema = new mongoose.Schema(
  {
    pickUpLocation: {
      type: { type: String, enum: ["Point"] },
      coordinates: [Number],
    },
    dropLocation: {
      type: { type: String, enum: ["Point"] },
      coordinates: [Number],
    },

    description: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "serviceused",description:"request Id" },
    serviceUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    serviceId:{type: mongoose.Schema.Types.ObjectId, ref: "ServicesOffered"},
    distance: Number, // Distance from the service user to the pickup location
    dropOffAddress:String,  
    pickUpAddress:String,
    repair_type: String,
    scheduledDate: {
      type: String,
      default: null,
    },
    scheduledTime: {
      type: String,
      default: null,
    }
  },
  { timestamps: true }
);

const CarTowingRequest = mongoose.model(
  "CarTowingRequest",
  CarTowingRequestSchema
);

export default CarTowingRequest
