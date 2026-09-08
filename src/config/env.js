import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export const MONGODB_URI = String(process.env.MONGODB_URI || "");

// MongoDB connection constants
export const MONGO_DB_USER = String(process.env.MONGO_DB_USER) || "";
export const MONGO_DB_PASS = String(process.env.MONGO_DB_PASS) || "";
export const MONGO_DB_CLUSTER = String(process.env.MONGO_DB_CLUSTER) || "";
export const DB_NAME = String(process.env.DB_NAME) || "testingDB";

// Server
export const NODE_ENV = String(process.env.NODE_ENV) || "development";
export const PORT = process.env.PORT || 5000;

// Auth
export const ACCESS_TOKEN_SECRET = String(process.env.ACCESS_TOKEN_SECRET);
export const ACCESS_TOKEN_EXPIRY = String(process.env.ACCESS_TOKEN_EXPIRY);

export const REFRESH_TOKEN_SECRET = String(process.env.REFRESH_TOKEN_SECRET);
export const REFRESH_TOKEN_EXPIRY = String(process.env.REFRESH_TOKEN_EXPIRY);
