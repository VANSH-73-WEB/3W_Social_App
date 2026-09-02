import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json({ limit: "8mb" }));

app.get("/", (_req, res) => {
  res.json({ message: "TaskPlanet Social API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const connect = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
};

connect().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
