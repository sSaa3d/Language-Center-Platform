import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EnrollmentModal from "@/components/EnrollmentModal";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setCourse(data))
      .catch(() => setCourse(undefined));
  }, [id]);

  if (course === undefined) return <div>Course not found.</div>;
  if (course === null) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{course.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <strong>Level:</strong> {course.level}
          </div>
          <div className="mb-4">
            <strong>Duration:</strong> {course.duration}
          </div>
          <div className="mb-4">
            <strong>Instructor:</strong> {course.instructor || "TBA"}
          </div>
          <div className="mb-4">
            <strong>Description:</strong>
            <div className="mt-1">{course.description}</div>
          </div>
          <div className="mb-4">
            <strong>Location:</strong> {course.location}
          </div>
          <div className="mb-4">
            <strong>Term:</strong> {course.term} {course.year}
          </div>
          <div className="mb-4">
            <strong>Attachments:</strong>
            {course.attachments && course.attachments.length > 0 ? (
              <ul className="mt-1 space-y-1">
                {course.attachments.map((att: any, idx: number) => (
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
              <span> — </span>
            )}
          </div>
          {/* Add more fields as needed */}
          <Button
            className="mt-6 bg-blue-600 text-white"
            onClick={() => setIsModalOpen(true)}
          >
            Enroll
          </Button>
          <Button
            variant="outline"
            className="ml-4"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </CardContent>
      </Card>
      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={course}
      />
    </div>
  );
};

export default CourseDetailsPage;
