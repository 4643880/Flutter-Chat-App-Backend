// 1. Authenticate user
// 2. Join personal room
// 3. Update online status
// 4. Join chat room
// 5. Send message
// 6. Handle pending messages
// 7. Delivered status
// 8. Read status
// 9. Typing
// 10. Disconnect / lastSeen

import socketAuthMiddleware from "../middlewares/socket_auth.middleware.js";

const socketHandler = (io) => {
  // Har socket connection se pehle authentication check hogi
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Authentication middleware ne
    // verified user socket.user mein save kiya hai
    console.log("Authenticated user:", socket.user);

    // Baqi steps baad mein ayenge

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default socketHandler;
