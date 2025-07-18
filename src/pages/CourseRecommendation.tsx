import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  Infinity,
} from "lucide-react";
import EnrollmentModal from "@/components/EnrollmentModal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

import { Users, MapPin, CalendarDays } from "lucide-react";
import { useStudentLevel } from "@/contexts/StudentLevelContext";

const CourseRecommendation = () => {
  const [searchParams] = useSearchParams();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const rawLevel = searchParams.get("level") || "Intermediate";
  const level =
    rawLevel.charAt(0).toUpperCase() + rawLevel.slice(1).toLowerCase();

  const { setStudentLevel } = useStudentLevel();

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setStudentLevel(level);
  }, [level, setStudentLevel]);

  const handleEnroll = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // Filter courses to only show "open" status courses
  const openCourses = courses.filter((course) => course.status === "open");

  // Filter recommended courses to only those matching the user's level and are open
  const recommendedCourses = openCourses.filter(
    (course) => course.level === level
  );

  const allLevels = Array.from(new Set(openCourses.map((c) => c.level)));
  const otherLevels = allLevels.filter((l) => l !== level);

  const CourseCard = ({
    course,
    isRecommended = false,
    size = "normal",
  }: {
    course: any;
    isRecommended?: boolean;
    size?: "normal" | "large";
  }) => (
    <Card
      className={`flex flex-col h-full bg-white/90 backdrop-blur border-0 shadow-lg hover:shadow-2xl transition-all duration-300 ${
        isRecommended ? "ring-2 ring-blue-500/50" : ""
      } ${size === "large" ? "col-span-1 md:col-span-2 lg:col-span-1" : ""}`}
      onClick={() => navigate(`/courses/${course.id}`)}
      style={{ cursor: "pointer" }}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-3">
          <CardTitle
            className={`${
              size === "large" ? "text-2xl" : "text-xl"
            } text-gray-900 font-bold`}
          >
            {course.title}
          </CardTitle>
          {isRecommended && (
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          <p className="text-gray-600 mb-6 leading-relaxed text-base">
            {course.description}
          </p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{course.duration}</span>
            </div>
            <Badge variant="outline" className="text-sm px-3 py-1 font-medium">
              {course.level}
            </Badge>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              <span>
                {course.studentsEnrolled ?? 0}/
                {course.maxStudents ? (
                  course.maxStudents
                ) : (
                  <span className="flex items-center">
                    <Infinity className="h-3 w-3" />
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays className="h-4 w-4" />
              <span>
                {course.term} {course.year}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>{course.location}</span>
            </div>
          </div>
        </div>
        <Button
          className={`mt-auto w-full ${
            isRecommended ? "bgblack" : "bg-gray-800 hover:bg-gray-900"
          } text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg`}
        >
          💡 Enroll Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </header>

      {/* Hero Section with Recommended Courses */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Personalized Banner */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              🎉 Congratulations!
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              Based on your test score, we recommend starting with
            </p>
            <Badge className="bg-black text-white text-2xl px-8 py-3 font-bold rounded-full">
              {level.charAt(0).toUpperCase() + level.slice(1)} Level
            </Badge>
          </div>

          {/* Recommended Courses - Big Background Section */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 md:p-12 mb-20 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Your Recommended Courses
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                These courses are perfectly tailored to your current skill level
                and will help you achieve your learning goals.
              </p>
            </div>

            {/* Show message if no recommended courses for this level */}
            {recommendedCourses.length === 0 && (
              <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-center font-medium">
                There are no courses for the moment matching your level.
              </div>
            )}

            {/* Horizontal slider for all recommended courses */}
            <Carousel className="relative w-full max-w-5xl mx-auto">
              <CarouselPrevious />
              <CarouselContent>
                {recommendedCourses.map((course) => (
                  <CarouselItem
                    key={course.id}
                    className="basis-1/2 md:basis-1/3 px-2"
                  >
                    <CourseCard
                      course={course}
                      isRecommended={true}
                      size="large"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext />
            </Carousel>
          </div>

          {/* Other Available Courses */}
          <div className="space-y-16">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Other Available Courses
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore courses from other levels to continue your learning
                journey or challenge yourself further.
              </p>
            </div>

            {otherLevels.length === 0 && (
              <div className="text-center text-gray-500">
                No other levels available.
              </div>
            )}

            {otherLevels.map((levelName) => {
              const levelCourses = openCourses.filter(
                (course) => course.level === levelName
              );
              if (levelCourses.length === 0) return null;
              return (
                <div key={levelName} className="space-y-8">
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {levelName} Courses
                      </h3>
                      <Badge variant="outline" className="text-sm px-4 py-1">
                        {levelName === "Beginner"
                          ? "Foundation Building"
                          : levelName === "Advanced"
                          ? "Next Challenge"
                          : "Alternative Path"}
                      </Badge>
                    </div>
                    <div className="h-px bg-gray-300 flex-1"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {levelCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        isRecommended={false}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
      />
    </div>
  );
};

export default CourseRecommendation;
