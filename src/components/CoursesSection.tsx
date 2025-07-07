import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, Users, Plus, Eye } from "lucide-react";
import CourseDetails from "./CourseDetails";
import CourseForm from "./CourseForm";
import { useToast } from "@/hooks/use-toast";
import { Course } from "@/types/course";

import { Edit, Trash2 } from "lucide-react";

type ViewMode = "list" | "details" | "form";

const CoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  // Fetch courses from backend
  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch(() => setCourses([]));
  }, []);

  // Utility to refresh courses after add/edit/delete
  const refreshCourses = () => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));
  };

  const handleSearch = (term: string) => {
    setIsSearching(true);
    setSearchTerm(term);
    setTimeout(() => setIsSearching(false), 300);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const search = searchTerm.toLowerCase();
      const matchesTitle = course.title.toLowerCase().includes(search);
      const matchesId = course.id?.toString().includes(searchTerm);
      const matchesLevel =
        selectedLevel === "All" || course.level === selectedLevel;
      return (matchesTitle || matchesId) && matchesLevel;
    });
  }, [searchTerm, selectedLevel, courses]);

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

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setViewMode("details");
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setViewMode("form");
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setViewMode("form");
  };

  // Save course (add or edit)
  const handleSaveCourse = async (
    savedCourse: Course,
    action: "add" | "update"
  ) => {
    toast({
      title: action === "add" ? "Course Created" : "Course Updated",
      description:
        action === "add"
          ? "New course has been successfully created."
          : "Course has been successfully updated.",
      className: action === "add" ? "bg-green-600 text-white" : undefined,
    });
    await refreshCourses();
    setViewMode("list");
    setEditingCourse(null);
  };

  // Delete course
  const handleDeleteCourse = async (courseId: number) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete course");
      toast({
        title: "Course Deleted",
        description: "Course has been successfully deleted.",
        variant: "destructive",
      });
      await refreshCourses();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete course.",
        variant: "destructive",
      });
    }
    setViewMode("list");
    setSelectedCourse(null);
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedCourse(null);
    setEditingCourse(null);
  };

  if (viewMode === "details" && selectedCourse) {
    return (
      <CourseDetails
        course={selectedCourse}
        onBack={handleBack}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
      />
    );
  }

  if (viewMode === "form") {
    return (
      <CourseForm
        course={editingCourse || undefined}
        onSave={handleSaveCourse}
        onCancel={handleBack}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-1">
            Manage and view all available courses
          </p>
        </div>
        <Button
          onClick={handleAddCourse}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Modern Filters */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search courses by name..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-white border-0 shadow-sm h-12"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                  className={
                    selectedLevel === level
                      ? "bg-blue-600 hover:bg-blue-700"
                      : ""
                  }
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isSearching && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Modern Courses Grid */}
      {!isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id ?? course.title + Math.random()}
              className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:-translate-y-1"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </CardTitle>
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEditCourse(course)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteCourse(course.id!)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Badge
                    className={`${getLevelColor(
                      course.level
                    )} border text-xs w-fit`}
                  >
                    {course.level}
                  </Badge>
                </div>

                {course.instructor && (
                  <p className="text-xs text-gray-500">
                    by {course.instructor}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      {course.students}
                      {course.maxStudents && (
                        <span className="ml-1 text-xs text-gray-400">
                          / {course.maxStudents}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>ID: {course.id}</span>
                    <span>
                      {course.term} {course.year}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {course.startDate} | {course.endDate}
                    </span>
                    <span>
                      {course.status === "open" ? "🟢 Open" : "🔴 Closed"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {course.location && (
                      <span>Location: {course.location}</span>
                    )}
                    {course.meetingTime && (
                      <span className="ml-2">({course.meetingTime})</span>
                    )}
                  </div>
                  <div className="pt-2">
                    <Button
                      onClick={() => handleViewCourse(course)}
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isSearching && filteredCourses.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500 text-lg">
              No courses found matching your criteria.
            </p>
            <Button
              onClick={handleAddCourse}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Course
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoursesSection;
