import { adminServices } from "../Services/adminServices.js";


export const adminController = {
  login: async (req, res) => {
    let response = await adminServices.login(req, res);
  },
  forgotpassword: async (req, res) => {
    let response = await adminServices.forgotpassword(req, res);
  },
  verifyOTP: async (req, res) => {
    let response = await adminServices.verifyOTP(req, res);
  },
  resetPassword: async (req, res) => {
    let response = await adminServices.resetPassword(req, res);
  },
  changepassword: async (req, res) => {
    let response = await adminServices.changepassword(req, res);
  },
  userManagement: async (req, res) => {
    let response = await adminServices.userManagement(req, res);
  },
  dashboard: async (req, res) => {
    let response = await adminServices.dashboard(req, res);
  },
  getUserById: async (req, res) => {
    let response = await adminServices.getUserById(req, res);
  },
  deleteUser: async (req, res) => {
    let response = await adminServices.deleteUser(req, res);
  },
  banUnbanUser: async (req, res) => {
    let response = await adminServices.banUnbanUser(req, res);
  },
  editAdminProfile: async (req, res) => {
    let response = await adminServices.editAdminProfile(req, res);
  },

  getAdminById: async (req, res) => {
    let response = await adminServices.getAdminById(req, res);
  },
  getVoucherList: async (req, res) => {
    try {
      let data = await adminServices.getVoucherList(req, res);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },
  addVouchers: async (req, res) => {
    try {
      let data = await adminServices.addVouchers(req, res);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  deleteVoucher: async (req, res) => {
    try {
      let data = await adminServices.deleteVoucher(req, res);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },
  inactiveVoucher: async (req, res) => {
    try {
      let data = await adminServices.inactiveVoucher(req, res);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },
  verifyUnverifyUser: async (req, res) => {
    let response = await adminServices.verifyUnverifyUser(req, res);
  },
  getServices: async (req, res) => {
    let response = await adminServices.getServices(req, res);
  },
  addService: async (req, res) => {
    let response = await adminServices.addService(req, res);
  },
  deleteService: async (req, res) => {
    let response = await adminServices.deleteService(req, res);
  },
  getServiceId: async (req, res) => {
    let response = await adminServices.getServiceId(req, res);
  },
};
