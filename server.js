import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import verification from './middleware/authmiddleware.js';
dotenv.config();
connectDB();

const app = express();



app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/login", authRoutes);
app.use("/api/v1/protected", verification, (req, res) => {
  res.json({ message: "This is a protected route", student: req.student });
});
app.use("/api/v1/refresh", authRoutes);
app.use("/api/v1/logout", authRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

