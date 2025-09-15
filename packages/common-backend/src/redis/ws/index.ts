import { REDIS_URL } from "../../config";
import { Queue } from "bullmq";
import IORedis from "ioredis"

const connection = new IORedis(REDIS_URL , {
  maxRetriesPerRequest:null, 
  enableReadyCheck:false
})

export const chatQueue = new Queue("chat" , {connection})
connection.ping().then((res)=>{
  console.log("redis is working" , res)
}).catch((err)=>{
  console.log("Redis connection failed" , err)
})


// rate  limiting left for http and ws

