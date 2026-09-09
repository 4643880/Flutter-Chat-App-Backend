import { z } from "zod";

export const createChatRoomSchema = z.object({
  otherUserId: z.string().min(1, "Other user ID is required"),
});
