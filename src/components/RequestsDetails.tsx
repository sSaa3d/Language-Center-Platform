import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

interface RequestDetailsProps {
  request: Request;
  onBack: () => void;
  onStatusChange: (id: number, status: "approved" | "rejected") => void;
}

const RequestDetails = ({
  request,
  onBack,
  onStatusChange,
}: RequestDetailsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const getPlacementMatch = () => {
    const studentLevel = request.student.placementLevel;
    const courseLevel = request.course.level;

    if (studentLevel === courseLevel) {
      return {
        status: "perfect",
        message: "Perfect Match",
        color: "text-green-600",
      };
    } else if (
      (studentLevel === "Beginner" && courseLevel === "Intermediate") ||
      (studentLevel === "Intermediate" && courseLevel === "Advanced")
    ) {
      return {
        status: "good",
        message: "Good Match (Slightly Challenging)",
        color: "text-blue-600",
      };
    } else if (
      (studentLevel === "Intermediate" && courseLevel === "Beginner") ||
      (studentLevel === "Advanced" && courseLevel === "Intermediate")
    ) {
      return {
        status: "below",
        message: "Below Level (May Be Too Easy)",
        color: "text-yellow-600",
      };
    } else {
      return {
        status: "mismatch",
        message: "Level Mismatch",
        color: "text-red-600",
      };
    }
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Request Approved",
      description: `${request.student.name} has been enrolled in ${request.course.title}`,
      className: "bg-green-600 text-white",
    });
    setIsProcessing(false);
    onStatusChange(request.id, "approved"); // <-- Redirect and update status
  };

  const handleReject = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Request Rejected",
      description: `Enrollment request for ${request.student.name} has been rejected`,
      variant: "destructive",
    });
    setIsProcessing(false);
    onStatusChange(request.id, "rejected"); // <-- Redirect and update status
  };

  const placementMatch = getPlacementMatch();

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Requests
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Enrollment Request Details
            </h1>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              Submitted on {new Date(request.requestDate).toLocaleDateString()}
            </div>
          </div>
          <Badge className="bg-yellow-100 text-yellow-800">
            {request.status}
          </Badge>
        </div>
      </div>

      {/* Placement Match Banner */}
      <Card className="mb-6 border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {placementMatch.status === "perfect" && (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              )}
              {placementMatch.status === "good" && (
                <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
              )}
              {placementMatch.status === "below" && (
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              )}
              {placementMatch.status === "mismatch" && (
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <div>
                <h3 className="font-semibold">Placement Analysis</h3>
                <p className={`text-sm ${placementMatch.color}`}>
                  {placementMatch.message}
                </p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>
                Student Level:{" "}
                <span className="font-medium">
                  {request.student.placementLevel}
                </span>
              </p>
              <p>
                Course Level:{" "}
                <span className="font-medium">{request.course.level}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Student Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <div className="bg-blue-100 w-[40px] h-[40px] rounded-full flex items-center justify-center">
                <svg
                  className="w-[30px] h-fit text-green-500"
                  stroke="currentColor"
                  fill="none"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 12 21Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Full Name
              </label>
              <p className="text-gray-900">{request.student.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{request.student.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-900">{request.student.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Placement Score
              </label>
              <p className="text-gray-900">
                {request.student.placementScore}/100
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Recommended Level
              </label>
              <Badge
                className={`${
                  request.student.placementLevel === "Beginner"
                    ? "bg-green-100 text-green-800"
                    : request.student.placementLevel === "Intermediate"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {request.student.placementLevel}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Course Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-semibold">📚</span>
              </div>
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Course Title
              </label>
              <p className="text-gray-900 font-medium">
                {request.course.title}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Description
              </label>
              <p className="text-gray-900">{request.course.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Duration
              </label>
              <p className="text-gray-900">{request.course.duration}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Level</label>
              <Badge
                className={`${
                  request.course.level === "Beginner"
                    ? "bg-green-100 text-green-800"
                    : request.course.level === "Intermediate"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {request.course.level}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Review Decision
              </h3>
              <p className="text-sm text-gray-600">
                Choose to approve or reject this enrollment request
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleReject}
                disabled={isProcessing}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestDetails;
