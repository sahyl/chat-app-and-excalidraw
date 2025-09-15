import express,{ RequestHandler, Router }  from "express";
import { signin, signup } from "../controllers/userControllers";


const userRouter:Router = express.Router()

userRouter.post('/signup', signup)
userRouter.post('/signin', signin)

export default userRouter