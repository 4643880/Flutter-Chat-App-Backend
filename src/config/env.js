import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

// Server

export const PORT = Number(process.env.PORT) || 5000;

// MongoDB

export const MONGODB_URI = String(process.env.MONGODB_URI || "");

// Auth

export const JWT_SECRET = String(process.env.JWT_SECRET || "");
