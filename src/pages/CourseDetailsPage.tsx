import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  CalendarDays,
  MapPin,
  Clock,
  Star,
  CheckCircle,
} from "lucide-react";
import EnrollmentModal from "@/components/EnrollmentModal";

const features = [
  {
    icon: <DownloadIcon className="h-5 w-5" />,
    text: "Downloadable resources",
  },
  {
    icon: <CheckCircle className="h-5 w-5" />,
    text: "Certificate of completion",
  },
  { icon: <Users className="h-5 w-5" />, text: "Community access" },
  { icon: <Clock className="h-5 w-5" />, text: "Lifetime access to materials" },
];

function DownloadIcon(props: any) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
    </svg>
  );
}

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then((res) => res.json())
      .then((courseData) => {
        // Only show courses that are open
        if (courseData.status === "open") {
          setCourse(courseData);
        } else {
          // Redirect to courses page if course is not open
          navigate("/courses");
        }
      })
      .catch(() => {
        // Redirect to courses page if course not found
        navigate("/courses");
      });
  }, [id, navigate]);

  if (!course) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Back to Courses Button */}
      <div className="max-w-7xl mx-auto pt-8 px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-700 font-medium mb-6 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Courses
        </button>
      </div>
      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Course Details */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8">
          {/* Recommended Courses Section (if applicable) */}
          {Array.isArray(course.recommendedCourses) &&
            course.recommendedCourses.length === 0 && (
              <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-center font-medium">
                There are no courses for the moment matching your level.
              </div>
            )}
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-black pb-1 text-white">{course.level}</Badge>
            <span className="text-sm text-gray-500">{course.duration}</span>
            <span className="flex items-center text-sm text-yellow-600 ml-2">
              <Star className="h-4 w-4 mr-1" /> {course.rating ?? 4.8} (
              {course.studentsEnrolled ?? 0} students)
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {course.title}
          </h1>
          <div className="flex items-center gap-6 text-gray-500 text-sm mb-6">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" /> {course.term} {course.year}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {course.location}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {course.studentsEnrolled ?? 0}{" "}
              enrolled
            </span>
          </div>
          {/* Image/Placeholder */}
          <div className="bg-gray-200 rounded-xl h-56 flex items-center justify-center mb-6">
            <BookOpen className="h-16 w-16 text-gray-400" />
          </div>
          <p className="text-gray-700 mb-8">{course.description}</p>
          {/* What You'll Learn */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" /> What You'll
              Learn
            </h2>
            <ul className="space-y-2">
              {(
                course.learningOutcomes ?? [
                  "English Language fundamentals",
                  "Hands-on practice",
                  "Challenging situations for training",
                  "Introduction to professional English",
                ]
              ).map((item: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
          {/* Attachments Card */}
          {Array.isArray(course.attachments) &&
            course.attachments.length > 0 && (
              <div className="mb-8">
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" /> Attachments
                  </h2>
                  <ul className="space-y-2">
                    {course.attachments.map((att: any, idx: number) => (
                      <li key={idx}>
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {att.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
        </div>
        {/* Right: Enrollment Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <Button
              className="w-full bg-black text-white font-semibold py-3 rounded-lg mb-4"
              onClick={() => setIsModalOpen(true)}
            >
              {course.price === 0 ? "Enroll for Free" : "Enroll Now"}
            </Button>
            <div className="text-sm text-gray-500 mb-2">
              Join {course.studentsEnrolled ?? 0} students already enrolled
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="font-semibold mb-2">What's included:</div>
              <ul className="space-y-2">
                {features.map((f, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    {f.icon} {f.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Instructor Card */}
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
            <div className="rounded-full bg-gray-200 h-14 w-14 flex items-center justify-center">
              {/* Instructor image or placeholder */}
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <div className="font-semibold">{course.instructor || "TBA"}</div>
              <div className="flex items-center gap-1 text-yellow-600 text-xs mt-1">
                <Star className="h-4 w-4" />
                &nbsp;{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={course}
      />
    </div>
  );
}
