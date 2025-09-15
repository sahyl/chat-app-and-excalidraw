// this is to verify that only authenticated users from the http layer are connected to the ws layer
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common-backend/config";

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      return null;
    }
    return { userId: decoded.userId };
  } catch (error) {
    return null;
  }
};
