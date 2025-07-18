import express from "express";
import {
  createEnrollment,
  checkEnrollment,
} from "../controllers/enrollmentController.js";

const router = express.Router();

router.post("/enroll", createEnrollment);
router.post("/check-enrollment", checkEnrollment);

export default router;
