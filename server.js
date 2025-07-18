import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

// Import routes
import {
  courseRoutes,
  enrollmentRoutes,
  requestRoutes,
  studentRoutes,
  adminRoutes,
  exportRoutes,
} from "./src/routes/index.js";

// Import middleware
import { logger } from "./src/middlewares/logger.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/courses", courseRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/exports", exportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
