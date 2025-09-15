// src/middleware/authMiddleware.ts
import { Request, Response, RequestHandler, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from "@repo/common-backend/config"

export const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["token"] as string | undefined;

  if (!token) {
    res.status(401).json({ msg: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token,JWT_SECRET ) as JwtPayload ;
     if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      res.status(401).json({ msg: "Invalid token payload" });
      return
    }
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};
