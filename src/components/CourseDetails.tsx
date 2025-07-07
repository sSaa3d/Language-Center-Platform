import { ArrowLeft, Users, Clock, Calendar, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course";

interface CourseDetailsProps {
  course: Course;
  onBack: () => void;
  onEdit: (course: Course) => void;
  onDelete: (courseId: number) => void;
}

const CourseDetails = ({
  course,
  onBack,
  onEdit,
  onDelete,
}: CourseDetailsProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-8 w-8" /> {/* Increased size */}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(course)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Course
          </Button>
          <Button variant="destructive" onClick={() => onDelete(course.id)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Level
                </label>
                <div className="mt-1">
                  <Badge className={`${getLevelColor(course.level)} border`}>
                    {course.level}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Course ID
                </label>
                <p className="text-gray-900 mt-1">{course.id || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <p className="text-gray-900 mt-1 capitalize">{course.status}</p>
              </div>
              <div className="mb-16"></div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Start Date
                </label>
                <p className="text-gray-900 mt-1 font-medium">
                  {course.startDate}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  End Date
                </label>
                <p className="text-gray-900 mt-1 font-medium">
                  {course.endDate}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Students Enrolled
                </label>
                <p className="text-gray-900 mt-1">{course.students}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Max Students
                </label>
                <p className="text-gray-900 mt-1">
                  {course.maxStudents || "—"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Location
                </label>
                <p className="text-gray-900 mt-1">{course.location || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Meeting Days
                </label>
                <p className="text-gray-900 mt-1">
                  {course.meetingTime || "—"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Department
                </label>
                <p className="text-gray-900 mt-1">{course.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Waitlist
                </label>
                <p className="text-gray-900 mt-1">{course.waitlist || 0}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Start Time
                </label>
                <p className="text-gray-900 mt-1">{course.startTime || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  End Time
                </label>
                <p className="text-gray-900 mt-1">{course.endTime || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Term
                </label>
                <p className="text-gray-900 mt-1">
                  {course.term} {course.year}
                </p>
              </div>
              <div></div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Description
              </label>
              <p
                className="text-gray-900 mt-1 max-w-3xl break-words whitespace-pre-line p-2 border-2 rounded-md"
                style={{ wordBreak: "break-word" }}
              >
                {course.description ||
                  "No description available for this course."}
              </p>
            </div>
            <div className="mb-16">
              <label className="text-sm font-medium text-gray-500">
                Instructor
              </label>
              <p className="text-gray-900 mt-1 font-medium">
                {course.instructor || "TBA"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Attachments
              </label>
              {course.attachments && course.attachments.length > 0 ? (
                <ul className="mt-1 space-y-1">
                  {course.attachments.map((att, idx) => (
                    <li key={idx}>
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-600"
                      >
                        {att.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-900 mt-1">—</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Duration
                </div>
                <span className="font-medium">{course.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  Students
                </div>
                <span className="font-medium">{course.students}</span>
              </div>
              <div className="flex items-center justify-between"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
