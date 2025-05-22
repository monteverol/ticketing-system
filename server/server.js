import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ticketRoutes from "./routes/tickets.js";
import authRoutes from "./routes/auth.js"

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/tickets", ticketRoutes);
app.use("/api/auth", authRoutes);

app.get("/test", (req, res) => {
  res.send("API is working");
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));