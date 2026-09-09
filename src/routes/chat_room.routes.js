import express from "express";
import { createOrGetChatRoom } from "../controllers/chat_room.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { createChatRoomSchema } from "../validators/chat_room.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @desc    Create a new chat room or get existing chat room
 * @route   POST /api/v1/chat-rooms
 * @access  Private
 */

router.post(
  "/",
  verifyJwtMiddleware,
  validate(createChatRoomSchema),
  createOrGetChatRoom,
);

export default router;
