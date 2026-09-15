import jwt from "jsonwebtoken";

import { ACCESS_TOKEN_SECRET } from "../config/env.js";
import userRepository from "../repositories/user.repository.js";

const socketAuthMiddleware = async (socket, next) => {
  try {
    // Client socket connection ke waqt token bhejega
    const token = socket.handshake.auth?.token;

    // Agar token nahi mila
    if (!token) {
      return next(new Error("Authentication token is required"));
    }

    // JWT verify karenge
    const decodedUser = jwt.verify(token, ACCESS_TOKEN_SECRET);

    // Database mein user check karenge
    const user = await userRepository.findUserById(decodedUser._id);

    // Agar user exist nahi karta
    if (!user) {
      return next(new Error("Invalid authentication token"));
    }

    // Authenticated user socket ke andar save karenge
    socket.user = user;

    console.log("Socket authenticated user:", user._id);

    // Authentication successful
    next();
  } catch (error) {
    console.log("Socket authentication error:", error.message);

    next(
      new Error(
        error.name === "TokenExpiredError"
          ? "JWT token expired"
          : "Invalid authentication token",
      ),
    );
  }
};

export default socketAuthMiddleware;
