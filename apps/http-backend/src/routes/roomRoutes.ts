import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createRoom, joinRoom } from "../controllers/roomController";

const roomRouter: Router = Router();

roomRouter.post("/create-room", authMiddleware, createRoom);
roomRouter.get("/join-room/:slug" , authMiddleware , joinRoom)
export default roomRouter;
