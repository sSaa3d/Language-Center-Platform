
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, Plus, UserPlus, Eye, Settings } from "lucide-react";

interface DashboardSectionProps {
  onSectionChange?: (section: string) => void;
}

const DashboardSection = ({ onSectionChange }: DashboardSectionProps) => {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch(() => setCourses([]));
  }, []);

  // Mock data - in a real app this would come from an API
  const stats = {
    totalStudents: 1,
    totalCourses: 3,
    pendingRequests: 1,
    approvedStudents: 0,
    rejectedStudents: 0,
    averageCourseDuration: 8,
  };

  const recentActivity = [
    { id: 1, type: "enrollment", message: "John Doe enrolled in React Fundamentals", time: "2 hours ago" },
    { id: 2, type: "course", message: "New course 'Advanced JavaScript' was added", time: "1 day ago" },
    { id: 3, type: "approval", message: "Sarah Smith's enrollment was approved", time: "2 days ago" },
  ];

  const courseStats = [
    { level: "Beginner", count: 1, color: "bg-green-500" },
    { level: "Intermediate", count: 1, color: "bg-yellow-500" },
    { level: "Advanced", count: 1, color: "bg-red-500" },
  ];

  const quickActions = [
    {
      title: "Add New Course",
      description: "Create a new course",
      icon: Plus,
      action: () => onSectionChange?.("courses"),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "View Requests",
      description: "Review pending enrollments",
      icon: Eye,
      action: () => onSectionChange?.("requests"),
      color: "bg-yellow-500 hover:bg-yellow-600"
    },
    {
      title: "Manage Students",
      description: "View all students",
      icon: Users,
      action: () => onSectionChange?.("students"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Course Overview",
      description: "Manage all courses",
      icon: BookOpen,
      action: () => onSectionChange?.("courses"),
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your education platform</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageCourseDuration}w
            </div>
            <p className="text-xs text-purple-100">Course length</p>
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
            <div className="space-y-4">
              {courseStats.map((course) => (
                <div
                  key={course.level}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${course.color}`}></div>
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <span className="text-lg font-bold">{course.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSection;
