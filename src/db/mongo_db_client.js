import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";

import {
  MONGO_DB_URI,
  MAX_RETRIES,
  RETRY_DELAY,
} from "../constants/constants.js";

async function connectToDBWithRetry(retries = MAX_RETRIES) {
  try {
    const connectionInstance = await mongoose.connect(MONGO_DB_URI, {});

    console.log(
      `\nMongoDB connected || DB Host: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.error("MongoDB connection error: ", error);

    if (retries > 0) {
      console.log(
        ` Retrying in ${RETRY_DELAY / 1000} seconds... (${retries} retries left)`,
      );

      setTimeout(() => {
        connectToDBWithRetry(retries - 1);
      }, RETRY_DELAY);
    } else {
      console.error(
        "Could not connect to DB after multiple attempts. Exiting.",
      );
      process.exit(1); // Exit process for Kubernetes/PM2 to restart
    }
  }
}

export default connectToDBWithRetry;
