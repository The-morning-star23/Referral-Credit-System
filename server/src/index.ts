import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

// Mount the routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); // <-- Use user routes

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});