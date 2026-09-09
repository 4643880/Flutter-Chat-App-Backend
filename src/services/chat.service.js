import messageRepository from "../repositories/chat.repository.js";

import { getRoomId } from "../utils/chat_helper.js";

export const createMessage = async (messageData) => {
  // Message create karne ka actual database ka kaam repository karegi
  return await messageRepository.createMessage(messageData);
};

export const fetchChatMessages = async (
  currentUserId,
  senderId,
  receiverId,
  page = 1,
  limit = 20,
) => {
  // Sender aur receiver se same chat room ID banayenge
  const roomId = getRoomId(senderId, receiverId);

  // Sirf isi chat room ke messages fetch karenge
  const queryObj = {
    chatRoomId: roomId,
  };

  // Chat messages repository se fetch karenge
  return await messageRepository.fetchMessages(queryObj, page, limit);
};

export const updateMessageStatus = async (
  currentUserId,
  senderId,
  receiverId,
  status,
) => {
  // Sender aur receiver se same chat room ID banayenge
  const roomId = getRoomId(senderId, receiverId);

  // Message status update karne ke liye query banayenge
  const queryObj = {
    chatRoomId: roomId,
    receiver: currentUserId,
    sender: senderId,
  };

  // Repository database mein message status update karegi
  return await messageRepository.updateMessageStatus(queryObj, status);
};

export const getUnDeliveredMessages = async (
  currentUserId,
  senderId,
  receiverId,
) => {
  // Sender aur receiver se same chat room ID banayenge
  const roomId = getRoomId(senderId, receiverId);

  // Sirf current user ko receive hone wale
  // aur abhi "sent" status wale messages find karenge
  const queryObj = {
    chatRoomId: roomId,
    receiver: currentUserId,
    sender: senderId,
    status: "sent",
  };

  // Repository database se undelivered messages fetch karegi
  return await messageRepository.getUnDeliveredMessages(queryObj);
};

export const markMessagesAsDelivered = async (
  currentUserId,
  senderId,
  receiverId,
) => {
  // Sender aur receiver se chat room ID banayenge
  const roomId = getRoomId(senderId, receiverId);

  // Current user ko receive hone wale sent messages
  // delivered mark karenge
  return await messageRepository.markMessagesAsDelivered(
    roomId,
    currentUserId,
    senderId,
  );
};

export const markMessagesAsRead = async (currentUserId, senderId) => {
  // Sender aur current user se chat room ID banayenge
  const roomId = getRoomId(senderId, currentUserId);

  // Current user ko receive hone wale delivered messages
  // ko read mark karenge
  return await messageRepository.markMessagesAsRead(
    roomId,
    currentUserId,
    senderId,
  );
};

