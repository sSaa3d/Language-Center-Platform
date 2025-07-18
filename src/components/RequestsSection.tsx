import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight, RefreshCw, Search } from "lucide-react";
import RequestsDetails from "../components/RequestsDetails";
import CourseDetails from "../components/CourseDetails";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FILTERS = [
  {
    label: "Pending",
    value: "pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    label: "Approved",
    value: "approved",
    color: "bg-green-100 text-green-800",
  },
  { label: "Rejected", value: "rejected", color: "bg-red-100 text-red-800" },
];

const RequestsSection = () => {
  const [selectedFilter, setSelectedFilter] = useState("pending");
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewMode, setViewMode] = useState<"list" | "course-details">("list");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/requests")
      .then((res) => res.json())
      .then(setRequests);
  }, []);

  const getRequests = () => {
    return requests.filter((request) => request.status === selectedFilter);
  };

  // Filter requests by search term (student name or course name)
  const filteredRequestsBySearch = getRequests().filter((request) => {
    const search = searchTerm.toLowerCase();
    return (
      request.firstName?.toLowerCase().includes(search) ||
      request.lastName?.toLowerCase().includes(search) ||
      request.course?.title?.toLowerCase().includes(search)
    );
  });

  // Helper to check if a date is today, yesterday, or earlier
  const getDateLabel = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate();
    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return date.toLocaleDateString();
  };

  // Handler to update request status and return to list
  const handleStatusChange = (id, status) => {
    // Refresh requests data after status change to get latest information
    fetch("/api/requests")
      .then((res) => res.json())
      .then(setRequests)
      .catch(() => setRequests([]));

    setSelectedRequest(null);
  };

  // Handler to view course details
  const handleViewCourse = (courseId) => {
    // Fetch fresh course details and switch to course details view
    fetch(`/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((course) => {
        setSelectedCourse(course);
        setViewMode("course-details");
      })
      .catch((err) => {
        console.error("Failed to fetch course details:", err);
      });
  };

  const handleBackToRequests = () => {
    // Refresh requests when returning to list view
    fetch("/api/requests")
      .then((res) => res.json())
      .then(setRequests)
      .catch(() => setRequests([]));

    setViewMode("list");
    setSelectedRequest(null);
    setSelectedCourse(null);
  };

  if (viewMode === "course-details" && selectedCourse) {
    return (
      <CourseDetails
        course={selectedCourse}
        onBack={handleBackToRequests}
        onEdit={() => {}} // No edit functionality in this context
        onDelete={() => {}} // No delete functionality in this context
      />
    );
  }

  if (selectedRequest) {
    // Add status information based on the current filter
    const requestWithStatus = {
      ...selectedRequest,
      status: selectedFilter,
    };

    return (
      <RequestsDetails
        request={requestWithStatus}
        onBack={() => setSelectedRequest(null)}
        onStatusChange={handleStatusChange}
        onViewCourse={handleViewCourse}
      />
    );
  }

  // Modern filter UI
  const renderFilter = () => (
    <div className="flex gap-4 mb-8">
      {FILTERS.map((filter) => (
        <Button
          key={filter.value}
          className={`rounded-full px-6 py-2 font-semibold transition-colors ${
            selectedFilter === filter.value
              ? `${filter.color} shadow`
              : "bg-gray-100 text-gray-600"
          }`}
          onClick={() => setSelectedFilter(filter.value)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );

  // Render requests for the selected filter
  const renderRequests = () => {
    const filteredRequests = filteredRequestsBySearch;
    if (filteredRequests.length === 0) {
      return (
        <div className="text-gray-400 mb-6">No {selectedFilter} requests.</div>
      );
    }

    // For all statuses, split into 'Recent' (today/yesterday) and 'Earlier'
    const today = new Date();
    const isToday = (dateString) => {
      if (!dateString) return false;
      const date = new Date(dateString);
      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    };
    const isYesterday = (dateString) => {
      if (!dateString) return false;
      const date = new Date(dateString);
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return (
        date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getDate() === yesterday.getDate()
      );
    };
    let getActionDate = (request) => request.createdAt;
    if (selectedFilter === "approved")
      getActionDate = (request) => request.approvedDate;
    if (selectedFilter === "rejected")
      getActionDate = (request) => request.rejectedDate;
    // Sort both arrays by date descending (most recent first)
    const recent = filteredRequests
      .filter((r) => isToday(getActionDate(r)) || isYesterday(getActionDate(r)))
      .sort((a, b) => {
        const dateA = new Date(getActionDate(a)).getTime();
        const dateB = new Date(getActionDate(b)).getTime();
        return dateB - dateA;
      });
    const earlier = filteredRequests
      .filter(
        (r) => !isToday(getActionDate(r)) && !isYesterday(getActionDate(r))
      )
      .sort((a, b) => {
        const dateA = new Date(getActionDate(a)).getTime();
        const dateB = new Date(getActionDate(b)).getTime();
        return dateB - dateA;
      });
    return (
      <>
        {recent.length > 0 && (
          <div className="mb-2">
            <div className="text-xs font-semibold text-gray-500 mb-2">
              Recent
            </div>
            <div className="grid gap-4">
              {recent.map((request) => (
                <Card
                  key={request.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedRequest(request)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {request.firstName} {request.lastName}
                        </h3>
                        <p className="text-gray-600 mb-2 font-bold">
                          Course: {request.course?.title || "—"}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          {(() => {
                            const dateString = getActionDate(request);
                            const date = dateString
                              ? new Date(dateString)
                              : null;
                            const label = isToday(dateString)
                              ? "Today"
                              : isYesterday(dateString)
                              ? "Yesterday"
                              : date?.toLocaleDateString();
                            const time = date
                              ? date.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "";
                            return (
                              <>
                                {label} {time && `| ${time}`}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={
                            FILTERS.find((f) => f.value === selectedFilter)
                              .color
                          }
                        >
                          {
                            FILTERS.find((f) => f.value === selectedFilter)
                              .label
                          }
                        </Badge>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {earlier.length > 0 && (
          <div className="mt-4">
            <div className="text-xs font-semibold text-gray-500 mb-2">
              Earlier
            </div>
            <div className="grid gap-4">
              {earlier.map((request) => (
                <Card
                  key={request.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedRequest(request)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {request.firstName} {request.lastName}
                        </h3>
                        <p className="text-gray-600 mb-2 font-bold">
                          Course: {request.course?.title || "—"}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          {(() => {
                            const dateString = getActionDate(request);
                            const date = dateString
                              ? new Date(dateString)
                              : null;
                            const label = date?.toLocaleDateString();
                            const time = date
                              ? date.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "";
                            return (
                              <>
                                {label} {time && `| ${time}`}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={
                            FILTERS.find((f) => f.value === selectedFilter)
                              .color
                          }
                        >
                          {
                            FILTERS.find((f) => f.value === selectedFilter)
                              .label
                          }
                        </Badge>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const refreshRequests = () => {
    setIsRefreshing(true);
    fetch("/api/requests")
      .then((res) => res.json())
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => {
        setTimeout(() => setIsRefreshing(false), 500);
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Requests</h1>
          <p className="text-gray-600 mt-1">
            Manage and review all student requests
          </p>
        </div>
        <Button
          onClick={refreshRequests}
          variant="outline"
          className="flex items-center gap-2"
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Modern Filters */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search requests by student or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-0 shadow-sm h-12"
              />
            </div>
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <Button
                  key={filter.value}
                  variant={
                    selectedFilter === filter.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedFilter(filter.value)}
                  className={
                    selectedFilter === filter.value
                      ? "bg-blue-600 hover:bg-blue-700"
                      : ""
                  }
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      {renderRequests()}
    </div>
  );
};

export default RequestsSection;
