import express from "express";
import { setAdminNotificationPreference } from "../controllers/adminController.js";

const router = express.Router();

// POST /api/admin/notifications
router.post("/notifications", setAdminNotificationPreference);

export default router;
