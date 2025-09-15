import { WebSocket } from "ws";

// export interface AuthenticatedSocket extends WebSocket{
//     userId?:string
// }

export interface User {
    rooms:String[],
    ws:WebSocket,
    userId:String
}