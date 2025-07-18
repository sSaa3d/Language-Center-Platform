import express from "express";
import {
  getRequests,
  approveRequest,
  rejectRequest,
  changeRequestStatus,
  assignToDifferentCourse,
} from "../controllers/requestController.js";

const router = express.Router();

router.get("/", getRequests);
router.post("/:id/approve", approveRequest);
router.post("/:id/reject", rejectRequest);
router.put("/:id/status", changeRequestStatus);
router.put("/:id/assign-course", assignToDifferentCourse);

export default router;
