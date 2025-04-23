import { AuthenticatedRequest } from "../@types/express";
import { Response } from "express";
import { serverClientChat } from "../config/streamConfig";

export const createChatToken = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const token = serverClientChat.createToken(userId);
  res.json({ token });
};
