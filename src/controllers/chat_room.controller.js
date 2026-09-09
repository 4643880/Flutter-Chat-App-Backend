import StatusCodes from "../constants/status_codes.js";
import * as chatRoomService from "../services/chat_room.service.js";
import asyncHandler from "../utils/async_handler.js";

export const createOrGetChatRoom = asyncHandler(async (req, res) => {
  const { otherUserId } = req.body;

  const currentUserId = req.user._id;

  const room = await chatRoomService.chatRoom(currentUserId, otherUserId);

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Chat room retrieved successfully.",
    data: room,
  });
});
