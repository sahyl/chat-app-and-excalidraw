import {z} from "zod"
export const SignUpZodSchema = z.object({
    email:z.string().email(),
    password:z.string().min(5).max(10),
    username: z.string().trim().min(5).max(10)
})

export const SignInZodSchema = z.object({
    username:z.string().trim().min(5).max(10),
    password:z.string().min(5).max(10)
})

export const RoomZodSchema = z.object({
    slug : z.string().min(5).max(10)
})


export const JoinZodSchema  = z.object({
    type:z.literal("join_room"),
    roomId: z.string().min(5).max(10)
    
})


export const LeaveZodSchema  = z.object({
    type:z.literal("leave_room"),
    roomId: z.string().min(5).max(10)
})

export const  ChatZodSchema = z.object({
    type:z.literal("chat"),
    roomId: z.string().min(5).max(10),
    message: z.string().min(1).max(500),





})