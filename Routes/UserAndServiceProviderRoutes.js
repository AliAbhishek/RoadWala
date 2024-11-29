import express from "express";
import UserAndServiceProviderController from "../Controller/UserAndServiceProviderController.js";
import UserAuthentication from "../Middlewares/UserAuthentication.js";
import { upload } from "../Middlewares/multer.js";

const UserAndServiceProviderRouter = express.Router();

UserAndServiceProviderRouter.post(
  "/login",
  UserAndServiceProviderController.Login
);

UserAndServiceProviderRouter.post(
  "/verifyOtp",
  UserAndServiceProviderController.verifyOTP
);

UserAndServiceProviderRouter.post(
  "/resendOtp",
  UserAndServiceProviderController.resendOtp
);

UserAndServiceProviderRouter.use(UserAuthentication.verifyToken);

UserAndServiceProviderRouter.put(
  "/createProfile",
  UserAndServiceProviderController.createProfile
);

UserAndServiceProviderRouter.get(
  "/getProfile",
  UserAndServiceProviderController.getProfile
);

UserAndServiceProviderRouter.put(
  "/deleteProfile",
  UserAndServiceProviderController.deleteProfile
);

UserAndServiceProviderRouter.patch(
  "/logout",
  UserAndServiceProviderController.logout
);

UserAndServiceProviderRouter.get(
  "/getServicesOffered",
  UserAndServiceProviderController.getServicesOffered
);

UserAndServiceProviderRouter.post(
  "/createServicesOffered",
  UserAndServiceProviderController.createServicesOffered
);

UserAndServiceProviderRouter.post(
  "/AddServiceImages",
  upload.fields([{ name: "images", maxCount: 3 }]),
  UserAndServiceProviderController.AddServiceImages
);

UserAndServiceProviderRouter.put(
  "/DeleteService",

  UserAndServiceProviderController.DeleteService
);

UserAndServiceProviderRouter.put(
  "/createProfileBasicDeatsils",

  upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "companyPicture", maxCount: 1 }]),
  UserAndServiceProviderController.createProfileBasicDeatsils
);

// ================================================Home Flow=====================================================

UserAndServiceProviderRouter.put(
  "/updateCurrentLocation",

  UserAndServiceProviderController.updateCurrentLocation
);

UserAndServiceProviderRouter.post(
  "/carTowingBooking",

  UserAndServiceProviderController.carTowingBooking
);

UserAndServiceProviderRouter.get(
  "/getCarTowingRequests",

  UserAndServiceProviderController.getCarTowingRequests
);

UserAndServiceProviderRouter.put(
  "/updateCarTowingBooking",

  UserAndServiceProviderController.updateCarTowingBooking
);

UserAndServiceProviderRouter.get(
  "/getBookingRequestInfo",

  UserAndServiceProviderController.getBookingRequestInfo
);

UserAndServiceProviderRouter.post(
  "/createPaymentIntent",

  UserAndServiceProviderController.createPaymentIntent
);

UserAndServiceProviderRouter.put(
  "/paymentDoneforBooking",

  UserAndServiceProviderController.paymentDoneforBooking
);

UserAndServiceProviderRouter.get(
  "/requestListBasedOnStatus",

  UserAndServiceProviderController.requestListBasedOnStatus
);

UserAndServiceProviderRouter.post(
  "/contactUs",

  UserAndServiceProviderController.contactUs
);

UserAndServiceProviderRouter.get(
  "/getNotification",

  UserAndServiceProviderController.getNotification
);

export default UserAndServiceProviderRouter;
