import prisma from "../config/database.js";
import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "../services/emailService.js";
import { isAdminNotificationEnabled } from "./adminController.js";

export const getRequests = async (req, res) => {
  try {
    const requests = await prisma.request.findMany({
      include: { course: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const requestId = Number(req.params.id);
    const comment = req.body.comment || "";
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { course: true },
    });
    if (!request) return res.status(404).json({ error: "Request not found" });

    // Use a transaction to ensure all updates happen together
    await prisma.$transaction(async (tx) => {
      // Check if student exists by email
      let student = await tx.student.findUnique({
        where: { email: request.email },
        include: { enrolledCourses: true },
      });

      if (student) {
        // Update existing student: add course and update info
        await tx.student.update({
          where: { id: student.id },
          data: {
            firstName: request.firstName,
            lastName: request.lastName,
            phone: request.phone,
            status: "active",
            studentLevel: request.studentLevel,
            approvedDate: new Date(),
            enrolledCourses: {
              connect: { id: request.courseId },
            },
            enrolledCourseIds: {
              push: request.courseId,
            },
          },
        });
      } else {
        // Create new student
        await tx.student.create({
          data: {
            firstName: request.firstName,
            lastName: request.lastName,
            email: request.email,
            phone: request.phone,
            status: "active",
            studentLevel: request.studentLevel,
            enrollmentDate: new Date(),
            approvedDate: new Date(),
            enrolledCourses: {
              connect: { id: request.courseId },
            },
            enrolledCourseIds: [request.courseId],
          },
        });
      }

      // Update request status to approved
      await tx.request.update({
        where: { id: requestId },
        data: {
          status: "approved",
          approvedDate: new Date(),
        },
      });

      // Update course: increment enrolled students and decrement waitlist
      await tx.course.update({
        where: { id: request.courseId },
        data: {
          students: { increment: 1 },
          waitlist: { decrement: 1 },
        },
      });
    });

    // Fetch the latest request with course after transaction
    const updatedRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: { course: true },
    });

    // Send approval email notification only if admin notifications are enabled
    try {
      if (isAdminNotificationEnabled()) {
        console.log("[EMAIL] Sending approval email to", updatedRequest.email);
        await sendApprovalEmail(updatedRequest, updatedRequest.course, comment);
      }
    } catch (emailErr) {
      console.error("Failed to send approval email:", emailErr);
      // Don't fail the request if email fails
    }

    res.json({ success: true, request: updatedRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const requestId = Number(req.params.id);
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { course: true },
    });
    if (!request) return res.status(404).json({ error: "Request not found" });

    // Use a transaction to ensure both request update and waitlist decrement happen together
    await prisma.$transaction(async (tx) => {
      // Update request status to rejected
      await tx.request.update({
        where: { id: requestId },
        data: {
          status: "rejected",
          rejectedDate: new Date(),
        },
      });

      // Decrement waitlist for the course
      await tx.course.update({
        where: { id: request.courseId },
        data: {
          waitlist: { decrement: 1 },
        },
      });
    });

    // Fetch the latest request with course after transaction
    const updatedRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: { course: true },
    });

    // Send rejection email notification
    try {
      console.log("[EMAIL] Sending rejection email to", updatedRequest.email);
      await sendRejectionEmail(updatedRequest, updatedRequest.course);
    } catch (emailErr) {
      console.error("Failed to send rejection email:", emailErr);
      // Don't fail the request if email fails
    }

    res.json({ success: true, request: updatedRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// New function to handle status changes with proper enrollment count management
export const changeRequestStatus = async (req, res) => {
  try {
    const requestId = Number(req.params.id);
    const { newStatus, comment } = req.body;

    if (!newStatus || !["approved", "rejected"].includes(newStatus)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Must be 'approved' or 'rejected'" });
    }

    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { course: true },
    });

    if (!request) return res.status(404).json({ error: "Request not found" });

    // Use a transaction to ensure all updates happen together
    await prisma.$transaction(async (tx) => {
      const currentStatus = request.status;
      if (currentStatus === "approved" && newStatus === "rejected") {
        // Remove student from course enrollment and decrement student count
        const student = await tx.student.findUnique({
          where: { email: request.email },
          include: { enrolledCourses: true },
        });
        if (student) {
          await tx.student.update({
            where: { id: student.id },
            data: {
              enrolledCourses: {
                disconnect: { id: request.courseId },
              },
              enrolledCourseIds: {
                set: student.enrolledCourseIds.filter(
                  (id) => id !== request.courseId
                ),
              },
            },
          });
          // After disconnect, check if student is enrolled in any courses
          const updatedStudent = await tx.student.findUnique({
            where: { id: student.id },
            include: { enrolledCourses: true },
          });
          if (
            !updatedStudent.enrolledCourses ||
            updatedStudent.enrolledCourses.length === 0
          ) {
            // If not enrolled in any courses, set status to inactive
            await tx.student.update({
              where: { id: student.id },
              data: {
                status: "inactive",
              },
            });
          }
        }
        // Decrement course student count and increment waitlist
        await tx.course.update({
          where: { id: request.courseId },
          data: {
            students: { decrement: 1 },
            waitlist: { increment: 1 },
          },
        });
        // Update request status
        await tx.request.update({
          where: { id: requestId },
          data: {
            status: "rejected",
            rejectedDate: new Date(),
            approvedDate: null, // Clear approved date
          },
        });
      } else if (currentStatus === "rejected" && newStatus === "approved") {
        // Check if student exists by email
        let student = await tx.student.findUnique({
          where: { email: request.email },
          include: { enrolledCourses: true },
        });
        if (student) {
          // Update existing student: add course and update info
          await tx.student.update({
            where: { id: student.id },
            data: {
              firstName: request.firstName,
              lastName: request.lastName,
              phone: request.phone,
              status: "active",
              studentLevel: request.studentLevel,
              approvedDate: new Date(),
              enrolledCourses: {
                connect: { id: request.courseId },
              },
              enrolledCourseIds: {
                push: request.courseId,
              },
            },
          });
        } else {
          // Create new student and connect course
          await tx.student.create({
            data: {
              firstName: request.firstName,
              lastName: request.lastName,
              email: request.email,
              phone: request.phone,
              status: "active",
              studentLevel: request.studentLevel,
              enrollmentDate: new Date(),
              approvedDate: new Date(),
              enrolledCourses: {
                connect: { id: request.courseId },
              },
              enrolledCourseIds: [request.courseId],
            },
          });
        }
        // Increment course student count and decrement waitlist
        await tx.course.update({
          where: { id: request.courseId },
          data: {
            students: { increment: 1 },
            waitlist: { decrement: 1 },
          },
        });
        // Update request status
        await tx.request.update({
          where: { id: requestId },
          data: {
            status: "approved",
            approvedDate: new Date(),
            rejectedDate: null, // Clear rejected date
          },
        });
      } else {
        return res.status(400).json({ error: "Invalid status change" });
      }
    });

    // Fetch the latest request with course after transaction
    const updatedRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: { course: true },
    });

    // Send email notification based on the new status
    try {
      if (newStatus === "approved" && isAdminNotificationEnabled()) {
        console.log("[EMAIL] Sending approval email to", updatedRequest.email);
        await sendApprovalEmail(updatedRequest, updatedRequest.course, comment);
      } else if (newStatus === "rejected") {
        console.log("[EMAIL] Sending rejection email to", updatedRequest.email);
        await sendRejectionEmail(updatedRequest, updatedRequest.course);
      }
    } catch (emailErr) {
      console.error("Failed to send status change email:", emailErr);
      // Don't fail the request if email fails
    }

    res.json({ success: true, request: updatedRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// New function to assign student to a different course
export const assignToDifferentCourse = async (req, res) => {
  try {
    const requestId = Number(req.params.id);
    const { newCourseId } = req.body;

    if (!newCourseId) {
      return res.status(400).json({ error: "New course ID is required" });
    }

    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { course: true },
    });

    if (!request) return res.status(404).json({ error: "Request not found" });

    // Check if the new course exists
    const newCourse = await prisma.course.findUnique({
      where: { id: Number(newCourseId) },
    });

    if (!newCourse) {
      return res.status(404).json({ error: "New course not found" });
    }

    // Use a transaction to ensure all updates happen together
    await prisma.$transaction(async (tx) => {
      const oldCourseId = request.courseId;

      // If the request was previously approved, we need to handle the enrollment changes
      if (request.status === "approved") {
        // Remove student from old course
        const student = await tx.student.findUnique({
          where: { email: request.email },
          include: { enrolledCourses: true },
        });

        if (student) {
          // Remove from old course
          await tx.student.update({
            where: { id: student.id },
            data: {
              enrolledCourses: {
                disconnect: { id: oldCourseId },
              },
              enrolledCourseIds: {
                set: student.enrolledCourseIds.filter(
                  (id) => id !== oldCourseId
                ),
              },
            },
          });

          // Add to new course
          await tx.student.update({
            where: { id: student.id },
            data: {
              enrolledCourses: {
                connect: { id: Number(newCourseId) },
              },
              enrolledCourseIds: {
                push: Number(newCourseId),
              },
            },
          });
        }

        // Update course enrollment counts
        await tx.course.update({
          where: { id: oldCourseId },
          data: {
            students: { decrement: 1 },
            waitlist: { increment: 1 },
          },
        });

        await tx.course.update({
          where: { id: Number(newCourseId) },
          data: {
            students: { increment: 1 },
            waitlist: { decrement: 1 },
          },
        });
      } else {
        // For pending/rejected requests, just update the waitlist counts
        await tx.course.update({
          where: { id: oldCourseId },
          data: {
            waitlist: { decrement: 1 },
          },
        });

        await tx.course.update({
          where: { id: Number(newCourseId) },
          data: {
            waitlist: { increment: 1 },
          },
        });
      }

      // Update the request with the new course
      await tx.request.update({
        where: { id: requestId },
        data: {
          courseId: Number(newCourseId),
        },
      });
    });

    // Fetch the updated request with the new course
    const updatedRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: { course: true },
    });

    res.json({ success: true, request: updatedRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
