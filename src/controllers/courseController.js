import prisma from "../config/database.js";
import { getCanvasCourseBySisId } from "../services/canvasService.js";

export const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { attachments: true },
    });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { attachments: true },
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCourse = async (req, res) => {
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
    if (!courseData.students) courseData.students = 0;

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
};

export const updateCourse = async (req, res) => {
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
    if (!courseData.students) courseData.students = 0;

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
    res.json(updatedCourse);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    await prisma.attachment.deleteMany({ where: { courseId } });
    await prisma.course.delete({ where: { id: courseId } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const fetchCanvasCourse = async (req, res) => {
  try {
    const { sisId } = req.params;
    const token = process.env.CANVAS_API_TOKEN; // Store your token in .env
    const course = await getCanvasCourseBySisId(sisId, token);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};