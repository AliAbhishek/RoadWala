// Import the Firebase Admin SDK
import admin from "firebase-admin";
import firebase from "firebase-admin"
import serviceAccount from "../../roadAssist.firebase.json" assert { type: "json" };
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});
// const buildDataPayload = (user, title, type, user_id, other_user, desc) => {
//   const data = {};
//   if (user?.full_name) data.user_name = String(user.full_name);
//   if (user?.image) data.user_image = String(user.image);
//   if (title) data.title = String(title);

//   if (type) data.type = String(type);
//   if (user_id) data.user_id = String(user_id);
//   if (other_user) data.other_user = String(other_user);
//   if (desc) data.body = String(desc);
//   return data;
// };






// Export the initialized admin instance for use in other parts of the project
export default admin;