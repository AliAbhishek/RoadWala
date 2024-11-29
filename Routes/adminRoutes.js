import express from "express"
import { adminController } from "../Controller/adminController.js"
import verifyResetToken from "../Middlewares/verifyResetToken.js"
import { adminauthentication } from "../Middlewares/adminAuthentication.js"
import { upload } from "../Middlewares/multer.js"






const adminRouter = express.Router()

// =>Registration flow

adminRouter.post("/login" , adminController.login)
adminRouter.post("/forgetPassword" , adminController.forgotpassword)
adminRouter.post("/verifyOTP" , adminController.verifyOTP)

adminRouter.post("/resetPassword" ,verifyResetToken, adminController.resetPassword)


adminRouter.use(adminauthentication)
adminRouter.post("/changepassword" , adminController.changepassword)
adminRouter.put("/editAdminProfile" ,upload.fields([{name:"profile_image",maxCount:1}]) ,adminController.editAdminProfile)
adminRouter.get("/getAdminById" ,adminController.getAdminById)

// =>UserManagement flow

adminRouter.get("/userManagement" , adminController.userManagement)
adminRouter.get("/getUserById/:id" , adminController.getUserById)
adminRouter.delete("/deleteUser/:id" , adminController.deleteUser)
adminRouter.post("/banUnbanUser" , adminController.banUnbanUser)
adminRouter.post("/verifyUnverifyUser" , adminController.verifyUnverifyUser)
adminRouter.get("/dashboard" , adminController.dashboard)

// services flow

adminRouter.get("/getServices" , adminController.getServices)
adminRouter.put("/addService",upload.fields([{name:"service_image",maxCount:1}]) , adminController.addService)
adminRouter.delete("/deleteService/:serviceId" , adminController.deleteService)
adminRouter.get("/getServiceId/:id" , adminController.getServiceId)







export default adminRouter