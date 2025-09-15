import { REDIS_URL } from "../../config";
import prismaClient from "@repo/db/client";
import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const worker = new Worker(
  "chat",
  async (job) => {
    const { roomNum, userId, message } = job.data;
    await prismaClient.chat.create({
      data: {
        roomId: roomNum,
        message,
        userId,
      },
    });
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`JOB ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.log(`Job ${job?.id} failed : ${error.message}`);
});
