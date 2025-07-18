
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  status: "active" | "inactive";
  enrolledCourses: Course[];
  enrolledCourseIds: number[];
}

interface StudentDetailsProps {
  student: Student;
  onBack: () => void;
}

const StudentDetails = ({ student, onBack }: StudentDetailsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {student.firstName} {student.lastName}
        </h1>
        <p className="text-gray-600">Student Details</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Student Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-gray-900">{student.firstName} {student.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{student.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-900">{student.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge className={`${getStatusColor(student.status)} capitalize`}>
                  {student.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enrolled Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Enrolled Courses ({student.enrolledCourses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {student.enrolledCourses.length > 0 ? (
              <div className="space-y-3">
                {student.enrolledCourses.map((course) => (
                  <div key={course.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <Badge className={`${getStatusColor(course.status)} capitalize text-xs`}>
                        {course.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Category: {course.category}</p>
                    <p className="text-sm text-gray-600">Duration: {course.duration}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No courses enrolled</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDetails;
