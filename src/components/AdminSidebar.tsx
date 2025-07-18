import {
  BookOpen,
  Users,
  ClipboardList,
  Home,
  Settings,
  BarChart3,
  Bell,
  BellOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar = ({
  activeSection,
  onSectionChange,
}: AdminSidebarProps) => {
  const [notifOn, setNotifOn] = useState(() => {
    const stored = localStorage.getItem("adminNotifOn");
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    localStorage.setItem("adminNotifOn", notifOn.toString());
  }, [notifOn]);

  const handleNotifToggle = async () => {
    setNotifOn((prev) => {
      const newVal = !prev;
      // Fire and forget API call
      fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newVal }),
      });
      return newVal;
    });
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "students", label: "Students", icon: Users },
    { id: "requests", label: "Requests", icon: ClipboardList },
    { id: "logs", label: "Logs", icon: Settings },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 z-20 border-r-2 border-gray-200 flex flex-col justify-between bg-white">
      <div>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 text-white p-2 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start mb-4 hover:bg-slate-200 transition-colors"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="mr-3 h-4 w-4" />
            Back to Home
          </Button>

          <div className="space-y-1 mt-6">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-3">
              Management
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start h-11 transition-all duration-200 ${
                    isActive
                      ? "bg-green-600 text-white shadow-lg hover:bg-green-600"
                      : "text-slate-700 hover:bg-slate-200"
                  }`}
                  onClick={() => onSectionChange(item.id)}
                >
                  <Icon
                    className={`mr-3 h-4 w-4 ${isActive ? "text-white" : ""}`}
                  />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto w-1 h-1 bg-white rounded-full"></div>
                  )}
                </Button>
              );
            })}
          </div>
        </nav>
      </div>
      {/* Notification button at the bottom */}
      <div className="p-6 flex items-center justify-center mt-auto">
        <button
          onClick={handleNotifToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-white font-semibold text-sm duration-300 ${
            notifOn
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
          title={notifOn ? "Email notifications ON" : "Email notifications OFF"}
          aria-label="Toggle admin email notifications"
        >
          {notifOn ? (
            <Bell className="h-5 w-5 text-white" fill="white" />
          ) : (
            <BellOff className="h-5 w-5 text-white" fill="white" />
          )}
          <span>Notifications</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
