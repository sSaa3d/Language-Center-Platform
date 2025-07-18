import express from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  fetchCanvasCourse,
} from "../controllers/courseController.js";
import upload from "../config/upload.js";

const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", upload.any(), createCourse);
router.put("/:id", upload.any(), updateCourse);
router.delete("/:id", deleteCourse);
router.get("/canvas/:sisId", fetchCanvasCourse);

export default router;
