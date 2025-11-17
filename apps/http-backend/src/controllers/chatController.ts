import { checkRateLimit } from "@repo/common-backend/rateLimit";
import { RoomZodSchema } from "@repo/common/types";
import prismaClient from "@repo/db/client";
import { Request, Response } from "express";

export const allChats = async (req: Request, res: Response) => {
  const result = RoomZodSchema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({ error: "Inncorrect Room name" });
    return;
  }

  const { slug } = result.data;
  const userId = req.ip
  const key = `rate:chatfetch:${userId}`
  if(await checkRateLimit(key , 60, 60)){
     res.status(429).json({error:
      "Too many requests for chat history"
    })
    return 
  }
  try {
    const chats = await prismaClient.room.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        slug: true,
        chats: {
          take: 1000,
          orderBy: { id: "desc" },
          select: {
            id: true,
            message: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
    if (!chats) {
      res.status(404).json({ error: "chats not found" });
      return;
    }
    res.status(200).json({
      slug,
      chats,
    });
  } catch (error) {
    res.status(500).json({ error: "unable to load chats", details: error });
  }
};
