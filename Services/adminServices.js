import bcrypt from "bcrypt";
import Admin from "../Models/admin.js";
import Response from "../helpers/Response.js";
import GenerateToken from "../helpers/GenerateToken.js";
import { sendadminForgetPasswordEmail } from "../helpers/sendAdminForgetPassword.js";
import UserModel from "../Models/UserModal.js";
import ServicesOfferedModel from "../Models/servicesOfferedModal.js";
import notificationServices from "../utils/notificationService.js";
import notificationModal from "../Models/notifications.js";


// import Vouchers from "../Models/vouchers.js";

export const adminServices = {
  // =============================================ADMIN LOGIN===================================================

  login: async (req, res) => {
    try {

      console.log("first")
      const { email, password } = req.body;

      const admin = await Admin.findOne({ email });

      if (admin) {
        let checkpassword = await bcrypt.compare(password, admin.password);
        if (!checkpassword) {
          return Response.error(res, 400, "Invalid credentials");
        }

        let token = await GenerateToken.generateToken(admin);
        let data = { admin, token };

        return Response.success(res, 200, "Admin login successfully", data);
      } else {
        return Response.error(res, 400, "Admin not found");
      }
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },

  //====================================================FORGOT PASSWORD============================================

  forgotpassword: async (req, res) => {
    try {
      //find the user exists in the database or not
      const admin = await Admin.findOne({
        email: req.body?.email,
      });
      console.log(req.body.email, admin)

      if (!admin) {
        return Response.error(res, 404, "Admin Not Found");
      }
      const token = await GenerateToken.generateToken(admin);
      sendadminForgetPasswordEmail({
        email: admin.email,
        project_name: process.env.PROJECT_NAME,
        type: "adminforgetpassword",
        user: admin,
        token: token,
      });
      return Response.success(
        res,
        200,
        "Password Reset link has been sent to your provided email"
      );
    } catch (err) {
      return Response.error(res, 500, err.message);
    }
  },
  // ==========================================VERIFY OTP===============================================

  verifyOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const admin = await Admin.findOne({ email });

      if (!admin) return Response.error(res, 400, "Admin not found");

      if (otp == admin.otp) {
        return Response.success(res, 200, "otp verified successfully", {
          Admin: admin,
        });
      } else return Response.error(res, 400, "Otp is incorrect");
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },

  //==============================================reset password===============================================

  resetPassword: async (req, res) => {
    try {
      const adminId = req.admin;
      const adminData = await Admin.findById(adminId);
      console.log(adminData, "adminData");

      const email = adminData?.email;

      if (!email) {
        return Response.error(res, 404, "Invalid Email");
      }

      const password = req.body.password;

      if (!password) {
        return Response.error(res, 400, "New Password is Required");
      }

      // Fetch user by email
      const admin = await Admin.findOne({ email: email });
      if (!admin) {
        return Response.error(res, 400, "Admin not found");
      }
      const isPasswordSame = await bcrypt.compare(password, admin.password);
      if (isPasswordSame) {
        return Response.error(
          res,
          400,
          "Old Password and New Password should not be the same"
        );
      }
      // Hash the new password
      // const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update user's password and timestamp
      const updatedUser = await Admin.findByIdAndUpdate(
        admin._id, // Assuming MongoDB's default '_id' field
        {
          $set: {
            password: hashedPassword,
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return Response.error(res, 400, "Invalid or expired token");
      }

      // Send success response
      return Response.success(
        res,
        200,
        "Password Changed Successfully",
        updatedUser
      );
    } catch (err) {
      // Handle errors
      return Response.error(res, 500, err.message);
    }
  },

  // ==========================================change password=================================================

  changepassword: async (req, res) => {
    try {
      const adminId = req.admin;
      const { oldPassword, newPassword } = req.body;

      const admin = await Admin.findById(adminId);

      if (!admin) {
        return Response.error(res, 400, "Admin not found");
      }

      let checkPrevPass = await bcrypt.compare(oldPassword, admin.password);

      if (!checkPrevPass) {
        return Response.error(res, 400, "Previous password is incorrect");
      } else {
        let password = await bcrypt.hash(newPassword, 10);
        const admin = await Admin.findOneAndUpdate({
          $set: { password: password },
        });
        return Response.success(res, 200, "Password changed successfully", {
          Admin: admin,
        });
      }
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },

  // =================================================user management===============================================

  userManagement: async (req, res) => {
    try {
      let { type, page = 1, limit, search, isAdminVerified, role } = req.query;

      // if (!limit) {
      //   defaultlimit = 10;
      // }

      let query = {};
      query.isPhoneVerified = 1;
      query.isDeleted = 0;
      query.isAdminDeleted = 0;

      if (type == 0) {
        query.isActive = 0;
      } else if (type == 1) {
        query.isActive = 1;
      }

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }


      // if (isAdminVerified == 1) {
      //   query.isAdminVerified = 1;
      // } else {
      //   query.isAdminVerified = 0;
      // }

      if (role == 1) {
        query.role = 1;
        query.isAdminVerified = 0
      } else if (role == 0) {
        query.role = 0;
      } else {
        // If no role is provided, include role 0 users and role 1 users that are admin verified
        query.$or = [
          { role: 0 }, // Include role 0 users
          { role: 1, isAdminVerified: 1 } // Include role 1 users that are admin verified
        ];
      }


      // page = parseInt(page, 10);

      console.log(query, "query");
      const totalCount = await UserModel.countDocuments(query);

      if (!limit) {
        limit = totalCount;
      }
      // limit = parseInt(limit, 10);

      const userData = await UserModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })


      const totalPages = Math.ceil(totalCount / (limit));

      return Response.success(res, 200, "Users fetched successfully", {
        users: userData,
        totalCount,
        limit: limit,
        currentpage: page,
        totalPages,
      });
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },

  // verify User and Unverify User

  verifyUnverifyUser: async (req, res) => {
    try {
      const { userId, type } = req.body;

      const userData = await UserModel.findByIdAndUpdate(userId, {
        $set: { isAdminVerified: type },
      });

      await notificationServices.sendNotification("Request Verified", "Request Verified", userId,1)
      
      return Response.success(
        res,
        200,
        `User ${type == 1 ? "Verified" : "Unverified"} successfully`,
        userData
      );
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },

  // ==========================================get single user=========================================

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);

      const userData = await UserModel.findById(id).populate("servicesOffered.serviceId");

      if (!userData) {
        return Response.error(res, 400, "User not found");
      }

      return Response.success(res, 200, "User fetched successfully", {
        user: userData,
      });
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },

  // ============================================delete user============================================

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedUser = await UserModel.findByIdAndUpdate(
        { _id: id },
        { $set: { isAdminDeleted: 1 } },
        { new: true }
      );

      return Response.success(res, 200, "User deleted successfully", {
        user: deletedUser,
      });
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },

  // ==========================================BanUnban user=================================================

  banUnbanUser: async (req, res) => {
    try {
      const { userId, type } = req.body;
      const userData = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $set: { isActive: type } },
        { new: true }
      );
      if (!userData) {
        return Response.error(res, 404, "User Not Found");
      }
      let message =
        type == 0 ? "User Suspend Successfully" : "User Active Successfully";
      return Response.success(res, 200, message, userData);
    } catch (err) {
      console.error(err);
      return Response.error(res, 500, err.message);
    }
  },

  // =========================================edit adminProfile============================================

  editAdminProfile: async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        email,
        password,
        phone_number,
        country_code,
      } = req.body;
      const { profile_image } = req.files;

      let image;
      console.log(profile_image, "profileImage");
      if (req.files && req.files.profile_image) {
        image = profile_image[0]?.path;
      }
      console.log(image, "image");

      let adminId = req.admin?._id;
      let adminData = await Admin.findByIdAndUpdate(adminId, {
        $set: {
          first_name,
          last_name,
          email,
          password,
          profile_image: image,
          phone_number,
          country_code,
        },
      });

      return Response.success(
        res,
        200,
        "Admin profile edited successfully",
        adminData
      );
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },

  // ==========================================getadminbyId===============================================

  getAdminById: async (req, res) => {
    try {
      let adminId = req.admin?._id;

      const userData = await Admin.findById(adminId);

      if (!userData) {
        return Response.error(res, 400, "Admin not found");
      }

      return Response.success(res, 200, "Admin fetched successfully", {
        user: userData,
      });
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },

  // dACHBOARD
  dashboard: async (req, res) => {
    try {
      const totalUsers = await UserModel.countDocuments({ isAdminDeleted: 0, isDeleted: 0,isActive:1 });
      const serviceProviders = await UserModel.countDocuments({ role: 1, isAdminDeleted: 0, isDeleted: 0 })
      const activeUsers = await UserModel.countDocuments({ isActive: 1, isAdminDeleted: 0, isDeleted: 0 })
      const pendingServiceProviders = await UserModel.countDocuments({ role: 1, isAdminVerified: 0, isAdminDeleted: 0, isDeleted: 0 })
      let data = {
        totalUsers, serviceProviders, activeUsers, pendingServiceProviders
      }
      return Response.success(res, 200, "Data fetched successfully", data)
    } catch (error) {
      return Response.error(res, 500, error.message);
    }

  },

  // MARK:Get Services

  getServices: async (req,res) => {
    try {
      let { page = 1, limit, search } = req.query;



      let query = {};


      if (search) {
        query.service_name = { $regex: search, $options: "i" };
      }


      console.log(query, "query");
      const totalCount = await ServicesOfferedModel.countDocuments(query);

      if (!limit) {
        limit = totalCount;
      }
      // limit = parseInt(limit, 10);

      const userData = await ServicesOfferedModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })


      const totalPages = Math.ceil(totalCount / (limit));

      return Response.success(res, 200, "Services fetched successfully", {
        services: userData,
        totalCount,
        limit: limit,
        currentpage: page,
        totalPages,
      });
    } catch (error) {
      return Response.error(res, 500, error.message);
    }

  },

  // MARK: Add Service

  addService: async (req,res) => {
    try {
      let adminId = req.admin?._id;

      const { price, serviceName, serviceId, status,pricePerMile,type } = req.body

      const { service_image } = req?.files;

      let image;
      
      if (req?.files && req?.files?.service_image) {
        image = service_image[0]?.path;
      }
      console.log(image, "image");

      if (serviceId) {
        let serviceData = await ServicesOfferedModel.findByIdAndUpdate(serviceId, {
          $set: {
            service_name: serviceName,
            price: price,
            service_image: image,
            status,
            pricePerMile,
            type
          }
        },{new:true})

        return Response.success(res, 200, "Service updated successfully", serviceData)
      }

      let dataToSave = {
        service_name: serviceName,
        price: price,
        service_image: image,
        status,
        pricePerMile,
        type
      }

      let serviceData = await ServicesOfferedModel.create(dataToSave)

      return Response.success(res, 200, "Service created successfully", serviceData)






    } catch (error) {
      return Response.error(res, 500, error.message);

    }
  },

  // MARK: Delete service

  deleteService:async(req,res)=>{
    try {
      const {serviceId} = req.params
      if(!serviceId){
        return Response.success(res, 400, "Please provide service ID");
      }
      let data = await ServicesOfferedModel.findByIdAndDelete(serviceId)
      return Response.success(res, 200, "Service deleted successfully",data);


      
      
    } catch (error) {
      return Response.error(res, 500, error.message);
    }

  },

  // MARK: get service by id

  getServiceId: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);

      const userData = await ServicesOfferedModel.findById(id)

      if (!userData) {
        return Response.error(res, 400, "Service not found");
      }

      return Response.success(res, 200, "Services fetched successfully", {
        service: userData,
      });
    } catch (error) {
      return Response.error(res, 500, error.message);
    }
  },


};
