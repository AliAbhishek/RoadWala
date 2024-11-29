
import jwt from "jsonwebtoken";
import Response from "../helpers/Response.js";
import UserModel from "../Models/UserModal.js";


const UserAuthentication = {
  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return Response.error(res, 401, "Unauthorized");
      }
      const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decodeToken.userId;

      let user = await UserModel.findById(req.userId);
      req.user = user;

      if (!user) {
        return Response.error(res, 401, "Unauthorized");
      }

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
            return Response.error(res, 400, "User Not Found");
          }
      next();
    } catch (error) {
      return Response.error(res, 500, "Internal Server Error", error);
    }
  },
};

export default UserAuthentication;
