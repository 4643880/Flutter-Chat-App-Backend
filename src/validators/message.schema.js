import { z } from "zod";

export const createMessageSchema = z.object({
  receiver: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid receiver ID"),

  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message cannot exceed 5000 characters"),
});

export const updateMessageStatusSchema = z.object({
  messageId: z
    .string()
    .min(1, "Message ID is required"),

  status: z.enum(
    ["delivered", "read"],
    {
      message: "Invalid message status",
    },
  ),
});