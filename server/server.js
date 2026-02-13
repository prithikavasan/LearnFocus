import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/users.js";
import focusRoutes from "./routes/focusRoutes.js";
import materialsRoutes from "./routes/materials.js";
import aiSuggestRouter from "./routes/aiSuggest.js";
import courseRoutes from "./routes/courses.js";
import chatRoutes from "./routes/chatRoutes.js";
import courseProgressRoutes from "./routes/courseProgressRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";

// Socket handler
import socketHandler from "./socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

socketHandler(io);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/focus", focusRoutes);
app.use("/api/materials", materialsRoutes);
app.use("/api/ai-suggest", aiSuggestRouter);
app.use("/api/courses", courseRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/progress", courseProgressRoutes);
app.use("/api/rooms", roomRoutes);

app.get("/", (req, res) => res.status(200).send("LearnFocus Backend Running 🚀"));

app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
