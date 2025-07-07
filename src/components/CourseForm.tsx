import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save } from "lucide-react";
import { Course } from "../types/course";

type Attachment = { name: string; url: string } | File;

interface CourseFormProps {
  course?: Course;
  onSave: (course: Course, action: "add" | "update") => void;
  onCancel: () => void;
}

const CourseForm = ({ course, onSave, onCancel }: CourseFormProps) => {
  const [formData, setFormData] = useState({
    title: course?.title || "",
    level: course?.level || ("Beginner" as const),
    duration: course?.duration || "",
    description: course?.description || "",
    instructor: course?.instructor || "",
    startDate: course?.startDate || "",
    endDate: course?.endDate || "",
    maxStudents: course?.maxStudents || 0,
    location: course?.location || "",
    meetingTime: course?.meetingTime || "",
    attachments: (course?.attachments as Attachment[]) || [],
    department: course?.department || "LC",
    status: course?.status || "open",
    startTime: course?.startTime || "",
    endTime: course?.endTime || "",
    term: course?.term || "Fall",
    year: course?.year || new Date().getFullYear(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "attachments") {
        if (Array.isArray(value)) {
          value.forEach((fileOrObj: any) => {
            if (fileOrObj instanceof File) {
              form.append("attachments", fileOrObj);
            }
          });
          // If there are existing (non-File) attachments, send them as JSON
          const existing = value.filter((a: any) => !(a instanceof File));
          if (existing.length > 0) {
            form.append("attachments", JSON.stringify(existing));
          }
        }
      } else {
        form.append(key, value as any);
      }
    });

    try {
      const url =
        course && course.id ? `/api/courses/${course.id}` : "/api/courses";
      const method = course && course.id ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        body: form,
      });
      if (!response.ok)
        throw new Error(
          course && course.id
            ? "Failed to update course"
            : "Failed to add course"
        );
      const savedCourse = await response.json();
      onSave(savedCourse, course && course.id ? "update" : "add");
    } catch (err) {
      alert("Error saving course: " + (err as Error).message);
    }
  };

  const handleSaveCourse = async (courseData: Partial<Course>) => {
    const isEdit = !!courseData.id; // <-- check before sending

    const form = new FormData();
    Object.entries(courseData).forEach(([key, value]) => {
      if (key === "attachments" && Array.isArray(value)) {
        value.forEach((fileOrObj: any) => {
          if (fileOrObj instanceof File) {
            form.append("attachments", fileOrObj);
          }
        });
        const existing = value.filter((a: any) => !(a instanceof File));
        if (existing.length > 0) {
          form.append("attachments", JSON.stringify(existing));
        }
      } else if (value !== undefined) {
        form.append(key, value as any);
      }
    });

    const url = courseData.id
      ? `/api/courses/${courseData.id}`
      : "/api/courses";
    const method = courseData.id ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method,
        body: form,
      });
      if (!response.ok)
        throw new Error(
          isEdit ? "Failed to update course" : "Failed to add course"
        );
      // toast({
      //   title: isEdit ? "Course Updated" : "Course Created",
      //   description: isEdit
      //     ? "Course has been successfully updated."
      //     : "New course has been successfully created.",
      //   className: isEdit ? undefined : "bg-green-600 text-white",
      // });
      // refreshCourses();
    } catch (err) {
      // toast({
      //   title: "Error",
      //   description: isEdit ? "Failed to update course." : "Failed to add course.",
      //   variant: "destructive",
      // });
    }
    // setViewMode("list");
    // setEditingCourse(null);
  };

  const isEditing = !!course;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onCancel} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Edit Course" : "Add New Course"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? "Update course information" : "Create a new course"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter course title"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <Input
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="e.g., 8 weeks"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <div>Max Students</div>
                  <span className="text-md text-gray-500 ml-1">(Optional)</span>
                </label>
                <Input
                  type="number"
                  value={formData.maxStudents || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxStudents: Number(e.target.value),
                    })
                  }
                  min={0}
                />
              </div>
              <div></div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <Input
                  value={formData.location || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g., Room 101"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Days *
                </label>
                <Input
                  value={formData.meetingTime || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, meetingTime: e.target.value })
                  }
                  placeholder="e.g., MWF, TR"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="LC">LC</option>
                  {/* Add more departments as needed */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "open" | "closed",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <Input
                  type="time"
                  value={formData.startTime || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <Input
                  type="time"
                  value={formData.endTime || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term *
                </label>
                <select
                  value={formData.term}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      term: e.target.value as "Fall" | "Spring" | "Summer",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <Input
                  type="number"
                  value={formData.year || new Date().getFullYear()}
                  onChange={(e) =>
                    setFormData({ ...formData, year: Number(e.target.value) })
                  }
                  required
                  min={2000}
                  max={2100}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter a description for the course"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor
                  </label>
                  <Input
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, instructor: e.target.value })
                    }
                    placeholder="Instructor name (optional)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments
                </label>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="attachments-upload"
                    className="inline-block bg-black text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-800 transition"
                  >
                    Choose Files
                    <Input
                      id="attachments-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        // Combine new files with existing (non-File) attachments if editing
                        setFormData((prev) => ({
                          ...prev,
                          attachments: [
                            ...(prev.attachments?.filter(
                              (a: any) => !(a instanceof File)
                            ) || []),
                            ...files,
                          ],
                        }));
                      }}
                    />
                  </label>
                  {formData.attachments && formData.attachments.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData({ ...formData, attachments: [] })
                      }
                    >
                      Clear
                    </Button>
                  )}
                </div>
                {formData.attachments && formData.attachments.length > 0 && (
                  <ul className="mt-2 text-xs text-gray-600">
                    {formData.attachments.map((att: any, idx: number) => (
                      <li key={idx}>
                        {att instanceof File ? (
                          <span>{att.name}</span>
                        ) : (
                          <a
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {att.name}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? "Update Course" : "Create Course"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseForm;
