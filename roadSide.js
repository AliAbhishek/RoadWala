import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/DbConnection/DBConnect.js";
import UserAndServiceProviderRouter from "./src/Routes/UserAndServiceProviderRoutes.js";
import swagger_ui from "swagger-ui-express";
import openapi_docs from "./output.openapi.json" assert { type: "json" };
import adminRouter from "./src/Routes/adminRoutes.js";
import { superadmin } from "./src/DbConnection/superAdmin.js";
import cors from "cors";
import cron from 'node-cron';
import moment from 'moment-timezone';
import ServiceUsedModal from "./src/Models/ServicesUsed.js";
import CarTowingRequest from "./src/Models/CarTowingRequestSchema.js";
import notificationServices from "./src/utils/notificationService.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  "/docs",
  swagger_ui.serve,
  swagger_ui.setup(openapi_docs, {
    title: `RoadSide Api Documentation`,
  })
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "DELETE",
      "X-Access-Token",
    ],
  })
);

app.use(express.json());
app.use("/public", express.static("public"));
app.use("/api/admin", adminRouter);
app.use("/api", UserAndServiceProviderRouter);


superadmin()
connectDB();
cron.schedule('* * * * *', async () => {
  try {
    // Get the current system time in the correct timezone (replace 'Asia/Kolkata' with your timezone)
    const now = moment().tz('Asia/Kolkata'); // Local system time in the correct timezone (Kolkata)
    const oneMinuteAgo = moment(now).subtract(3, 'minute'); // Subtract 1 minute
    console.log("here", oneMinuteAgo.utc())
    // Convert the system time and `createdAt` to UTC for accurate comparison
    const result = await CarTowingRequest.find({
      createdAt: { $lte: oneMinuteAgo.utc() }, // Convert `oneMinuteAgo` to UTC before querying
    });

    if (result.length > 0) {
      // Extract all the serviceIds from the deleted requests
      const serviceIds = result.map(request => request.serviceId);

      // Delete the expired CarTowingRequest documents
      await CarTowingRequest.deleteMany({
        createdAt: { $lte: oneMinuteAgo.utc() },
      });

      console.log(`${result.length} CarTowingRequest documents removed.`);
      for (const serviceId of serviceIds) {
        const serviceRemovalResult = await ServiceUsedModal.findByIdAndDelete(serviceId);

        if (serviceRemovalResult) {
          console.log(`Service with ID ${serviceId} removed as all requests have been deleted.`);
        } else {
          console.log(`Service with ID ${serviceId} not found or not removed.`);
        }
      }


    } else {
      console.log("No documents to remove.");
    }


    // Now, we will check for reminders that should be sent (6 hours before scheduled time)
    const sixHoursBefore = moment().tz('Asia/Kolkata').add(6, 'hours'); // 6 hours from now in Kolkata time
    const reminderResult = await ServiceUsedModal.find({
      scheduledTime: { $lte: sixHoursBefore.utc().toISOString() }, // Reminder time (6 hours before scheduled)

    });

    if (reminderResult.length > 0) {
      for (const request of reminderResult) {

        await ServiceUsedModal.findByIdAndUpdate(request?._id, {
          $set: { sixHourReminder: true }

        });
        // Send reminder notification (You can replace this with your actual notification function)
        await notificationServices.sendNotification(
          "Reminder: New Towing Request in 6 hours",
          "This is a reminder that you have a new towing request scheduled in 6 hours.",
          request.acceptedBy,
          11
        );

        console.log(`Reminder sent for request ID: ${request._id}`);


      }
    }
    else {
      console.log("No 6 hours reminder sent to service provider.");
    }

    // Now, we will check for reminders that should be sent (4 hours before scheduled time)
    const fourHoursBefore = moment().tz('Asia/Kolkata').add(4, 'hours'); // 4 hours from now in Kolkata time
    const reminderResult4Hours = await ServiceUsedModal.find({
      scheduledTime: { $lte: fourHoursBefore.utc().toISOString() },
      sixHourReminder: true
      // Reminder time (4 hours before scheduled)
    });


    // Now, we will check for reminders that should be sent (4 hours before scheduled time)
    if (reminderResult4Hours.length > 0) {
      for (const request of reminderResult4Hours) {

        await ServiceUsedModal.findByIdAndUpdate(request?._id, {
          $set: { fourHourReminder: true }

        });
        // Send reminder notification for 4 hours before the scheduled time
        await notificationServices.sendNotification(
          "Reminder: New Towing Request in 4 hours",
          "This is a reminder that you have a new towing request scheduled in 4 hours.",
          request.acceptedBy,  // Assuming acceptedBy is the user to be notified
          11 // Assuming 11 is the notification type or identifier
        );

        console.log(`4 hours reminder sent for request ID: ${request._id}`);
      }
    } else {
      console.log("No 4 hours reminder sent to service provider.");
    }

    // Checking for reminders that should be sent (1 hour before scheduled time)
    const oneHourBefore = moment().tz('Asia/Kolkata').add(1, 'hours'); // 1 hour from now in Kolkata time
    const reminderResult1Hour = await ServiceUsedModal.find({
      scheduledTime: { $lte: oneHourBefore.utc().toISOString() },
      fourHourReminder: true // Reminder time (1 hour before scheduled)
    });

    if (reminderResult1Hour.length > 0) {
      for (const request of reminderResult1Hour) {

        await ServiceUsedModal.findByIdAndUpdate(request?._id, {
          $set: { oneHourReminder: true }

        });
        // Send reminder notification for 1 hour before the scheduled time
        await notificationServices.sendNotification(
          "Reminder: New Towing Request in 1 hour",
          "This is a reminder that you have a new towing request scheduled in 1 hour.",
          request.acceptedBy,  // Assuming acceptedBy is the user to be notified
          11 // Assuming 11 is the notification type or identifier
        );

        console.log(`1 hour reminder sent for request ID: ${request._id}`);
      }
    } else {
      console.log("No 1 hour reminder sent to service provider.");
    }

  } catch (err) {
    console.error("Error while deleting expired documents:", err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
