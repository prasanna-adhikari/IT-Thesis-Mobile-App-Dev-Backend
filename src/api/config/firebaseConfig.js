import admin from "firebase-admin";
import serviceAccount from "./path/to/your-firebase-adminsdk.json"; // Replace this with your Firebase Admin SDK JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
