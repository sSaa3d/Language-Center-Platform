import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight } from "lucide-react";
import RequestsDetails from "../components/RequestsDetails";

interface Course {
  id: number;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  description: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  placementScore: number;
  placementLevel: "Beginner" | "Intermediate" | "Advanced";
}

interface Request {
  id: number;
  student: Student;
  course: Course;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
}

// Enhanced mock data with placement information
const initialRequests: Request[] = [
  {
    id: 1,
    student: {
      id: 1,
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+1 (555) 123-4567",
      placementScore: 75,
      placementLevel: "Intermediate",
    },
    course: {
      id: 1,
      title: "React Fundamentals",
      level: "Intermediate",
      duration: "8 weeks",
      description:
        "Learn the fundamentals of React including components, state management, and hooks.",
    },
    requestDate: "2024-01-15",
    status: "pending",
  },
  {
    id: 2,
    student: {
      id: 2,
      name: "David Brown",
      email: "david.brown@email.com",
      phone: "+1 (555) 987-6543",
      placementScore: 92,
      placementLevel: "Advanced",
    },
    course: {
      id: 2,
      title: "Advanced JavaScript",
      level: "Intermediate",
      duration: "10 weeks",
      description:
        "Master advanced JavaScript concepts including closures, prototypes, and async programming.",
    },
    requestDate: "2024-01-18",
    status: "pending",
  },
  {
    id: 3,
    student: {
      id: 3,
      name: "Lisa Garcia",
      email: "lisa.garcia@email.com",
      phone: "+1 (555) 456-7890",
      placementScore: 45,
      placementLevel: "Beginner",
    },
    course: {
      id: 3,
      title: "Python Basics",
      level: "Beginner",
      duration: "6 weeks",
      description:
        "Introduction to Python programming language covering syntax, data types, and basic algorithms.",
    },
    requestDate: "2024-01-20",
    status: "pending",
  },
];

const RequestsSection = () => {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  // Handler to update request status and return to list
  const handleStatusChange = (id: number, status: "approved" | "rejected") => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
    setSelectedRequest(null);
  };

  if (selectedRequest) {
    return (
      <RequestsDetails
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
        onStatusChange={handleStatusChange}
      />
    );
  }

  // Split requests by status
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const approvedRequests = requests.filter((r) => r.status === "approved");
  const rejectedRequests = requests.filter((r) => r.status === "rejected");

  // Helper to render a section
  const renderSection = (
    title: string,
    reqs: Request[],
    badgeClass: string
  ) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {reqs.length === 0 ? (
        <div className="text-gray-400 mb-6">No {title.toLowerCase()}.</div>
      ) : (
        <div className="grid gap-4">
          {reqs.map((request) => (
            <Card
              key={request.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedRequest(request)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {request.student.name}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Course: {request.course.title}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      Submitted:{" "}
                      {new Date(request.requestDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Placement:</span>
                      <Badge variant="outline" className="text-xs">
                        {request.student.placementLevel}
                      </Badge>
                      <span className="text-gray-400">→</span>
                      <Badge variant="outline" className="text-xs">
                        {request.course.level}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={badgeClass}>
                      {title.replace("Requests", "").trim()}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Enrollment Requests
        </h1>
        <p className="text-gray-600">
          Review and manage student enrollment requests
        </p>
      </div>
      {renderSection(
        "Requests Pending",
        pendingRequests,
        "bg-yellow-100 text-yellow-800"
      )}
      {renderSection(
        "Requests Approved",
        approvedRequests,
        "bg-green-100 text-green-800"
      )}
      {renderSection(
        "Requests Rejected",
        rejectedRequests,
        "bg-red-100 text-red-800"
      )}
    </div>
  );
};

export default RequestsSection;
