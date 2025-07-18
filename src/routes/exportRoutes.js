import express from "express";
import {
  exportStudentsCSV,
  exportCoursesCSV,
  exportEnrollmentsCSV,
} from "../controllers/exportController.js";

const router = express.Router();

router.get("/students", exportStudentsCSV);
router.get("/courses", exportCoursesCSV);
router.get("/enrollments", exportEnrollmentsCSV);

export default router;
