import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import http from "http";
import { Server as SocketIOServer } from "socket.io";

import cors from "cors";
import dotenv from "dotenv";
import ticketRoutes from "./routes/tickets.js";
import authRoutes from "./routes/auth.js";

const PORT = process.env.PORT || 5002;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const server = http.createServer(app); // Wrap express into HTTP server

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST", "PUT"],
  }
});

app.set("io", io); // Store `io` instance in app context to access from routes/controllers

// socket connection
io.on("connection", (socket) => {
  console.log("Socket Connected: " + socket.id);

  socket.on("disconnect", () => {
    console.log("Socket Disconnected: " + socket.id);
  });
})

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/tickets", ticketRoutes);
app.use("/api/auth", authRoutes);

app.get("/test", (req, res) => {
  res.send("API is working");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});