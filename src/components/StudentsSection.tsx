import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import StudentDetails from "./StudentDetails";

interface Course {
  id: number;
  title: string;
  category: string;
  duration: string;
  status: "active" | "completed" | "pending";
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  enrolledCourses: Course[];
  placementTestLevel: "Beginner" | "Intermediate" | "Advanced";
  enrollmentDate: string; // ISO date string
  approvedDate?: string; // ISO date string, only if approved
}

const mockStudents: Student[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    status: "approved",
    placementTestLevel: "Beginner",
    enrollmentDate: "2024-06-01",
    approvedDate: "2024-06-03",
    enrolledCourses: [
      {
        id: 1,
        title: "React Fundamentals",
        category: "Beginner",
        duration: "4 weeks",
        status: "active",
      },
      {
        id: 2,
        title: "JavaScript Basics",
        category: "Beginner",
        duration: "3 weeks",
        status: "completed",
      },
    ],
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@email.com",
    phone: "(555) 234-5678",
    status: "pending",
    placementTestLevel: "Intermediate",
    enrollmentDate: "2024-06-05",
    enrolledCourses: [
      {
        id: 3,
        title: "Advanced JavaScript",
        category: "Advanced",
        duration: "6 weeks",
        status: "pending",
      },
    ],
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.j@email.com",
    phone: "(555) 345-6789",
    status: "rejected",
    placementTestLevel: "Beginner",
    enrollmentDate: "2024-06-10",
    enrolledCourses: [],
  },
  {
    id: 4,
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah.w@email.com",
    phone: "(555) 456-7890",
    status: "approved",
    placementTestLevel: "Advanced",
    enrollmentDate: "2024-06-15",
    approvedDate: "2024-06-17",
    enrolledCourses: [
      {
        id: 4,
        title: "Python Basics",
        category: "Beginner",
        duration: "5 weeks",
        status: "active",
      },
      {
        id: 5,
        title: "Data Structures",
        category: "Intermediate",
        duration: "8 weeks",
        status: "active",
      },
    ],
  },
  {
    id: 5,
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@email.com",
    phone: "(555) 567-8901",
    status: "pending",
    placementTestLevel: "Intermediate",
    enrollmentDate: "2024-06-20",
    enrolledCourses: [
      {
        id: 6,
        title: "Web Development",
        category: "Intermediate",
        duration: "12 weeks",
        status: "pending",
      },
    ],
  },
  {
    id: 6,
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@email.com",
    phone: "(555) 678-9012",
    status: "approved",
    placementTestLevel: "Advanced",
    enrollmentDate: "2024-06-25",
    approvedDate: "2024-06-27",
    enrolledCourses: [
      {
        id: 7,
        title: "UI/UX Design",
        category: "Intermediate",
        duration: "6 weeks",
        status: "completed",
      },
      {
        id: 8,
        title: "Advanced CSS",
        category: "Advanced",
        duration: "4 weeks",
        status: "active",
      },
    ],
  },
  {
    id: 7,
    firstName: "Chris",
    lastName: "Miller",
    email: "chris.m@email.com",
    phone: "(555) 789-0123",
    status: "rejected",
    placementTestLevel: "Beginner",
    enrollmentDate: "2024-07-01",
    enrolledCourses: [],
  },
  {
    id: 8,
    firstName: "Lisa",
    lastName: "Garcia",
    email: "lisa.garcia@email.com",
    phone: "(555) 890-1234",
    status: "pending",
    placementTestLevel: "Advanced",
    enrollmentDate: "2024-07-05",
    enrolledCourses: [
      {
        id: 9,
        title: "Mobile Development",
        category: "Advanced",
        duration: "10 weeks",
        status: "pending",
      },
    ],
  },
];

const StudentsSection = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
  };

  // Filter students by any attribute
  const filteredStudents = mockStudents.filter((student) => {
    const search = searchTerm.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(search) ||
      student.lastName.toLowerCase().includes(search) ||
      student.email.toLowerCase().includes(search) ||
      student.phone.toLowerCase().includes(search) ||
      student.status.toLowerCase().includes(search) ||
      student.placementTestLevel.toLowerCase().includes(search) ||
      student.enrollmentDate?.toLowerCase().includes(search) ||
      student.approvedDate?.toLowerCase().includes(search) ||
      student.enrolledCourses.some((course) =>
        `${course.title} ${course.category} ${course.duration} ${course.status}`
          .toLowerCase()
          .includes(search)
      )
    );
  });

  if (selectedStudent) {
    return (
      <StudentDetails student={selectedStudent} onBack={handleBackToList} />
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Students</h1>
        <p className="text-gray-600">View and manage all registered students</p>
      </div>

      {/* Search Bar (styled like Courses) */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search students by any attribute..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-0 shadow-sm h-12"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    First Name
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Last Name
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Phone
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Courses
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Placement Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-gray-500 text-lg"
                    >
                      No students found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      className={`border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                      onClick={() => handleStudentClick(student)}
                    >
                      <td className="py-4 px-6 text-gray-900">
                        {student.firstName}
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {student.lastName}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {student.email}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {student.phone}
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          className={`${getStatusColor(
                            student.status
                          )} capitalize`}
                        >
                          {student.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {student.enrolledCourses.length} courses
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {student.placementTestLevel}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsSection;
