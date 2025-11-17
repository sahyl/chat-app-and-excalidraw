import prismaClient from "@repo/db/client";
import { User } from "../types/ws";
import { chatQueue } from "@repo/common-backend/redis/ws";
import { checkRateLimit } from "@repo/common-backend/rateLimit";
import { JoinZodSchema, LeaveZodSchema ,ChatZodSchema } from "@repo/common/types"
export const Chats = (newUser: User, users: User[]) => {
  const { ws } = newUser;

  ws.on("message", async (data) => {
    
    
    try {
      let parsedJson : any 
      try {
        parsedJson = JSON.parse(data.toString())
        
      } catch {
        ws.send(JSON.stringify({type:"error",msg:"Invalid JSON"}))
        return 
      }

      let parsedData:
      |ReturnType<typeof JoinZodSchema.parse>|ReturnType<typeof LeaveZodSchema.parse>|ReturnType<typeof ChatZodSchema.parse>

      switch(parsedJson.type){
        case"join_room":{
          const result = JoinZodSchema.safeParse(parsedJson)
          if(!result.success){
            ws.send(JSON.stringify({type:"error",msg:"Invalid Join Payload"}))
            return
          }
          parsedData = result.data
          break
        }

        case "leave_room":{
          const result = LeaveZodSchema.safeParse(parsedJson)
          if(!result.success){
            ws.send(JSON.stringify({
              type:"error",msg:"Invalid Leave Payload"}))
              return 
          }
          parsedData = result.data
          break
        }
        case "chat":{
          const result = ChatZodSchema.safeParse(parsedJson)
          if(!result.success){
            ws.send(JSON.stringify({type:"error", msg:"Unknown event type"}))
            return
          }
          parsedData = result.data
          break
        }

        default:
          ws.send(JSON.stringify({type:"error" , msg:"Unknown event type"}))
          return 
      }
    
  

      switch (parsedData.type) {
        case "join_room": {
          try {
            const roomId = parsedData.roomId;
            if (!roomId) return;
            const currentUser = users.find((u) => u.ws === ws);
            const key = `rate:ws:join:${currentUser?.userId}`;
            if (await checkRateLimit(key, 5, 10)) {
              ws.send(
                JSON.stringify({ type: "error", msg: "Too many join requests" })
              );
              return;
            }

            const room = await prismaClient.room.findUnique({
              where: { slug: roomId },
            });
            if (!room) {
              ws.send(
                JSON.stringify({
                  type: "error",
                  msg: "the room does not exist",
                })
              );
              return;
            }

            if (currentUser && !currentUser.rooms.includes(roomId)) {
              currentUser.rooms.push(roomId);
            }
          } catch (error) {
            ws.send(
              JSON.stringify({ type: "error", msg: "Error joining room" })
            );
          }
          break;
        }

         case "leave_room": {
          const roomId = parsedData.roomId;
          const currentUser = users.find((u) => u.ws === ws);
          if (!currentUser) return;

          if (!currentUser.rooms.includes(roomId)) {
            ws.send(
              JSON.stringify({ type: "error", msg: "Not in that room" })
            );
            return;
          }

          currentUser.rooms = currentUser.rooms.filter((r) => r !== roomId);
          ws.send(JSON.stringify({ type: "left-room", roomId }));

          // Optional: notify others
        //   users.forEach((user) => {
        //     if (
        //       user.rooms.includes(roomId) &&
        //       user.ws.readyState === user.ws.OPEN
        //     ) {
        //       user.ws.send(
        //         JSON.stringify({
        //           type: "user-left",
        //           userId: currentUser.userId,
        //           roomId,
        //         })
        //       );
        //     }
        //   }
        // );
          break;
        }

    case "chat": {
          const { roomId, message } = parsedData;
          const currentUser = users.find((u) => u.ws === ws);
          if (!currentUser) return;

          const userId = currentUser.userId;
          const key = `rate:ws:chat:${userId}`;

          if (await checkRateLimit(key, 10, 2)) {
            ws.send(
              JSON.stringify({ type: "error", msg: "Rate limit exceeded" })
            );
            return;
          }

          const room = await prismaClient.room.findUnique({
            where: { slug: roomId },
          });
          if (!room) {
            ws.send(
              JSON.stringify({ type: "error", msg: "The room does not exist" })
            );
            return;
          }

          const roomNum = room.id;

          await chatQueue.add("save-chat", { roomNum, userId, message });
          users.forEach((user) => {
            if (
              user.rooms.includes(roomId) &&
              user.ws.readyState === user.ws.OPEN
            ) {
              user.ws.send(
                JSON.stringify({
                  type: "chat",
                  from: userId,
                  message,
                  roomId,
                })
              );
            }
          });
          

          // users.forEach((user) => {
          //   if (
          //     user.rooms.includes(roomId) &&
          //     user.ws.readyState === user.ws.OPEN &&
          //     user.userId !== userId // no echo to sender
          //   ) {
          //     user.ws.send(
          //       JSON.stringify({
          //         type: "chat",
          //         from: userId,
          //         message,
          //         roomId,
          //       })
          //     );
          //   }
          // });

          // Optionally, echo back to sender (depends on UX choice)
          // ws.send(
          //   JSON.stringify({
          //     type: "chat",
          //     from: userId,
          //     message,
          //     roomId,
          //     self: true,
          //   })
          // );

          break;
        }

        default:
          ws.send(JSON.stringify({ type: "error", msg: "Unknown event type" }));
      }
    } catch (error) {
      ws.send(
        JSON.stringify({ type: "error", msg: "Error in websocket connection" })
      );
    }
  });
};
