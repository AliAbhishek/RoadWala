import GenerateToken from "../helpers/GenerateToken.js";
import Response from "../helpers/Response.js";
import DeleteProfileModel from "../Models/DeleteProfileModal.js";
import ServicesOfferedModel from "../Models/servicesOfferedModal.js";
import UserModel from "../Models/UserModal.js";
import path from "path"; // Add this line to import the path module
import fs from "fs";
import helperFunction from "../utils/helerFunctions.js";
import ServiceUsedModal from "../Models/ServicesUsed.js";
import CarTowingRequest from "../Models/CarTowingRequestSchema.js";
import stripePackage from "stripe";
import Stripe from "stripe";
import dotenv from "dotenv";
import notificationServices from "../utils/notificationService.js";
import sendGrid from "../utils/sendGrid.js";
import contactUsTemplate from "../helpers/ContactUsTempelate.js";
import contactModel from "../Models/contact.js";
import notificationModal from "../Models/notifications.js";


dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const publishKey = process.env.PUBLISHABLE_KEY;

const UserAndServiceProvider = {
  // MOBILE NUMBER LOGIN
  Login: async (req, res) => {
    try {
      // console.log(req.body, "req");
      const {
        role,
        countryCode,
        phoneNumber,
        device_token,
        device_type,
        device_model,
        isGuest,
      } = req.body;

      if (isGuest) {
        let user = await UserModel.create({
          isGuest,
        });

        const token = await GenerateToken.generateToken(user._id);
        let data = { user, token };

        return Response.success(res, 200, "Guest created successfully", data);
      }

      if (!countryCode || !phoneNumber) {
        console.log(role, countryCode, phoneNumber);
        return Response.error(
          res,
          400,
          "Country code, phone number are required"
        );
      }

      const phoneotp = Math.floor(1000 + Math.random() * 9000);

      // Check if user already exists
      let user = await UserModel.findOne({ countryCode, phoneNumber });

      if (!user) {
        // Create new user if not found
        user = await UserModel.create({
          countryCode,
          phoneNumber,
          phoneotp,
          role,
          device_token,
          device_type,
          device_model,
        });
        return Response.success(
          res,
          200,
          "OTP sent to your phone number",
          user
        );
      }

      if (user.role != role) {
        return Response.error(
          res,
          400,
          `User already registered as ${user.role === 0 ? "User" : "Service Provider"
          }. Please login with other number`
        );
      }

      // Check user status
      if (!user.isActive) {
        return Response.error(res, 400, "Admin has suspended your account");
      }

      if (user.isAdminDeleted) {
        return Response.error(
          res,
          400,
          "Your account deleted by admin. Please contact support"
        );
      }
      if (user.isDeleted) {
        await UserModel.findByIdAndUpdate(user?._id, {
          $set: {
            isDeleted: 0,
          },
        });



        // return Response.error(res, 400, "User Not Found");
      }

      // Update existing user
      user.phoneotp = phoneotp;
      user.role = role;
      user.device_token = device_token;
      user.device_type = device_type;
      user.device_model = device_model;
      await user.save();

      return Response.success(res, 200, "OTP sent to your phone number", user);
    } catch (error) {
      console.error("Login error:", error);
      return Response.error(res, 500, "Internal Server Error", error.message);
    }
  },
  //   OTP VERIFICATION
  verifyOTP: async (req, res) => {
    try {
      const { type, userId, otp } = req.body;
      const user = await UserModel.findById(userId);

      if (!user) return Response.error(res, 400, "User not found");

      if (type == 1) {
        if (otp == user.phoneotp) {
          let updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
              $set: {
                countryCode: user.tempCountryCode,
                phoneNumber: user.tempPhoneNumber,
                tempCountryCode: null,
                tempPhoneNumber: null,
                isPhoneVerified: 1,
              },
            },
            { new: true }
          );
          return Response.success(
            res,
            200,
            "OTP verified successfully",
            updatedUser
          );
        } else {
          return Response.error(res, 400, "OTP is incorrect");
        }
      }

      if (otp == user.phoneotp) {
        const token = await GenerateToken.generateToken(user._id);
        user.isPhoneVerified = 1;
        await user.save();
        return Response.success(res, 200, "OTP verified successfully", {
          user,
          token,
        });
      } else return Response.error(res, 400, "OTP is incorrect");
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  //   resend OTP
  resendOtp: async (req, res) => {
    try {
      const { userId } = req.body;
      console.log(userId, "userId");
      if (userId) {
        let userData = await UserModel.findById(userId);
        if (!userData) {
          return errorRes(res, 400, "User did not exist");
        }
        // create new otp
        const otp = Math.floor(1000 + Math.random() * 9000);
        userData.phoneotp = otp;
        let updateduser = await userData.save();
        console.log(updateduser, "updateduser");

        // sendemail

        // sendEmail({
        //   otp,
        //   email: email ? email : updateduser.email,
        //   project_name: process.env.PROJECT_NAME,
        //   type: "resendOTP",
        //   user: updateduser,
        // });
        let token = await GenerateToken.generateToken(userData?._id);

        let data = {
          updateduser,
          token,
        };

        return Response.success(
          res,
          200,
          "OTP has been resent to your phone number",
          data
        );
      } else {
        return Response.error(res, 400, "Please provide user Id");
      }
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  //   create profile
  createProfile: async (req, res) => {
    try {
      const {
        countryCode,
        phoneNumber,
        isProfileCompleted,
        availableParts,
        servicesOffered,
      } = req.body;
   

      const userId = req.userId;
      const userFromDb = await UserModel.findById(userId);

      if (countryCode && phoneNumber) {
        const phoneotp = Math.floor(1000 + Math.random() * 9000);

        userFromDb.tempCountryCode = countryCode;
        userFromDb.tempPhoneNumber = phoneNumber;
        userFromDb.phoneotp = phoneotp;
        console.log(userFromDb, "userFromDb");
        await userFromDb.save();

        return Response.success(
          res,
          200,
          "OTP sent to your phone number",
          userFromDb
        );
      }

      let formattedServicesOffered;

      if (servicesOffered) {
        const userData = await UserModel.findById(userId);
        const existingServices = userData.servicesOffered || [];

        // Create a map for existing services to handle duplicates
        const servicesMap = new Map(
          existingServices.map((service) => [service.serviceId, service])
        );

        // Iterate over the incoming servicesOffered
        for (const newService of servicesOffered) {
          // Check if the service already exists
          if (servicesMap.has(newService.serviceId)) {
            // Update the existing service's imagesArray
            servicesMap.get(newService.serviceId).imagesArray =
              newService.imagesArray;
          } else {
            // Add the new service if it doesn't exist
            servicesMap.set(newService.serviceId, newService);
          }
        }

        // Convert the map back to an array
        formattedServicesOffered = Array.from(servicesMap.values());
      }

      console.log(formattedServicesOffered, "formattedServicesOffered");

      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            servicesOffered: formattedServicesOffered,
            isProfileCompleted,
            availableParts,
          },
        },
        { new: true }
      );

      return Response.success(
        res,
        200,
        `Profile ${userFromDb?.isProfileCompleted == 0 ? "created" : "updated"
        } successfully`,
        user
      );
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  // create Profile Basic Details
  createProfileBasicDeatsils: async (req, res) => {
    try {
      const {
        name,
        email,
        lat,
        lng,
        address,
        isProfileCompleted,
        availiability,
        companyName,
        companyEmail,
        companyCountryCode,
        companyNumber,
        primaryOwner,
        contact,
        bussinessAddress,
        streetAddress,
        country,
        state,
        city,
        zipcode,
      } = req.body;

      const userId = req.userId;
      const userFromDb = await UserModel.findById(userId);
      let image;
      let companyimage;

      console.log(req.files, "req.files");

      if (req?.files) {
        console.log(req.files, "fillleeeeeee");
        if (req?.files?.profileImage) {
          image = `public/${req?.files?.profileImage[0]?.filename}`;
        }
        if (req?.files?.companyPicture) {
          companyimage = `public/${req?.files?.companyPicture[0]?.filename}`;
        }
      }

      let locationCoordinates;

      if (lat && lng) {
        locationCoordinates = {
          type: "Point",
          coordinates: [lng, lat],
        };
      }

      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            name,
            email,
            profileImage: image,
            location: locationCoordinates,
            address,
            isProfileCompleted,
            availiability,
            companyName,
            companyEmail,
            companyCountryCode,
            companyNumber,
            primaryOwner,
            contact,
            bussinessAddress,
            streetAddress,
            country,
            state,
            city,
            zipcode,
            companyPicture: companyimage,
          },
        },
        { new: true }
      );

      return Response.success(
        res,
        200,
        `Profile ${userFromDb?.isProfileCompleted == 1 ? "updated" : "added"
        }  successfully`,
        user
      );
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  // add images
  AddServiceImages: async (req, res) => {
    try {
      console.log(req.body, "body");
      let images = []; // Initialize an array to store uploaded image paths
      let { vehicleRegistrationNumber } = req.body;
      console.log(vehicleRegistrationNumber, "vehicleRegistrationNumber");
      // console.log(req, "req");

      // Check if images were uploaded
      if (req.files && req.files.images) {
        // console.log(req.files);

        // Map over the uploaded files to extract their paths
        images = req.files.images.map((file) => {
          return `public/${file.filename}`; // Construct the path for each uploaded image
        });
      } else {
        console.log("No images found in the request"); // Warn if no images were found
      }

      if (vehicleRegistrationNumber) {
        const userId = req.userId;
        const user = await UserModel.findByIdAndUpdate(
          userId,
          {
            $set: {
              vehicleRegistrationNumber: vehicleRegistrationNumber,

              // towingImages
            },
          },
          { new: true }
        );
      }

      console.log({ images }, "response");

      // Return a successful response with the uploaded images
      return Response.success(res, 200, "Images uploaded successfully", images);
    } catch (error) {
      console.error(`Error in AddServiceImages: ${error.message}`); // Log the error for debugging
      return Response.error(res, 500, error.message);
    }
  },
  // delete service
  DeleteService: async (req, res) => {
    try {
      const { ServiceId } = req.body;

      if (!ServiceId) {
        return Response.error(res, 400, "Please provide a service ID");
      }

      const data = await UserModel.updateOne(
        { "servicesOffered.serviceId": ServiceId }, // Query to match the document
        {
          $pull: {
            servicesOffered: { serviceId: ServiceId },
          },
        }
      );

      if (data.modifiedCount === 0) {
        return Response.error(res, 404, "Service not found or already deleted");
      }

      return Response.success(res, 200, "Service deleted successfully", data);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  // logout user
  logout: async (req, res) => {
    try {
      const userId = req.userId;
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $set: { device_token: null } },
        { new: true }
      );
      return Response.success(res, 200, "User logout Successfully", user);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  // get user profile
  getUserProfile: async (req, res) => {
    try {
      const userId = req.userId;
      const user = await UserModel.findById(userId);
      return Response.success(
        res,
        200,
        "User profile fetched successfully",
        user
      );
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  // delete profile
  deleteProfile: async (req, res) => {
    try {
      const { reason, description } = req.body;

      const userId = req.userId;

      console.log(userId, "userId");

      const user = await UserModel.findByIdAndUpdate(userId, {
        $set: {
          isDeleted: 1,
        },
      });

      const deleteProfile = await DeleteProfileModel.create({
        userId,
        deletedBy: 0,
        reason: reason,
        description: description,
      });

      return Response.success(res, 200, "User deleted Successfully");
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  // create services offered
  createServicesOffered: async (req, res) => {
    try {
      const { service_name } = req.body;
      const servicesOffered = await ServicesOfferedModel.create({
        service_name,
      });
      return Response.success(
        res,
        200,
        "Services offered created successfully",
        servicesOffered
      );
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  // get services offered
  getServicesOffered: async (req, res) => {
    try {
      const servicesOffered = await ServicesOfferedModel.find({});
      console.log(servicesOffered, "servicesOffered");

      return Response.success(
        res,
        200,
        "Services fetched successfully",
        servicesOffered
      );
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },

  // update Current location of user

  updateCurrentLocation: async (req, res) => {
    try {
      const userId = req.userId;
      const { lat, lng } = req.body;

      let locationCoordinates;

      if (lat && lng) {
        locationCoordinates = {
          type: "Point",
          coordinates: [lng, lat],
        };
      } else {
        return Response.error(res, 400, "Please give location");
      }

      const userData = await UserModel.findByIdAndUpdate(
        userId,
        {
          $set: { location: locationCoordinates },
        },
        { new: true }
      );

      return Response.success(
        res,
        200,
        "Location updated successfully",
        userData
      );
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },

  // car towing booking

  carTowingBooking: async (req, res) => {
    try {
      const userId = req.userId;
      const {
        pickUpLat,
        pickUpLng,
        pickUpAddress,
        dropOffLat,
        dropOffLng,
        dropOffAddress,
        description,
        serviceId,
        quantity,
        repair_type,
        scheduledDate,
        scheduledTime,
      } = req.body;

      let pickUplocationCoordinates;
      let dropOfflocationCoordinates;

      if (!serviceId) {
        return Response.error(res, 400, "Please give service id");
      }

      if (pickUpLat && pickUpLng) {
        pickUplocationCoordinates = {
          type: "Point",
          coordinates: [pickUpLng, pickUpLat],
        };
      } else {
        return Response.error(res, 400, "Please provide Pick up location");
      }

      if (dropOffLat && dropOffLng) {
        dropOfflocationCoordinates = {
          type: "Point",
          coordinates: [dropOffLng, dropOffLat],
        };
      } else {
        dropOfflocationCoordinates = {
          type: "Point",
          coordinates: [0, 0],
        };
      }



      const bookingId = Math.floor(10000000 + Math.random() * 90000000).toString();
      if (pickUpLat && pickUpLng) {

        let dataToSave = {
          pickUpLocation: pickUplocationCoordinates,
          dropLocation: dropOfflocationCoordinates,
          description,
          userId,
          serviceId,
          dropOffAddress,
          pickUpAddress,
          quantity,
          repair_type,
          scheduledTime,
          scheduledDate,
          bookingId
        };

        console.log(dataToSave, "datatosavea ");

        var data = await ServiceUsedModal.create(dataToSave);

        // Step 2: Fetch all users who match the criteria (role: 1, availability: 1, and serviceName: car towing)
        const nearbyUsers = await UserModel.find({
          role: 1,
          availiability: 1,

          "servicesOffered.serviceId": serviceId,
        });

        console.log(nearbyUsers, "near")

        // Step 3: Check the distance between each service user and the pickup location
        nearbyUsers.forEach(async (serviceUser) => {
          let serviceUserCoordinates = serviceUser.location.coordinates;

          // Calculate the distance between the service user and the pickup location
          let distance = helperFunction.getDistance(
            serviceUserCoordinates[1],
            serviceUserCoordinates[0],
            pickUpLat,
            pickUpLng
          );

          let pickUpAndDropOffDistance;
          if(dropOffLat && dropOffLng){
             pickUpAndDropOffDistance = helperFunction.getDistance(
              dropOffLat,
              dropOffLng,
              pickUpLat,
              pickUpLng
            );
          }

          console.log(distance, "distance");

          data = await ServiceUsedModal.findByIdAndUpdate(
            data?._id,
            { $set: { distance,pickUpAndDropOffDistance } },
            { new: true }
          );
          console.log(data, "data with distance");

          if (distance <= 100) {
            // Notify this service user, e.g., via email, SMS, or in-app notification
            console.log(`Notifying user ${serviceUser._id} within 5 km radius`);

            console.log(data, "data");
            // let expectedTime = distance / 40;
            // data = await ServiceUsedModal.findByIdAndUpdate(
            //   data?._id,
            //   { $set: distance, expectedTime },
            //   { new: true }
            // );
            // console.log(data, "request with distance");
            const carTowingRequestData = {
              pickUpLocation: pickUplocationCoordinates,
              dropLocation: dropOfflocationCoordinates,
              description,
              userId, // The user who made the request
              serviceUserId: serviceUser._id, // The nearby service user (driver)
              distance, // Distance from the service user to pickup location
              requestId: data?._id,
              dropOffAddress,
              pickUpAddress,
              serviceId,
              repair_type,
              scheduledTime,
              scheduledDate,
              bookingId
            };

            console.log(carTowingRequestData, "carTowingRequestData");

            // Save this data into the CarTowingRequest collection
            await CarTowingRequest.create(carTowingRequestData);

            // Your notification function here
            await notificationServices.sendNotification("New Request is coming", "New Request is coming", serviceUser._id, 2)
          }
          // else {
          //   return Response.success(res, 200, "No service provider found");
          // }
        });
      }

      return Response.success(res, 200, "Request saved successfully", data);
    } catch (error) {
      return Response.error(res, 500, error.message);

    }
  },

  // getCarTowingRequests

  getCarTowingRequests: async (req, res) => {
    try {
      const driverId = req.userId; // The logged-in driver (service provider)

      // Step 1: Fetch requests where the service user (driver) matches and within their service area
      let carTowingRequests = await CarTowingRequest.find({
        serviceUserId: driverId, // Only show the requests for the logged-in driver

      })
        .populate("userId serviceUserId serviceId") // Populate user details (requester)
        .exec();

      if (!carTowingRequests || carTowingRequests.length === 0) {
        return Response.error(res, 400, "No requests found");
      }



      // Step 2: Return the list of available requests to the driver
      return Response.success(
        res,
        200,
        "Requests fetched successfully",
        carTowingRequests
      );
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },

  // update car towing booking

  updateCarTowingBooking: async (req, res) => {
    try {
      const {
        isAccepted,
        acceptedBy,
        requestId,
        isReached,
        cancelReason,
        cancelDescription,
        cancelledBy,
        isComplete,
        extraAmmount,
        extraAmmountDescription,
        isExtraAmmountRequestAccepted,
        tip,
      } = req.body;

      if (!requestId) {
        return Response.error(res, 400, "Please give request Id");
      }



      if (isAccepted && acceptedBy) {
        var updatedData = await ServiceUsedModal.findByIdAndUpdate(
          requestId,
          { $set: { isAccepted, acceptedBy } },
          { new: true }
        ).populate({ path: "acceptedBy" });

        await notificationServices.sendNotification("Request Accepted", "Request Accepted", updatedData?.userId, 3)
        if (updatedData?.isAccepted == 1) {
          const clearDb = await CarTowingRequest.deleteMany({
            userId: updatedData.userId,
          });
          console.log("Cleared requests:", clearDb.deletedCount);
        }
      }

      if (isComplete) {
        console.log(requestId);

        let requestData = await ServiceUsedModal.findById(requestId).populate(
          "serviceId"
        );
        console.log(requestData, "requestData");

        let platformFees =
          ((parseInt(requestData?.serviceId?.price) +
            parseInt(requestData?.extraAmmount || 0)) /
            100) *
          2.5;

          let priceAccordingToDistance = (pickUpAndDropOffDistance || 0) * (requestData?.serviceId?.pricePerMile || 0)
        let grandTotal =
          parseInt(requestData?.serviceId?.price || 0) +
          platformFees +
          parseInt(requestData?.extraAmmount || 0) + (priceAccordingToDistance || 0)

       

      


        var updatedData = await ServiceUsedModal.findByIdAndUpdate(
          requestId,
          { $set: { isComplete, platformFees, grandTotal,priceAccordingToDistance } },
          { new: true }
        );

        await notificationServices.sendNotification("Service Provider complete his work", "Service Provider complete his work", updatedData.userId, 4)

        // SEND NOTIFICATION
      }

      if (
        cancelReason &&
        cancelDescription &&
        (cancelledBy == 0 || cancelledBy == 1)
      ) {
        var updatedData = await ServiceUsedModal.findByIdAndUpdate(
          requestId,
          { $set: { cancelReason, cancelDescription, cancelledBy } },
          { new: true }
        );

        // cancelledBy == 0 ? await notificationServices.sendNotification("Request cancelled", `Request cancelled by user`, updatedData?.acceptedBy, 6) : await notificationServices.sendNotification("Request cancelled", `Request cancelled by service provider`, updatedData?.userId, 6)
        await notificationServices.sendNotification("Request cancelled", `Request cancelled by user`, updatedData?.acceptedBy, 6)
        await CarTowingRequest.deleteMany({
          requestId
        });

        // send notification
      }


      if (isReached) {
        var updatedData = await ServiceUsedModal.findByIdAndUpdate(
          requestId,
          { $set: { isReached } },
          { new: true }
        );

        console.log(updatedData?.userId,"ye hi dekhna tha")

        await notificationServices.sendNotification("Service Provider is reached", "Service Provider is reached", updatedData?.userId, 7)

        // sendNotification
      }

      if (extraAmmount && extraAmmountDescription) {
        var updatedData = await ServiceUsedModal.findByIdAndUpdate(
          requestId,
          { $set: { extraAmmount, extraAmmountDescription } },
          { new: true }
        );

        await notificationServices.sendNotification(`Service Provider Requested for extra ammount`, `Service Provider Requested for extra ammount of ${extraAmmount} for ${extraAmmountDescription}`, updatedData.userId, 8)

        // sendNotification

      }

      if (isExtraAmmountRequestAccepted) {
        var updatedData = await ServiceUsedModal.findByIdAndUpdate(
          requestId,
          { $set: { isExtraAmmountRequestAccepted } },
          { new: true }
        );

        await notificationServices.sendNotification(`Request status`, `Extra ammount request ${isExtraAmmountRequestAccepted == 0 ? "Cancelled" : "Accepted"}`, updatedData.acceptedBy, 9)

        // sendNotification
      }

      if (tip) {
        let requestData = await ServiceUsedModal.findById(requestId).populate(
          "serviceId"
        );
        console.log(requestData, "requestData");

        let grandTotal = parseInt(requestData?.grandTotal) + parseInt(tip || 0);
        let platformFees = (grandTotal / 100) * 2.5;

        var updatedData = await ServiceUsedModal.findByIdAndUpdate(
          requestId,
          { $set: { tip, grandTotal, platformFees } },
          { new: true }
        );

        await notificationServices.sendNotification(`Gift for work`, `User give a tip of ${tip} Rupees`, updatedData.acceptedBy, 10)
      }

      
      

      return Response.success(
        res,
        200,
        "Request updated successfully",
        updatedData
      );
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },

  // cancel booking

  getBookingRequestInfo: async (req, res) => {
    try {
      const { id } = req.query;

      if (!id) {
        return errorRes(res, 400, "Please give requestId");
      }

      let data = await ServiceUsedModal.findById(id).populate([
        "userId",
        "acceptedBy",
        "serviceId"
      ]);
      return Response.success(
        res,
        200,
        "Booking request data fetched successfully",
        data
      );
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },

  // create payment intent

  createPaymentIntent: async (req, res) => {
    try {
      const { requestId } = req.body;
      const userId = req.userId;
      let price = 0;
      let total_amount;
      const bookingDetails = await ServiceUsedModal.findById(requestId);
      console.log(bookingDetails, "booking");
      // let adminCharge = (price / 100) * 3.0;
      total_amount = parseFloat(bookingDetails?.grandTotal);
      const customer = await stripe.customers.create({
        description: userId.toString(),
      });

      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: "2022-11-15" }
      );
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total_amount * 100),
        currency: "USD",
        automatic_payment_methods: {
          enabled: "true",
        },
      });

      console.log(paymentIntent, "paymentintent");

      let data = await ServiceUsedModal.findByIdAndUpdate(requestId, {
        $set: { paymentIntent: paymentIntent.id },
      });

      const payment_data = {
        ephemeralKey: ephemeralKey.secret,
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        customer: customer.id,
        currency: paymentIntent.currency,
        charges: paymentIntent.charges,
        clientSecret: paymentIntent.client_secret,
        publishKey: publishKey,
        total_amount,
      };
      return Response.success(res, 200, "PaymentIntent", payment_data);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      return Response.error(res, 500, error.message);
    }
  },

  // paymetn done

  paymentDoneforBooking: async (req, res) => {
    try {
      const userId = req.userId;
      const { requestId, paymentIntent, isPaymentReceived, isPaymentDone } =
        req.body;
      const bookingDetails = await ServiceUsedModal.findByIdAndUpdate(
        requestId,
        { $set: { isPaymentDone, isPaymentReceived } },
        { new: true }
      );
      // Generate the unique ID using the incremented count
      // const uniqueId = `RE-${new Date().getFullYear()}-${shortid.generate()}`;

      // Create StripeTransaction with the generated unique ID
      // const data = await Model.StripeTransaction.create({
      //   transaction_id: uniqueId,
      //   user_id: userId,
      //   payment_intent: paymentIntent,
      //   user_amount: bookingDetails?.grandTotal,
      //   // owner_amount: bookingDetails?.price,
      //   booking_id: requestId,
      //   owner_id: bookingDetails?.propertyId?.userId,
      //   // property_id: bookingDetails?.propertyId,
      //   payment_by: 0,
      // });
      // const ownerWalletExist = await Model.Wallet.findOne({
      //   userId: bookingDetails?.propertyId?.userId,
      // });
      // const userWalletExist = await Model.Wallet.findOne({
      //   userId: userId,
      // });
      // if (!userWalletExist) {
      //   await Model.Wallet.create({
      //     userId: userId,
      //     balance: 0,
      //   });
      // }
      // if (!ownerWalletExist) {
      //   await Model.Wallet.create({
      //     userId: bookingDetails?.propertyId?.userId,
      //     balance: bookingDetails?.price,
      //   });
      // } else if (ownerWalletExist) {
      //   const roundOff = (amount) => {
      //     return Math.round(amount * 100) / 100;
      //   };
      //   ownerWalletExist.balance = roundOff(
      //     ownerWalletExist?.balance + bookingDetails?.price
      //   );
      //   await ownerWalletExist.save();
      // }
      // const bookingData = await Model.Property.findById(
      //   bookingDetails?.propertyId
      // );
      // let startDate = moment(bookingDetails?.check_in).format("YYYY-MM-DD");
      // let endDate = moment(bookingDetails?.check_out).format("YYYY-MM-DD");
      // pushNotification({
      //   user_id: req.user?._id,
      //   misc: {
      //     hotel_name: bookingData?.hotel_name,
      //     startDate: startDate,
      //     endDate: endDate,
      //     bookingId: bookingDetails?.bookingId,
      //   },
      //   type: "bookingConfirmed",
      // });
      // pushNotification({
      //   user_id: bookingData?.userId,
      //   other_user: req.user._id,
      //   type: "newBooking",
      //   misc: { startDate: startDate, endDate: endDate },
      // });

      // send notifivation

      return Response.success(
        res,
        200,
        "Payment recorded successfully",
        bookingDetails
      );
    } catch (error) {
      console.log(error.message);
      return Response.error(res, 500, error.message);
    }
  },

  // reuest list based on status
  requestListBasedOnStatus: async (req, res) => {
    try {
      const userId = req.userId;
      const { status, role } = req.query;
      console.log(status)

      if (status == 1) {
        let data = await ServiceUsedModal.find({
          $or: [{ userId: userId }, { acceptedBy: userId }],
          isCompleted: 1, // Moved isCompleted into the query object
        }).populate("serviceId")
        return Response.success(
          res,
          200,
          "Complete service list fetched Successfully",
          data
        );
      }

      if (status == 2) {
        let data = await ServiceUsedModal.find({
          cancelledBy: { $in: [0, 1] },
          $or: [
            { acceptedBy: userId },
            { userId: userId }
          ]
        }).populate("serviceId");
        return Response.success(
          res,
          200,
          "Cancelled service list fetched Successfully",
          data
        );
      }



      if (status == 0) {
        // let currentDateTime1 = new Date("2024-11-23T13:27:59.787+00:00"); // Get the current date and time
        let currentDateTime = new Date(); // Get the current date and time
        console.log(currentDateTime)
        let data = await ServiceUsedModal.find({

          // scheduledDate:"2024-11-23T13:27:59.787+00:00"
          $or: [{ userId: userId }, { acceptedBy: userId }],
          scheduledDate: { $gt: currentDateTime.toISOString() },
          isAccepted: 1,
          cancelledBy: null




        }).populate("serviceId")
        console.log(data?.scheduledDate)

        return Response.success(
          res,
          200,
          "Upcoming service list fetched Successfully",
          data
        );
      }
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },

  // contact us

  contactUs: async (req, res) => {
    try {
      const userId = req.userId;
      const { name, email, subject, message } = req.body

      let data = await contactModel.create({ name, email, subject, message })


      let sendTo = 'codobux.social@gmail.com'
      let sendBy = process.env.SEND_GRID_SENDER

      const msg = {
        to: sendTo,
        from: sendBy,
        subject: subject,
        text: message,
        html: contactUsTemplate(name, email, message),
      };

      sendGrid(msg);

      return Response.success(
        res,
        200,
        "Request sent successfully",
        data
      );


    } catch (error) {
      return Response.error(res, 500, error.message);
    }

  },

  // get Notifications

  getNotification: async (req, res) => {
    try {
      const userId = req.userId;
      let data = await notificationModal.find({ userId }).sort({createdAt:-1})

      return Response.success(
        res,
        200,
        "Notifications fetched successfully",
        data
      );

    } catch (error) {
      return Response.error(res, 500, error.message);

    }
  }
};

export default UserAndServiceProvider;
