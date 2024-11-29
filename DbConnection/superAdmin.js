import bcrypt from "bcrypt"
import Admin from "../Models/admin.js"




export const superadmin =async()=>{
    try {

        let fetch_admin = await Admin.findOne({email:"roadsideAssistance@yopmail.com"})
        

        if(fetch_admin){
            console.log("admin found")
        }else{
            let password= await bcrypt.hash("password",10)
            let save_data = {
                first_name:"superadmin",
                last_name:null,
                email:"roadsideAssistance@yopmail.com",
                password
            }

            await Admin.create(save_data)
        }
        
    } catch (error) {
        throw error
        
    }
}