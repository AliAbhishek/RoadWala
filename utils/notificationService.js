import { CollectionGroup } from "firebase-admin/firestore";
import notificationModal from "../Models/notifications.js";
import UserModel from "../Models/UserModal.js";
import admin from "./FireBase.js";




const notificationServices = {
  sendNotification: async (title, body, userId, type) => {
    try {
      console.log(userId, "=======================in notification function")
      // const userId = req.user?.userId

      const user = await UserModel.findById(userId);
      console.log(user, "---------in notification function")
      if (!user) {
        throw new Error('User or device token not found');
      }

      const message = {
        notification: {
          title,
          body,

        },
        data: {
          type: type.toString(),  // You can pass other custom fields in the data object (e.g., 'type')
        },
        token: user.device_token,
      };

      console.log(title, body, "title,body")
      let dataToSave = { title, body, userId, type }

      await notificationModal.create(dataToSave)



      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);


    } catch (error) {
      console.error('Error sending message:', error);
    }

  }
}

export default notificationServices