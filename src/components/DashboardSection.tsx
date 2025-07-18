import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Plus,
  UserPlus,
  Eye,
  Settings,
  RefreshCw,
} from "lucide-react";

interface DashboardSectionProps {
  onSectionChange?: (section: string) => void;
}

const DashboardSection = ({ onSectionChange }: DashboardSectionProps) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [students, setStudents] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch(() => setCourses([]));
  }, []);

  useEffect(() => {
    fetch("/api/requests")
      .then((res) => res.json())
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch(() => setRequests([]));
  }, []);

  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(Array.isArray(data) ? data : []))
      .catch(() => setStudents([]));
  }, []);

  // Function to refresh all dashboard data
  const refreshDashboardData = () => {
    setIsRefreshing(true);
    // Refresh courses
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch(() => setCourses([]));

    // Refresh requests
    fetch("/api/requests")
      .then((res) => res.json())
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch(() => setRequests([]));

    // Refresh students
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(Array.isArray(data) ? data : []))
      .catch(() => setStudents([]))
      .finally(() => {
        setTimeout(() => setIsRefreshing(false), 500);
      });
  };

  // Calculate stats from requests data
  const stats = {
    totalStudents: students.length,
    totalCourses: courses.length,
    pendingRequests: requests.filter((r) => r.status === "pending").length,
    approvedStudents: students.length,
    rejectedStudents: requests.filter((r) => r.status === "rejected").length,
    averageCourseDuration: 8,
  };

  const recentActivity = [
    {
      id: 1,
      type: "enrollment",
      message: "John Doe enrolled in React Fundamentals",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "course",
      message: "New course 'Advanced JavaScript' was added",
      time: "1 day ago",
    },
    {
      id: 3,
      type: "approval",
      message: "Sarah Smith's enrollment was approved",
      time: "2 days ago",
    },
  ];

  const levelCounts = courses.reduce((acc, course) => {
    acc[course.level] = (acc[course.level] || 0) + 1;
    return acc;
  }, {});

  const courseStats = Object.entries(levelCounts).map(([level, count]) => ({
    level,
    count,
    color:
      level === "Beginner"
        ? "bg-green-500"
        : level === "Intermediate"
        ? "bg-yellow-500"
        : "bg-red-500",
  }));

  // Utility to calculate donut chart segments
  const getDonutSegments = (statsArr) => {
    const total = statsArr.reduce((sum, s) => sum + s.count, 0);
    let cumulative = 0;
    return statsArr.map((s) => {
      const value = s.count / total;
      const startAngle = cumulative * 360;
      const endAngle = (cumulative + value) * 360;
      cumulative += value;
      return {
        ...s,
        startAngle,
        endAngle,
        percent: Math.round(value * 100),
      };
    });
  };

  const donutSegments = getDonutSegments(courseStats);

  // Helper to describe an SVG arc
  function describeArc(cx, cy, r, startAngle, endAngle) {
    const rad = (deg) => (Math.PI * deg) / 180;
    const x1 = cx + r * Math.cos(rad(startAngle - 90));
    const y1 = cy + r * Math.sin(rad(startAngle - 90));
    const x2 = cx + r * Math.cos(rad(endAngle - 90));
    const y2 = cy + r * Math.sin(rad(endAngle - 90));
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return [`M ${x1} ${y1}`, `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`].join(
      " "
    );
  }

  const quickActions = [
    {
      title: "Add New Course",
      description: "Create a new course",
      icon: Plus,
      action: () => onSectionChange?.("courses"),
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "View Requests",
      description: "Review pending enrollments",
      icon: Eye,
      action: () => onSectionChange?.("requests"),
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      title: "Manage Students",
      description: "View all students",
      icon: Users,
      action: () => onSectionChange?.("students"),
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Course Overview",
      description: "Manage all courses",
      icon: BookOpen,
      action: () => onSectionChange?.("courses"),
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your education platform</p>
        </div>
        <Button
          onClick={refreshDashboardData}
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.title}
                  onClick={action.action}
                  className={`h-auto p-4 flex flex-col items-center gap-3 text-white ${action.color} transition-all duration-200 hover:scale-105`}
                >
                  <Icon className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs opacity-90">
                      {action.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center mx-auto">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-blue-100">Active learners</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-green-100">Available courses</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <Clock className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-yellow-100">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Approved</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {stats.approvedStudents}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">Pending</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">
                  {stats.pendingRequests}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium">Rejected</span>
                </div>
                <span className="text-lg font-bold text-red-600">
                  {stats.rejectedStudents}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-[140px] h-[140px] mb-4">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <g>
                    {donutSegments.map((seg, i) => {
                      const path = describeArc(
                        70,
                        70,
                        60,
                        seg.startAngle,
                        seg.endAngle
                      );
                      return (
                        <path
                          key={seg.level}
                          d={`${path}`}
                          fill="none"
                          stroke={
                            seg.level === "Beginner"
                              ? "#22c55e"
                              : seg.level === "Intermediate"
                              ? "#eab308"
                              : "#ef4444"
                          }
                          strokeWidth="20"
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </g>
                  {/* Center circle for background */}
                  <circle cx="70" cy="70" r="40" fill="#fff" />
                </svg>
                {/* Centered BookOpen icon */}
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <BookOpen className="w-8 h-8 text-purple-500" />
                </span>
              </div>
              {/* Legend */}
              <div className="flex flex-col gap-2 w-full">
                {donutSegments.map((seg) => (
                  <div key={seg.level} className="flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded"
                      style={{
                        backgroundColor:
                          seg.level === "Beginner"
                            ? "#22c55e"
                            : seg.level === "Intermediate"
                            ? "#eab308"
                            : "#ef4444",
                      }}
                    ></span>
                    <span className="font-medium text-sm flex-1">
                      {String(seg.level)}
                    </span>
                    <span className="text-xs font-semibold text-gray-600">
                      {seg.count} ({seg.percent}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        {/* <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  {activity.type === "enrollment" && (
                    <Users className="h-5 w-5 text-blue-600" />
                  )}
                  {activity.type === "course" && (
                    <BookOpen className="h-5 w-5 text-green-600" />
                  )}
                  {activity.type === "approval" && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent> */}
      </Card>
    </div>
  );
};

export default DashboardSection;
