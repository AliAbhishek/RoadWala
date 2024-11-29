import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import Admin from "../Models/admin.js";
import Response from "../helpers/Response.js";





export const adminauthentication=async(req,res,next)=>{
    
    try {
        const token = req.headers.authorization
        console.log(token,"tokren")
        if(!token){
            return Response.error(res, 400, "Unauthorise");
        }

        const decodeToken = await jwt.verify(token, process.env.JWT_SECRET)

        const userId = decodeToken.userId;
        console.log(userId,"userId")
        const admin = await Admin.findById(userId?._id);
        console.log(admin,"admin")
        req.admin = admin;
        next()
        
    } catch (error) {
        return Response.error(res, 500, error.message);
        
    }

 


}