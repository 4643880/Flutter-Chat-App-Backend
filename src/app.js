import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import userRoutes from "./routes/user.routes.js";
import chatRoomRoutes from "./routes/chat_room.routes.js";
import chatRoutes from "./routes/chat.routes.js";

import errorHandler from "./middlewares/error_handler.middleware.js";
import methodNotAllowed from "./middlewares/method_not_allowed.middleware.js";

import socketHandler from "./sockets/socket.handler.js";

const app = express();

// HTTP middleware
app.use(express.json({ limit: "16kb" }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chat-room", chatRoomRoutes);
app.use("/api/v1/chat", chatRoutes);

// Unsupported routes/methods
app.use(methodNotAllowed);

// Global error handler
app.use(errorHandler);

// HTTP Server
const httpServer = createServer(app);

// Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Socket handlers
socketHandler(io);

app.get("/", (req, res) => {
  res.status(200).json({
    welcomeMessage: "Welcome to Chat App API.",
  });
});

export { app, httpServer, io };
