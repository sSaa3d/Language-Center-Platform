import prisma from "../config/database.js";

export const getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: { enrolledCourses: true },
    });
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
