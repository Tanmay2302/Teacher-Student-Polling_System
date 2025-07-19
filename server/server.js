import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import pollRoutes from "./routes/pollRoutes.js";
import {
  registerSocketEvents,
  setIoInstance,
} from "./controllers/socketController.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://teacher-student-polling-system.vercel.app/",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://teacher-student-polling-system.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/poll", pollRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

setIoInstance(io);
registerSocketEvents(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
