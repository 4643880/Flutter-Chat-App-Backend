import jwt from "jsonwebtoken";

import { ACCESS_TOKEN_SECRET } from "../config/env.js";

const socketAuthMiddleware = (socket, next) => {
  try {
    // Client socket connection ke waqt token bhejega
    const token = socket.handshake.auth?.token;

    // Agar token nahi mila
    if (!token) {
      return next(new Error("Authentication token is required"));
    }

    // JWT token verify karenge
    const decodedUser = jwt.verify(token, ACCESS_TOKEN_SECRET);

    // Verified user ki information socket ke andar save karenge
    socket.user = decodedUser;

    // Authentication successful
    next();
  } catch (error) {
    // Token invalid ya expired hai
    next(new Error("Invalid or expired authentication token"));
  }
};

export default socketAuthMiddleware;
