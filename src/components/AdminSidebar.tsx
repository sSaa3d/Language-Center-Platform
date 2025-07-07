import { BookOpen, Users, ClipboardList, Home, Settings, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "students", label: "Students", icon: Users },
    { id: "requests", label: "Requests", icon: ClipboardList },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">EduTest</span>
            <p className="text-xs text-slate-300">Admin Panel</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start mb-4 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          onClick={() => window.location.href = '/'}
        >
          <Home className="mr-3 h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="space-y-1 mt-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
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
                    ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700" 
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className={`mr-3 h-4 w-4 ${isActive ? "text-white" : ""}`} />
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
  );
};

export default AdminSidebar;
