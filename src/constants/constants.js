import { MONGODB_URI } from "../config/env.js";

export const MONGO_DB_URI = MONGODB_URI;
// export const MONGO_DB_URI = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASS}@${MONGO_DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

export const MAX_RETRIES = 5;
export const RETRY_DELAY = 3000; // 3 seconds

export const allowedOrigins = [
  "http://localhost:5173",
  // 'https://your-production-site.com'
];
