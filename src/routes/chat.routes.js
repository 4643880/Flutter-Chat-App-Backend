import express from "express";

import validate from "../middlewares/validate_zod.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  createMessage,
  fetchChatMessages,
  updateMessageStatus,
  getUnDeliveredMessages,
  markMessagesAsDelivered,
  markMessagesAsRead,
} from "../controllers/message.controller.js";

import { createMessageSchema } from "../validators/message.schema.js";
import { updateMessageStatusSchema } from "../validators/message_status.schema.js";

const router = express.Router();

/**
 * @desc    Create a new message
 * @route   POST /api/v1/messages
 * @access  Private
 */
router
  .route("/")
  .post(authMiddleware, validate(createMessageSchema), createMessage);

/**
 * @desc    Fetch chat messages
 * @route   GET /api/v1/messages/:senderId/:receiverId
 * @access  Private
 */
router.route("/:senderId/:receiverId").get(authMiddleware, fetchChatMessages);

/**
 * @desc    Update message status
 * @route   PATCH /api/v1/messages/status
 * @access  Private
 */
router
  .route("/status")
  .patch(
    authMiddleware,
    validate(updateMessageStatusSchema),
    updateMessageStatus,
  );

/**
 * @desc    Get undelivered messages
 * @route   GET /api/v1/messages/undelivered/:senderId/:receiverId
 * @access  Private
 */
router
  .route("/undelivered/:senderId/:receiverId")
  .get(authMiddleware, getUnDeliveredMessages);

/**
 * @desc    Mark messages as delivered
 * @route   PATCH /api/v1/messages/delivered/:senderId
 * @access  Private
 */
router
  .route("/delivered/:senderId")
  .patch(authMiddleware, markMessagesAsDelivered);

/**
 * @desc    Mark messages as read
 * @route   PATCH /api/v1/messages/read/:senderId
 * @access  Private
 */
router.route("/read/:senderId").patch(authMiddleware, markMessagesAsRead);

export default router;
