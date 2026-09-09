import Message from "../models/message.model.js";

const createMessage = async (messageData) => {
  // Database mein new message create karenge
  return await Message.create(messageData);
};

const fetchMessages = async (queryObj, page, limit) => {
  // Pagination ke liye kitne messages skip karne hain
  const skip = (page - 1) * limit;

  // Given chat room ke messages fetch karenge
  return await Message.find(queryObj)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const updateMessageStatus = async (queryObj, status) => {
  // Given messages ka status update karenge
  return await Message.updateMany(queryObj, {
    $set: {
      status,
    },
  });
};

const getUnDeliveredMessages = async (queryObj) => {
  // Query ke according undelivered messages fetch karenge
  return await Message.find(queryObj);
};


const markMessagesAsDelivered = async (chatRoomId, receiverId, senderId) => {
  // Sirf current chat room ke messages ko delivered karenge
  return await Message.updateMany(
    {
      chatRoomId,
      receiver: receiverId,
      sender: senderId,
      status: "sent",
    },
    {
      $set: {
        status: "delivered",
      },
    },
  );
};

const markMessagesAsRead = async (chatRoomId, receiverId, senderId) => {
  // Sirf current chat room ke delivered messages ko read karenge
  return await Message.updateMany(
    {
      chatRoomId,
      receiver: receiverId,
      sender: senderId,
      status: "delivered",
    },
    {
      $set: {
        status: "read",
      },
    },
  );
};

export const chatRoom = () => {

}

export default {
  createMessage,
  fetchMessages,
  updateMessageStatus,
  getUnDeliveredMessages,
  updateUserLastSeen,
  markMessagesAsDelivered,
  markMessagesAsRead,
};
