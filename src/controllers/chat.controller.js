import StatusCodes from "../constants/status_codes.js";
import * as messageService from "../services/message.service.js";
import asyncHandler from "../utils/async_handler.js";
import ApiResponse from "../utils/api_response.js";

/**
 * @desc    Create a new message
 * @route   POST /api/v1/messages
 * @access  Private
 */
export const createMessage = asyncHandler(async (req, res) => {
  const { receiverId, message } = req.body;

  const senderId = req.user._id;

  const messageData = {
    sender: senderId,
    receiver: receiverId,
    message,
  };

  const createdMessage = await messageService.createMessage(messageData);

  return res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(
        StatusCodes.CREATED,
        createdMessage,
        "success",
        "Message created successfully.",
      ),
    );
});

/**
 * @desc    Fetch chat messages
 * @route   GET /api/v1/messages/:senderId/:receiverId
 * @access  Private
 */
export const fetchChatMessages = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.params;

  const currentUserId = req.user._id;

  const { page = 1, limit = 20 } = req.query;

  const messages = await messageService.fetchChatMessages(
    currentUserId,
    senderId,
    receiverId,
    Number(page),
    Number(limit),
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        messages,
        "success",
        "Chat messages fetched successfully.",
      ),
    );
});

/**
 * @desc    Update message status
 * @route   PATCH /api/v1/messages/status
 * @access  Private
 */
export const updateMessageStatus = asyncHandler(async (req, res) => {
  const { senderId, receiverId, status } = req.body;

  const currentUserId = req.user._id;

  const result = await messageService.updateMessageStatus(
    currentUserId,
    senderId,
    receiverId,
    status,
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        result,
        "success",
        "Message status updated successfully.",
      ),
    );
});

/**
 * @desc    Get undelivered messages
 * @route   GET /api/v1/messages/undelivered/:senderId/:receiverId
 * @access  Private
 */
export const getUnDeliveredMessages = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.params;

  const currentUserId = req.user._id;

  const messages = await messageService.getUnDeliveredMessages(
    currentUserId,
    senderId,
    receiverId,
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        messages,
        "success",
        "Undelivered messages fetched successfully.",
      ),
    );
});

/**
 * @desc    Mark messages as delivered
 * @route   PATCH /api/v1/messages/delivered/:senderId
 * @access  Private
 */
export const markMessagesAsDelivered = asyncHandler(async (req, res) => {
  const { senderId } = req.params;

  const currentUserId = req.user._id;

  const result = await messageService.markMessagesAsDelivered(
    currentUserId,
    senderId,
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        result,
        "success",
        "Messages marked as delivered successfully.",
      ),
    );
});

/**
 * @desc    Mark messages as read
 * @route   PATCH /api/v1/messages/read/:senderId
 * @access  Private
 */
export const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { senderId } = req.params;

  const currentUserId = req.user._id;

  const result = await messageService.markMessagesAsRead(
    currentUserId,
    senderId,
  );

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        result,
        "success",
        "Messages marked as read successfully.",
      ),
    );
});
