import express from 'express'
import "dotenv/config"
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
import { connectDB } from './lib/db.js'
import cors from 'cors'

const app = express()
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5001

app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive CORS for deployed frontend requests
    },
    credentials: true,
  })
);
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/users", userRoutes)

app.use("/api/chat", chatRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})