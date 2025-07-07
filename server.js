import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // <-- Add this line
import multer from "multer";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

dotenv.config();

const app = express();
app.use(cors()); // <-- Add this line
app.use(express.json());

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to uploads/ folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Example route to get all courses
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { attachments: true },
    });
    res.json(courses);
  } catch (err) {
    console.error(err); // <--- Add this line
    res.status(500).json({ error: err.message });
  }
});

// Update POST route to handle file uploads
app.post("/api/courses", upload.any(), async (req, res) => {
  try {
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map((file) => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`,
      }));
    }
    if (req.body.attachments) {
      try {
        const parsed = JSON.parse(req.body.attachments);
        if (Array.isArray(parsed)) attachments = attachments.concat(parsed);
      } catch {}
    }
    const { attachments: _ignored, ...courseData } = req.body;
    if (courseData.maxStudents)
      courseData.maxStudents = Number(courseData.maxStudents);
    if (courseData.year) courseData.year = Number(courseData.year);
    if (!courseData.students) courseData.students = 0; // ADD THIS LINE

    const course = await prisma.course.create({
      data: {
        ...courseData,
        attachments: {
          create: attachments,
        },
      },
      include: { attachments: true },
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update PUT route to handle file uploads (for editing)
app.put("/api/courses/:id", upload.any(), async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map((file) => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`,
      }));
    }
    if (req.body.attachments) {
      try {
        const parsed = JSON.parse(req.body.attachments);
        if (Array.isArray(parsed)) attachments = attachments.concat(parsed);
      } catch {}
    }
    const { attachments: _ignored, ...courseData } = req.body;
    if (courseData.maxStudents)
      courseData.maxStudents = Number(courseData.maxStudents);
    if (courseData.year) courseData.year = Number(courseData.year);
    if (!courseData.students) courseData.students = 0; // ADD THIS LINE

    // Remove old attachments and add new ones
    await prisma.attachment.deleteMany({ where: { courseId } });

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        ...courseData,
        attachments: {
          create: attachments,
        },
      },
      include: { attachments: true },
    });
    res.json(updatedCourse); // <-- Make sure this is the ONLY response
  } catch (err) {
    console.error(err); // <-- Add this for debugging
    res.status(400).json({ error: err.message });
  }
});

// Delete a course by ID
app.delete("/api/courses/:id", async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    await prisma.attachment.deleteMany({ where: { courseId } });
    await prisma.course.delete({ where: { id: courseId } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/courses/:id", async (req, res) => {
  const courseId = Number(req.params.id);
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { attachments: true },
  });
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }
  res.json(course);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
