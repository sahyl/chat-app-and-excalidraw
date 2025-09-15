import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createRoom } from "../controllers/roomController";

const roomRouter: Router = Router();

roomRouter.post("/create-room", authMiddleware, createRoom);

export default roomRouter;
