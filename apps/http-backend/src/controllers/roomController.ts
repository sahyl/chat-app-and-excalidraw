import { checkRateLimit } from "@repo/common-backend/rateLimit";
import { RoomZodSchema } from "@repo/common/types";
import prismaClient from "@repo/db/client";
import { Request, Response } from "express";

export const createRoom = async (req: Request, res: Response) => {
  const result = RoomZodSchema.safeParse(req.body);
  const userId = req.userId;
  const key  = `rate:roomcreate:${userId}`
  if(await checkRateLimit(key,10,86400)){
    res.status(429).json({error:"Room creation limit reached."})
    return 
  }
  if (!userId) {
    res.status(404).json({ error: "Unauthorized" });
    return;
  }

  if (!result.success) {
    res.json({ "Inncorrect Inputs": result.error });
    return;
  }
  const { slug } = result.data;
//   admin: { connect: { id: userId } }
  try {
    const room = await prismaClient.room.create({
      data: { slug: slug, adminId:userId },
    });
    res.status(201).json({ message: "Room created", room });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Room already exisits", details: error });
  }
};

// res.status(201).json({ message: "User created", user });
//   } catch (error) {
//     res.status(500).json({ error: "Error during signup", details: error });
//   }
