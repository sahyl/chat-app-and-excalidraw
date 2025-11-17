import { WebSocketServer } from "ws";
import { verifyToken } from "./auth";
import type { User } from "./types/ws";
import { handleConnection } from "./handlers";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" })
import { getwsport } from "@repo/common-backend/config";

const users :User[] = []

const WS_PORT = getwsport()

export const createWebSocketServer = () => {
  const wss = new WebSocketServer({ port: WS_PORT  ,   maxPayload: 1024 * 1024 * 5});

  wss.on("connection", (ws, req) => {

    
    try{
      // ws.on("message", (data) => {
      //   // Convert RawData → Buffer
      //   const buffer = Buffer.isBuffer(data)
      //     ? data
      //     : Buffer.concat(data as Buffer[]);
      
      //   // Convert buffer → string
      //   const text = buffer.toString("utf8");
      
      //   console.log("📥 Payload received:", buffer.length, "bytes");
      //   console.log("Parsed text:", text);
      
      //   // Finally, parse JSON
      //   const json = JSON.parse(text);
      // });
    const url = new URL(req.url ?? "", "http://localhost");
    const token = url.searchParams.get("token");

    if (!token) {
      ws.close(4001, "Unauthenticated request");
      return;
    }
    const user = verifyToken(token);
    if (!user) {
      ws.close(4002, "Invalid user");
      return;
    }

   
     const newUser: User = {
      rooms:[],
      userId: user.userId,
      ws
    }

    users.push(newUser)
    
    handleConnection(newUser , users)
  }catch(err){
    console.error("Error handling WS connection", err)
    ws.close(4500 , "Internal server error")

  }

  });
  console.log(`✅ WebSocket server running on ws://localhost:${WS_PORT}`);
};
