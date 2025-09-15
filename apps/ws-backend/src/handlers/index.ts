import { Chats } from "./chat";
import { User } from "../types/ws";

export const handleConnection = (newUser:User  ,users:User[])=>{
    Chats(newUser , users)
}