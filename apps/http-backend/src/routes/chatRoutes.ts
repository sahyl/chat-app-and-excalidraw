import { Router } from "express";
import { allChats } from "../controllers/chatController";
import { authMiddleware } from "../middlewares/authMiddleware";

const chatRouter:Router = Router()

chatRouter.get("/all-chats/:slug", authMiddleware, allChats)

export default chatRouter