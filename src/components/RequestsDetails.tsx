import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Users,
  User,
  Clock,
  MapPin,
  Mail,
  Phone as PhoneIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
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
  studentLevel: "Beginner" | "Intermediate" | "Advanced";
}

interface Request {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  comment?: string;
  courseId: number;
  createdAt: string;
  studentLevel: string;
  approvedDate?: string;
  rejectedDate?: string;
  course: {
    id: number;
    title: string;
    level: string;
    duration: string;
    description: string;
  };
  status?: "pending" | "approved" | "rejected";
}

interface RequestDetailsProps {
  request: Request;
  onBack: () => void;
  onStatusChange: (id: number, status: "approved" | "rejected") => void;
  onViewCourse?: (courseId: number) => void;
}

const RequestDetails = ({
  request,
  onBack,
  onStatusChange,
  onViewCourse,
}: RequestDetailsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    null | "approve" | "reject"
  >(null);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [showCourseAssignment, setShowCourseAssignment] = useState(false);
  const [isAssigningCourse, setIsAssigningCourse] = useState(false);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<any>(null);
  const [showCourseConfirmation, setShowCourseConfirmation] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [pendingCourseId, setPendingCourseId] = useState("");
  const [showConfirmAssign, setShowConfirmAssign] = useState(false);
  const [assignComment, setAssignComment] = useState("");
  const { toast } = useToast();

  const getPlacementMatch = () => {
    if (!request.course?.level || !request.studentLevel) {
      return {
        status: "unknown",
        message: "Level information not available for comparison.",
        color: "text-gray-600",
      };
    }

    if (request.studentLevel === request.course.level) {
      return {
        status: "perfect",
        message: "Perfect Match: Student and course levels align.",
        color: "text-green-600",
      };
    } else {
      return {
        status: "mismatch",
        message: "Level Mismatch: Student and course levels do not match.",
        color: "text-red-600",
      };
    }
  };

  const handleApprove = () => setConfirmAction("approve");
  const handleReject = () => setConfirmAction("reject");
  const handleChangeToApproved = () => setConfirmAction("approve");
  const handleChangeToRejected = () => setConfirmAction("reject");

  // Fetch available courses for assignment
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        const courses = await response.json();
        // Filter out the current course and only show open courses
        const filteredCourses = courses.filter(
          (course: any) =>
            course.id !== request.courseId && course.status === "open"
        );
        setAvailableCourses(filteredCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    if (showCourseModal) {
      fetchCourses();
    }
  }, [showCourseModal, request.courseId]);

  // Handle course assignment
  const handleAssignCourse = async () => {
    if (!selectedCourseId) {
      toast({
        title: "No Course Selected",
        description: "Please select a course to assign the student to.",
        variant: "destructive",
      });
      return;
    }

    setIsAssigningCourse(true);
    try {
      const response = await fetch(
        `/api/requests/${request.id}/assign-course`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newCourseId: selectedCourseId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign course");
      }

      const result = await response.json();

      toast({
        title: "Course Assigned Successfully",
        description: `Student has been assigned to the new course.`,
        className: "bg-green-600 text-white",
      });

      // Refresh the request data
      if (request.status === "approved" || request.status === "rejected") {
        onStatusChange(request.id, request.status);
      }
      setShowCourseAssignment(false);
      setSelectedCourseId("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssigningCourse(false);
    }
  };

  // Handle course selection to show details first
  const handleCourseSelection = (courseId: string) => {
    setSelectedCourseId(courseId);
    const selectedCourse = availableCourses.find(
      (course) => course.id.toString() === courseId
    );
    if (selectedCourse) {
      setSelectedCourseDetails(selectedCourse);
      setShowCourseConfirmation(true);
    }
  };

  // Handle course selection display (just updates the UI)
  const handleSelectCourse = () => {
    if (!selectedCourseId) {
      toast({
        title: "No Course Selected",
        description: "Please select a course first.",
        variant: "destructive",
      });
      return;
    }

    const selectedCourse = availableCourses.find(
      (course) => course.id.toString() === selectedCourseId
    );
    if (selectedCourse) {
      setSelectedCourseDetails(selectedCourse);
      setShowCourseConfirmation(true);
      setShowCourseAssignment(false);
      toast({
        title: "Course Selected",
        description:
          "Course details have been updated. Click 'Confirm Assignment' to finalize.",
        className: "bg-blue-600 text-white",
      });
    }
  };

  // Handle course confirmation
  const handleConfirmCourseAssignment = async () => {
    if (!pendingCourseId) {
      toast({
        title: "No Course Selected",
        description: "Please select a course to assign the student to.",
        variant: "destructive",
      });
      return;
    }
    setIsAssigningCourse(true);
    try {
      // Assign course
      const assignRes = await fetch(
        `/api/requests/${request.id}/assign-course`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newCourseId: pendingCourseId,
            comment: assignComment || getDefaultAssignComment(),
          }),
        }
      );
      if (!assignRes.ok) throw new Error("Failed to assign course");

      // If rejected, also approve
      if (request.status === "rejected") {
        const approveRes = await fetch(
          `/api/requests/${request.id}/approve`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              comment: assignComment || getDefaultAssignComment(),
            }),
          }
        );
        if (!approveRes.ok) throw new Error("Failed to approve request");
      }

      toast({
        title: "Course Assigned & Request Approved",
        description: `Student has been assigned and approved for the new course.`,
        className: "bg-green-600 text-white",
      });
      // Reset all states
      setShowCourseAssignment(false);
      setShowConfirmAssign(false);
      setPendingCourseId("");
      setAssignComment("");
      setSelectedCourseDetails(null);
      // Refresh the request data and update status to approved
      onStatusChange(request.id, "approved");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign course and approve. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssigningCourse(false);
    }
  };

  const placementMatch = getPlacementMatch();

  // In the course details card, update the displayed course info if showConfirmAssign is true and pendingCourseId is set
  const selectedCourseForDisplay =
    showConfirmAssign && pendingCourseId
      ? availableCourses.find((c) => c.id.toString() === pendingCourseId)
      : null;
  // Default comment for assignment
  const getDefaultAssignComment = () => {
    if (!pendingCourseId) return "";
    const course = availableCourses.find(
      (c) => c.id.toString() === pendingCourseId
    );
    if (!course) return "";
    return `The course you chose wasn't your level and you were assigned ${course.title} same as your level ${request.studentLevel}.`;
  };

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
              {request.status === "pending" && (
                <>
                  Submitted on{" "}
                  {new Date(request.createdAt).toLocaleDateString()} |{" "}
                  {new Date(request.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </>
              )}
              {request.status === "approved" && (
                <>
                  Approved on{" "}
                  {request.approvedDate
                    ? new Date(request.approvedDate).toLocaleDateString()
                    : "—"}{" "}
                  |{" "}
                  {request.approvedDate
                    ? new Date(request.approvedDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </>
              )}
              {request.status === "rejected" && (
                <>
                  Rejected on{" "}
                  {request.rejectedDate
                    ? new Date(request.rejectedDate).toLocaleDateString()
                    : "—"}{" "}
                  |{" "}
                  {request.rejectedDate
                    ? new Date(request.rejectedDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </>
              )}
            </div>
          </div>
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
              {placementMatch.status === "mismatch" && (
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              {placementMatch.status === "unknown" && (
                <AlertCircle className="h-5 w-5 text-gray-600 mr-2" />
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
                <span className="font-medium">{request.studentLevel}</span>
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
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <div className="bg-blue-100 w-[40px] h-[40px] rounded-full flex items-center justify-center">
                {/* Student icon as in sidebar */}
                <Users className="w-[30px] h-[30px] text-green-500" />
              </div>
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Full Name
              </label>
              <p className="text-gray-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                {request.firstName} {request.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                {request.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-900 flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-green-700" />
                {request.phone}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Student Level
              </label>
              <Badge
                className={
                  request.studentLevel === "Beginner"
                    ? "bg-green-100 text-green-800 border-green-200 ml-2"
                    : request.studentLevel === "Intermediate"
                    ? "bg-blue-100 text-blue-800 border-blue-200 ml-2"
                    : "bg-purple-100 text-purple-800 border-purple-200 ml-2"
                }
              >
                {request.studentLevel}
              </Badge>
            </div>
            {request.comment && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Comment
                </label>
                <p className="text-gray-900">{request.comment}</p>
              </div>
            )}
            {request.createdAt && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Request Created At
                </label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  {new Date(request.createdAt).toLocaleString()}
                </p>
              </div>
            )}
            {request.approvedDate && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Approved Date
                </label>
                <p className="text-gray-900 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {new Date(request.approvedDate).toLocaleString()}
                </p>
              </div>
            )}
            {request.rejectedDate && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Rejected Date
                </label>
                <p className="text-gray-900 flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  {new Date(request.rejectedDate).toLocaleString()}
                </p>
              </div>
            )}
            {/* Removed View Student Details button */}
          </CardContent>
        </Card>

        {/* Course Information */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <BookOpen className="text-green-600 font-semibold h-6 w-6" />
              </div>
              Course Information
              {showConfirmAssign && selectedCourseForDisplay && (
                <Badge className="ml-2 bg-blue-100 text-blue-800">
                  New Assignment
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Course Title
              </label>
              <p className="text-gray-900 font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-green-600" />
                {showConfirmAssign && selectedCourseForDisplay
                  ? selectedCourseForDisplay.title
                  : request.course?.title || "—"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Description
              </label>
              <p className="text-gray-900">
                {showConfirmAssign && selectedCourseForDisplay
                  ? selectedCourseForDisplay.description
                  : request.course?.description || "—"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Duration
              </label>
              <p className="text-gray-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                {showConfirmAssign && selectedCourseForDisplay
                  ? selectedCourseForDisplay.duration
                  : request.course?.duration || "—"}
              </p>
            </div>
            {/* Term (merged year and term) */}
            {("term" in (request.course || {}) ||
              "year" in (request.course || {})) && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Term
                </label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  {"term" in (request.course || {})
                    ? (request.course as any).term
                    : ""}
                  {"year" in (request.course || {})
                    ? ` ${(request.course as any).year}`
                    : ""}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500 mr-2">
                Level
              </label>
              <Badge
                className={`${
                  (showConfirmAssign && selectedCourseForDisplay
                    ? selectedCourseForDisplay.level
                    : request.course?.level) === "Beginner"
                    ? "bg-green-100 text-green-800"
                    : (showConfirmAssign && selectedCourseForDisplay
                        ? selectedCourseForDisplay.level
                        : request.course?.level) === "Intermediate"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {showConfirmAssign && selectedCourseForDisplay
                  ? selectedCourseForDisplay.level
                  : request.course?.level || "—"}
              </Badge>
            </div>
            {/* Instructor with icon */}
            {"instructor" in (request.course || {}) &&
              (request.course as any).instructor && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Instructor
                  </label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-orange-500" />
                    {(request.course as any).instructor}
                  </p>
                </div>
              )}
            {/* Period (start and end date merged) */}
            {("startDate" in (request.course || {}) ||
              "endDate" in (request.course || {})) && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Period
                </label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  {"startDate" in (request.course || {})
                    ? (request.course as any).startDate || "—"
                    : "—"}
                  <span className="mx-1">→</span>
                  {"endDate" in (request.course || {})
                    ? (request.course as any).endDate || "—"
                    : "—"}
                </p>
              </div>
            )}
            {/* Students/Waitlist merged */}
            {("students" in (request.course || {}) ||
              "maxStudents" in (request.course || {})) && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Enrolled / Max
                </label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  {"students" in (request.course || {})
                    ? (request.course as any).students ?? 0
                    : 0}
                  {"maxStudents" in (request.course as any) &&
                  typeof (request.course as any).maxStudents === "number" ? (
                    <>
                      /<span>{(request.course as any).maxStudents}</span>
                    </>
                  ) : null}
                </p>
              </div>
            )}
            <div className="pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (onViewCourse) {
                    onViewCourse(request.course?.id);
                  } else {
                    window.location.href = `/admin/courses/${request.course?.id}`;
                  }
                }}
                className="w-full flex items-center justify-center gap-2"
                disabled={!request.course?.id}
              >
                <ExternalLink className="h-4 w-4" />
                View Course Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons - Only show for pending requests */}
      {(!request.status || request.status === "pending") && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
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
              <div className="flex flex-col items-end mt-2">
                {!showConfirmAssign && (
                  <Button
                    variant="outline"
                    onClick={() => setShowCourseModal(true)}
                    disabled={isProcessing}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    Assign Course
                  </Button>
                )}
                {showConfirmAssign && (
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      onClick={async () => {
                        setIsAssigningCourse(true);
                        try {
                          // Assign course
                          const assignRes = await fetch(
                            `/api/requests/${request.id}/assign-course`,
                            {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                newCourseId: pendingCourseId,
                                comment:
                                  assignComment || getDefaultAssignComment(),
                              }),
                            }
                          );
                          if (!assignRes.ok)
                            throw new Error("Failed to assign course");
                          // Approve request
                          const approveRes = await fetch(
                            `/api/requests/${request.id}/approve`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                comment:
                                  assignComment || getDefaultAssignComment(),
                              }),
                            }
                          );
                          if (!approveRes.ok)
                            throw new Error("Failed to approve request");
                          toast({
                            title: "Course Assigned & Request Approved",
                            description: `Student has been assigned and approved for the new course.`,
                            className: "bg-green-600 text-white",
                          });
                          setShowConfirmAssign(false);
                          setPendingCourseId("");
                          setShowCourseModal(false);
                          onBack();
                        } catch (error) {
                          toast({
                            title: "Error",
                            description:
                              "Failed to assign course and approve. Please try again.",
                            variant: "destructive",
                          });
                        } finally {
                          setIsAssigningCourse(false);
                        }
                      }}
                      disabled={isAssigningCourse}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isAssigningCourse ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirm
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowConfirmAssign(false);
                        setPendingCourseId("");
                        setAssignComment("");
                      }}
                      disabled={isAssigningCourse}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Card for approved/rejected requests */}
      {(request.status === "approved" || request.status === "rejected") && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Request Status
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  This request has been{" "}
                  <Badge
                    className={
                      request.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {request.status === "approved" ? "Approved" : "Rejected"}
                  </Badge>
                </p>
              </div>
              <div className="flex gap-2">
                {request.status === "approved" ? (
                  <Button
                    variant="outline"
                    onClick={handleChangeToRejected}
                    disabled={isProcessing}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    size="sm"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Change to Rejected
                  </Button>
                ) : (
                  <Button
                    onClick={handleChangeToApproved}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Change to Approved
                  </Button>
                )}
                {showConfirmAssign ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleConfirmCourseAssignment}
                      disabled={isAssigningCourse}
                      className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-4"
                      size="sm"
                    >
                      {isAssigningCourse ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirm
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowConfirmAssign(false);
                        setPendingCourseId("");
                        setAssignComment("");
                        setSelectedCourseId("");
                        setSelectedCourseDetails(null);
                      }}
                      disabled={isAssigningCourse}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50 h-10 px-4"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowCourseModal(true)}
                    disabled={isProcessing}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 h-10 px-4"
                    size="sm"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Assign Course
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">
              {confirmAction === "approve"
                ? request.status === "rejected"
                  ? "Change to Approved"
                  : "Approve Request"
                : request.status === "approved"
                ? "Change to Rejected"
                : "Reject Request"}
            </h2>
            <p className="mb-6">
              Are you sure you want to{" "}
              {confirmAction === "approve"
                ? request.status === "rejected"
                  ? "change this request to approved"
                  : "approve this enrollment request"
                : request.status === "approved"
                ? "change this request to rejected"
                : "reject this enrollment request"}
              ?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={async () => {
                  setIsProcessing(true);
                  try {
                    // Check if this is a status change (not initial approval/rejection)
                    const isStatusChange =
                      (confirmAction === "approve" &&
                        request.status === "rejected") ||
                      (confirmAction === "reject" &&
                        request.status === "approved");

                    if (isStatusChange) {
                      // Use the new status change endpoint
                      const newStatus =
                        confirmAction === "approve" ? "approved" : "rejected";
                      await fetch(`/api/requests/${request.id}/status`, {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ newStatus }),
                      });
                    } else {
                      // Use the original approve/reject endpoints for initial decisions
                      if (confirmAction === "approve") {
                        await fetch(`/api/requests/${request.id}/approve`, {
                          method: "POST",
                        });
                      } else {
                        await fetch(`/api/requests/${request.id}/reject`, {
                          method: "POST",
                        });
                      }
                    }

                    toast({
                      title:
                        confirmAction === "approve"
                          ? request.status === "rejected"
                            ? "Status Changed to Approved"
                            : "Request Approved"
                          : request.status === "approved"
                          ? "Status Changed to Rejected"
                          : "Request Rejected",
                      description:
                        confirmAction === "approve"
                          ? request.status === "rejected"
                            ? `${request.firstName} ${request.lastName}'s request has been changed to approved`
                            : `${request.firstName} ${request.lastName} has been enrolled in ${request.course.title}`
                          : request.status === "approved"
                          ? `${request.firstName} ${request.lastName}'s request has been changed to rejected`
                          : `Enrollment request for ${request.firstName} ${request.lastName} has been rejected`,
                      className:
                        confirmAction === "approve"
                          ? "bg-green-600 text-white"
                          : undefined,
                      variant:
                        confirmAction === "reject" ? "destructive" : undefined,
                    });
                    onStatusChange(
                      request.id,
                      confirmAction === "approve" ? "approved" : "rejected"
                    );
                  } catch (err) {
                    toast({
                      title: "Error",
                      description: "Something went wrong. Please try again.",
                      variant: "destructive",
                    });
                  }
                  setIsProcessing(false);
                  setConfirmAction(null);
                }}
                disabled={isProcessing}
                className={
                  confirmAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                {confirmAction === "approve" ? "Approve" : "Reject"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setConfirmAction(null)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Course Assignment Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg min-h-[500px] w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              Assign Course
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Select a different course to assign this student to:
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Courses
                </label>
                <Select
                  value={pendingCourseId}
                  onValueChange={(val) => {
                    setPendingCourseId(val);
                    setAssignComment("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{course.title}</span>
                          <span className="text-sm text-gray-500">
                            {course.level} • {course.duration}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                  Comment to Student
                </label>
                <textarea
                  className="w-full border rounded p-2 text-sm mb-2"
                  rows={5}
                  value={assignComment}
                  onChange={(e) => setAssignComment(e.target.value)}
                  placeholder={getDefaultAssignComment()}
                  disabled={!pendingCourseId}
                />
                {availableCourses.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No other courses available for assignment.
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <Button
                onClick={() => {
                  if (!pendingCourseId) {
                    toast({
                      title: "No Course Selected",
                      description: "Please select a course first.",
                      variant: "destructive",
                    });
                    return;
                  }
                  // If no comment entered, use default
                  if (!assignComment)
                    setAssignComment(getDefaultAssignComment());
                  setShowCourseModal(false);
                  setShowConfirmAssign(true);
                }}
                disabled={!pendingCourseId}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Select
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCourseModal(false);
                  setPendingCourseId("");
                  setAssignComment("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetails;
