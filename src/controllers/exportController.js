import prisma from "../config/database.js";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";

const EXPORTS_DIR = path.join(process.cwd(), "exports");

export const exportStudentsCSV = async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    const csvWriter = createObjectCsvWriter({
      path: path.join(EXPORTS_DIR, "students.csv"),
      header: [
        { id: "id", title: "ID" },
        { id: "firstName", title: "First Name" },
        { id: "lastName", title: "Last Name" },
        { id: "email", title: "Email" },
        { id: "phone", title: "Phone" },
        { id: "status", title: "Status" },
        { id: "studentLevel", title: "Level" },
        { id: "enrollmentDate", title: "Enrollment Date" },
      ],
    });
    await csvWriter.writeRecords(students);
    res.json({ success: true, file: "/exports/students.csv" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const exportCoursesCSV = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    const csvWriter = createObjectCsvWriter({
      path: path.join(EXPORTS_DIR, "courses.csv"),
      header: [
        { id: "id", title: "ID" },
        { id: "name", title: "Name" },
        { id: "description", title: "Description" },
        { id: "level", title: "Level" },
        { id: "students", title: "Students" },
        { id: "waitlist", title: "Waitlist" },
        { id: "maxStudents", title: "Max Students" },
        { id: "year", title: "Year" },
      ],
    });
    await csvWriter.writeRecords(courses);
    res.json({ success: true, file: "/exports/courses.csv" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const exportEnrollmentsCSV = async (req, res) => {
  try {
    const enrollments = await prisma.request.findMany({
      include: { course: true },
    });
    const csvWriter = createObjectCsvWriter({
      path: path.join(EXPORTS_DIR, "enrollments.csv"),
      header: [
        { id: "id", title: "ID" },
        { id: "firstName", title: "First Name" },
        { id: "lastName", title: "Last Name" },
        { id: "email", title: "Email" },
        { id: "courseName", title: "Course" },
        { id: "studentLevel", title: "Level" },
        { id: "status", title: "Status" },
        { id: "createdAt", title: "Requested At" },
      ],
    });
    const records = enrollments.map((e) => ({
      id: e.id,
      firstName: e.firstName,
      lastName: e.lastName,
      email: e.email,
      courseName: e.course ? e.course.name : "",
      studentLevel: e.studentLevel,
      status: e.status,
      createdAt: e.createdAt,
    }));
    await csvWriter.writeRecords(records);
    res.json({ success: true, file: "/exports/enrollments.csv" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
