
import Response from "../helpers/Response.js";
import UserAndServiceProvider from "../Services/UserAndServiceProvider.js";


const UserAndServiceProviderController = {
  Login: async (req, res) => {
    try {
      return await UserAndServiceProvider.Login(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  verifyOTP: async (req, res) => {
    try {
      return await UserAndServiceProvider.verifyOTP(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  resendOtp: async (req, res) => {
    try {
      return await UserAndServiceProvider.resendOtp(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  createProfile: async (req, res) => {
    try {
      return await UserAndServiceProvider.createProfile(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  deleteProfile: async (req, res) => {
    try {
      return await UserAndServiceProvider.deleteProfile(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  getProfile: async (req, res) => {
    try {
      return await UserAndServiceProvider.getUserProfile(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  logout: async (req, res) => {
    try {
      return await UserAndServiceProvider.logout(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  getServicesOffered: async (req, res) => {
    try {
      return await UserAndServiceProvider.getServicesOffered(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  createServicesOffered: async (req, res) => {
    try {
      return await UserAndServiceProvider.createServicesOffered(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  AddServiceImages: async (req, res) => {
    try {
      return await UserAndServiceProvider.AddServiceImages(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  DeleteService: async (req, res) => {
    try {
      return await UserAndServiceProvider.DeleteService(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
    

  },
  createProfileBasicDeatsils: async (req, res) => {
    try {
      return await UserAndServiceProvider.createProfileBasicDeatsils(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  carTowingBooking: async (req, res) => {
    try {
      return await UserAndServiceProvider.carTowingBooking(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  updateCurrentLocation: async (req, res) => {
    try {
      return await UserAndServiceProvider.updateCurrentLocation(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  getCarTowingRequests: async (req, res) => {
    try {
      return await UserAndServiceProvider.getCarTowingRequests(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  updateCarTowingBooking: async (req, res) => {
    try {
      return await UserAndServiceProvider.updateCarTowingBooking(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  getBookingRequestInfo: async (req, res) => {
    try {
      return await UserAndServiceProvider.getBookingRequestInfo(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  createPaymentIntent: async (req, res) => {
    try {
      return await UserAndServiceProvider.createPaymentIntent(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  paymentDoneforBooking: async (req, res) => {
    try {
      return await UserAndServiceProvider.paymentDoneforBooking(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  requestListBasedOnStatus: async (req, res) => {
    try {
      return await UserAndServiceProvider.requestListBasedOnStatus(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  contactUs: async (req, res) => {
    try {
      return await UserAndServiceProvider.contactUs(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },
  getNotification: async (req, res) => {
    try {
      return await UserAndServiceProvider.getNotification(req, res);
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },


}

export default UserAndServiceProviderController;
