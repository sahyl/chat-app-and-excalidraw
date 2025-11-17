import express  from "express"
import userRoutes from "./routes/userRoutes"
import roomRouter from "./routes/roomRoutes"
import { HTTP_PORT } from "@repo/common-backend/config"
import chatRouter from "./routes/chatRoutes"
import cors from "cors"

const app = express()

app.use(cors({origin:"http://localhost:3000" , credentials: true}))




app.use(express.json())


app.use('/api/user' , userRoutes)
app.use('/api/room' , roomRouter)
app.use("/api/chat" , chatRouter)





app.listen(HTTP_PORT, () => {
  console.log(`🚀 Server running at http://localhost:${HTTP_PORT}`);
});