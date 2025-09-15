import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common-backend/config";
import prismaClient from "@repo/db/client";
 import {Prisma} from "@repo/db/client"
import { SignUpZodSchema, SignInZodSchema } from "@repo/common/types";
import { checkRateLimit } from "@repo/common-backend/rateLimit";


export const signup = async (req: Request, res: Response) => {
  try {
    const result = SignUpZodSchema.safeParse(req.body);
    const ip = req.ip
    const key = `rate:signup:${ip}`


    if (await checkRateLimit(key,5,3600)){
       res.status(429).json({error:"Too many signups.Try later."})
       return 
    }

    if (!result.success) {
      res.status(400).json({
        error: "Incorrect SignUp Inputs",
        details: result.error.flatten(),
      });
      return;
    }
    
    const { email, username, password } = result.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaClient.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    
    res.status(201).json({ message: "User created", user });
  } catch (error) {
    if( error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"){
     res.status(409).json({ error: "Email or username already exists" });
     return
    }
    res.status(500).json({ error: "Error during signup", details: error });
  }
};

export const signin = async (req: Request, res: Response) => {
  const result = SignInZodSchema.safeParse(req.body);


  if (!result.success) {
    res.json({ "Incorrect SignIn Inputs": result.error });
    return;
  }
  const ip = req.ip
  const { username, password } = result.data;
  const key =`rate:signin:${username}:${ip}`
    if(await checkRateLimit(key  ,5,900)){
      res.status(429).json({error:"Too many login attempts. try later."})
      return 
    }

  try {

    const user = await prismaClient.user.findFirst({
      where: { username  },
      select: { username: true, id: true, password: true },
    });

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET , {expiresIn:"1d"});
    res.status(201).json({
      message: "Signed in successfully",
      user: { id: user.id, username: user.username },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Error during signin", details: error });
  }
};
