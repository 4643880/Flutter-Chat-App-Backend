export const chatRoom = async (currentUserId, otherUserId) => {
  // Dono users se same chat room ID banayenge
  const roomId = getRoomId(currentUserId, otherUserId);

  // Pehle check karenge ke chat room already exist karta hai ya nahi
  let room = await chatRoomRepository.findByRoomId(roomId);

  // Agar room exist nahi karta to naya room create karenge
  if (!room) {
    room = await chatRoomRepository.createChatRoom({
      roomId,
      participants: [currentUserId, otherUserId],
    });
  }

  // Chat room return karenge
  return room;
};
