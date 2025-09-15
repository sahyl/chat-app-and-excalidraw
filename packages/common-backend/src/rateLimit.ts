import Redis from "ioredis";
import { REDIS_URL } from "./config";

const redis = new Redis(REDIS_URL)


export async function checkRateLimit(
    key:string , 
    limit :number,
    windowSec:number ):Promise<boolean>{
        const count = await redis.incr(key)

        if(count === 1){
            await redis.expire(key,windowSec)
        }
        return count > limit 
    }
