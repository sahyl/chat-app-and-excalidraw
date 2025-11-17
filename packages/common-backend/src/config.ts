export const JWT_SECRET = process.env.JWT_SECRET ||  " 12341214"
export const HTTP_PORT = process.env.HTTP_PORT || "3001"
export  const getwsport = ()=> parseInt(process.env.WS_PORT || "8080", 10);
export const  REDIS_URL = process.env.REDIS_URL || "rediss://default:ASfiAAIncDJiYTBjNmVlNTE5YTc0OGY3YTcyOWNjM2QyYzkxODg5MXAyMTAyMTA@new-deer-10210.upstash.io:6379"


