import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
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
  enrolledCourses: Course[];
  studentLevel: string;
  status: "active" | "inactive";
  enrollmentDate: string; // ISO date string
  approvedDate?: string; // ISO date string, only if approved
  enrolledCourseIds: number[];
}

const StudentsSection = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) =>
        Array.isArray(data) ? setStudents(data) : setStudents([])
      )
      .catch(() => setStudents([]));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
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

  const refreshStudents = () => {
    setIsRefreshing(true);
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) =>
        Array.isArray(data) ? setStudents(data) : setStudents([])
      )
      .catch(() => setStudents([]))
      .finally(() => {
        setTimeout(() => setIsRefreshing(false), 500);
      });
  };

  // Filter students by any attribute
  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(search) ||
      student.lastName.toLowerCase().includes(search) ||
      student.email.toLowerCase().includes(search) ||
      student.phone.toLowerCase().includes(search) ||
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Students</h1>
            <p className="text-gray-600">
              View and manage all registered students
            </p>
          </div>
          <Button
            onClick={refreshStudents}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
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
                    ID
                  </th>
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
                      <td className="py-4 px-6 text-gray-900">{student.id}</td>
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
                      <td className="py-4 px-6 text-gray-600">
                        {(student.enrolledCourses ?? []).length} courses
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {student.studentLevel}
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
