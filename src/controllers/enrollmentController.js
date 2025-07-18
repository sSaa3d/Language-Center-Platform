import prisma from "../config/database.js";
import { sendEnrollmentEmail } from "../services/emailService.js";
import { isAdminNotificationEnabled } from "./adminController.js";

export const createEnrollment = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      age,
      comment,
      courseId,
      studentLevel,
    } = req.body;

    // Use a transaction to ensure both request creation and waitlist increment happen together
    const result = await prisma.$transaction(async (tx) => {
      // Create the request
      const request = await tx.request.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          age: Number(age),
          comment,
          courseId: Number(courseId),
          studentLevel,
        },
      });

      // Increment the waitlist count for the course
      await tx.course.update({
        where: { id: Number(courseId) },
        data: {
          waitlist: { increment: 1 },
        },
      });

      return request;
    });

    // Fetch course details for email
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    });

    // Send email notification only if admin notifications are enabled
    if (isAdminNotificationEnabled()) {
      await sendEnrollmentEmail(
        { firstName, lastName, email, phone, age, studentLevel, comment },
        course
      );
    }

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const checkEnrollment = async (req, res) => {
  try {
    const { email, courseId } = req.body;
    if (!email || !courseId) {
      return res.status(400).json({ error: "Missing email or courseId" });
    }
    const student = await prisma.student.findUnique({
      where: { email },
      include: { enrolledCourses: true },
    });
    if (!student) {
      return res.json({ enrolled: false });
    }
    const alreadyEnrolled = student.enrolledCourses.some(
      (course) => course.id === Number(courseId)
    );
    res.json({ enrolled: alreadyEnrolled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
