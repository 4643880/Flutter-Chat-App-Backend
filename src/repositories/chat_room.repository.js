import ChatRoom from "../models/chat_room.model.js";

const findByRoomId = async (roomId) => {
  // Room ID ke through existing chat room find karenge
  return await ChatRoom.findOne({ roomId });
};

const createChatRoom = async (chatRoomData) => {
  // Database mein naya chat room create karenge
  return await ChatRoom.create(chatRoomData);
};

export default {
  findByRoomId,
  createChatRoom,
};
