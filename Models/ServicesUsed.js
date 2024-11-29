import mongoose, { Schema } from "mongoose";

const ServicesUsedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      description: "Requested user Id",
      default: null,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicesOffered",
      description: "ServiceId",
      default: null,
    },
    pickUpLocation: {
      type: {
        type: String,
        enum: ["Point", "Coordinates"],
        default: "Point",
      },
      coordinates: { type: [Number], default: [0.0, 0.0] },
    },
    dropLocation: {
      type: {
        type: String,
        enum: ["Point", "Coordinates"],
        default: "Point",
      },
      coordinates: { type: [Number], default: [0.0, 0.0] },
    },
    dropOffAddress: String,
    distance: Number,
    expectedTime: Number,
    pickUpAddress: String,
    description: {
      type: String,
      default: null,
    },
    isAccepted: {
      type: Number,
      description: "1=accepted 0=not-accepted",
      default: 0,
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      description: "Service Provide Id",
      default: null,
    },
    isReached: {
      type: Number,
      description: "1=reached 0=not-reached",
      default: 0,
    },
    isComplete: {
      type: Number,
      description: "1=completed 0=not-completed",
      default: 0,
    },
    cancelReason: {
      type: String,
      default: null,
    },
    cancelDescription: {
      type: String,
      default: null,
    },
    cancelledBy: {
      type: Number,
      default: null,
      description: "0=user,1=service provider",
    },
    extraAmmount: {
      type: Number,
      default: 0,
    },
    extraAmmountDescription: {
      type: String,
      default: null,
    },
    isExtraAmmountRequestAccepted: {
      type: Number,
      default: 0,
      description: "1=accepted 0=decline",
    },
    platformFees: {
      type: Number,
      default: 0,
    },
    taxes: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      default: 0,
    },
    tip: {
      type: Number,
      default: 0,
    },
    paymentIntent: {
      type: String,
      default: null,
    },
    isPaymentDone: {
      type: Number,
      default: 0,
      description: "1 = done, 0 = notdone",
    },
    isPaymentReceived: {
      type: Number,
      default: 0,
      description: "1 = done, 0 = notdone",
    },
    quantity: {
      type: Number,
      default: 0,
    },
    repair_type: {
      type: String,
      default: null,
    },
    scheduledDate: {
      type: String,
      default: null,
    },
    scheduledTime: {
      type: String,
      default: null,
    },
    bookingId:{
      type:String,
      default:null
    },
    sixHourReminder:{
      type:Boolean,
      default:false
    },
    fourHourReminder:{
      type:Boolean,
      default:false
    },
    oneHourReminder:{
      type:Boolean,
      default:false
    },
    pickUpAndDropOffDistance:{
      type:Number,
      default:0
    },
    priceAccordingToDistance:{
      type:Number,
      default:0
    }

  },
  { timestamps: true }
);

const ServiceUsedModal = mongoose.model("serviceused", ServicesUsedSchema);

export default ServiceUsedModal;
