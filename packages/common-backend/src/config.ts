export const JWT_SECRET = process.env.JWT_SECRET ||  " 12341214"
export const HTTP_PORT = process.env.HTTP_PORT || "3001"
export  const getwsport = ()=> parseInt(process.env.WS_PORT || "8080", 10);
export const  REDIS_URL = process.env.REDIS_URL || "rediss://default:AdrrAAIncDE0ZjI5ZDY1YjEzY2E0Mjg3ODBkODBiZjgzZTY2NTBhNXAxNTYwNDM@curious-burro-56043.upstash.io:6379"


