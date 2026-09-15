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

import crypto from "crypto";

import socketAuthMiddleware from "../middlewares/socket_auth.middleware.js";

import userRepository from "../repositories/user.repository.js";

const socketHandler = (io) => {
  // ==========================================
  // 1. Authenticate user
  // ==========================================

  io.use(socketAuthMiddleware);

  io.on("connection", async (socket) => {
    try {
      console.log("User connected:", socket.id);
      console.log("Authenticated user:", socket.user);

      const userId = socket.user._id.toString();

      // ==========================================
      // 2. Join personal room
      // ==========================================

      const personalRoom = `user:${userId}`;

      socket.join(personalRoom);

      console.log("User joined personal room:", personalRoom);

      // ==========================================
      // 3. Update online status
      // ==========================================

      await userRepository.updateUserOnlineStatus(userId, {
        isOnline: true,
      });

      console.log("User is now online:", userId);

      // ==========================================
      // 4. Join chat room
      // ==========================================

      socket.on("join_chat", async (otherUserId) => {
        try {
          const chatRoomId = getRoomId(userId, otherUserId);

          const chatRoom = `chat:${chatRoomId}`;

          socket.join(chatRoom);

          console.log("User joined chat room:", chatRoom);
        } catch (error) {
          console.log("Join chat error:", error);
        }
      });

      // ==========================================
      // 5. Send message
      // ==========================================

      socket.on("send_message", async (messageData) => {
        try {
          const { receiver, message } = messageData;

          const sender = userId;

          const chatRoomId = getRoomId(sender, receiver);

          const messageId = crypto.randomUUID();

          const newMessage = await messageRepository.createMessage({
            chatRoomId,
            messageId,
            sender,
            receiver,
            message,
            status: "sent",
          });

          const receiverPersonalRoom = `user:${receiver}`;

          // Send message directly to receiver's personal room.
          // This works even if receiver has not opened the chat.
          io.to(receiverPersonalRoom).emit("new_message", newMessage);

          // Send message back to sender as confirmation.
          socket.emit("message_sent", newMessage);

          console.log("Message sent:", newMessage);
        } catch (error) {
          console.log("Send message error:", error);
        }
      });

      // ==========================================
      // 6. Handle pending messages
      // ==========================================

      const pendingMessages = await messageRepository.getUnDeliveredMessages({
        receiver: userId,
        status: "sent",
      });

      if (pendingMessages.length > 0) {
        socket.emit("pending_messages", pendingMessages);

        console.log("Pending messages sent:", pendingMessages.length);

        // ==========================================
        // 7. Delivered status
        // ==========================================

        for (const pendingMessage of pendingMessages) {
          await messageRepository.updateMessageStatus(
            {
              _id: pendingMessage._id,
              status: "sent",
            },
            "delivered",
          );

          // Notify sender that this specific message
          // has been delivered.
          io.to(`user:${pendingMessage.sender}`).emit("message_delivered", {
            messageId: pendingMessage.messageId,
            chatRoomId: pendingMessage.chatRoomId,
          });
        }
      }

      // ==========================================
      // 8. Read status
      // ==========================================

      socket.on("read_messages", async (data) => {
        try {
          const { chatRoomId, senderId } = data;

          const receiverId = userId;

          await messageRepository.markMessagesAsRead(
            chatRoomId,
            receiverId,
            senderId,
          );

          // Tell sender that their messages
          // have been read.
          io.to(`user:${senderId}`).emit("messages_read", {
            chatRoomId,
            receiverId,
          });

          console.log("Messages marked as read:", chatRoomId);
        } catch (error) {
          console.log("Read messages error:", error);
        }
      });

      // ==========================================
      // 9. Typing
      // ==========================================

      socket.on("typing_start", (chatRoomId) => {
        socket.to(`chat:${chatRoomId}`).emit("user_typing", {
          userId,
          chatRoomId,
        });
      });

      socket.on("typing_stop", (chatRoomId) => {
        socket.to(`chat:${chatRoomId}`).emit("user_stopped_typing", {
          userId,
          chatRoomId,
        });
      });

      // ==========================================
      // 10. Disconnect / lastSeen
      // ==========================================

      socket.on("disconnect", async () => {
        try {
          console.log("User disconnected:", socket.id);

          await userRepository.updateUserLastSeen(userId);

          console.log("User is now offline:", userId);
        } catch (error) {
          console.log("Disconnect / lastSeen error:", error);
        }
      });
    } catch (error) {
      console.log("Socket connection error:", error);
    }
  });
};

export default socketHandler;
