import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import DashboardSection from "@/components/DashboardSection";
import CoursesSection from "@/components/CoursesSection";
import StudentsSection from "@/components/StudentsSection";
import RequestsSection from "@/components/RequestsSection";
import { BookOpen } from "lucide-react";

const ADMIN_USER = "admin123";
const ADMIN_PASS = "admin123123";

const Admin = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(section || "dashboard");
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Update URL when section changes
  const handleSectionChange = (newSection: string) => {
    setActiveSection(newSection);
    navigate(`/admin/${newSection}`);
  };

  // Update active section when URL changes
  useEffect(() => {
    if (section && section !== activeSection) {
      setActiveSection(section);
    }
  }, [section, activeSection]);

  // Redirect to dashboard if no section is specified
  useEffect(() => {
    if (!section && authenticated) {
      navigate("/admin/dashboard");
    }
  }, [section, authenticated, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "courses":
        return <CoursesSection />;
      case "students":
        return <StudentsSection />;
      case "requests":
        return <RequestsSection />;
      case "logs":
        return <h1>LOGS</h1>;
      default:
        return <DashboardSection onSectionChange={handleSectionChange} />;
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        {/* Header */}
        <header className="px-6 py-4"></header>
        {/* Centered Login Card */}
        <div className="flex-1 flex items-center justify-center">
          <form
            onSubmit={handleLogin}
            className="bg-white backdrop-blur p-8 rounded-2xl shadow-xl w-96 flex flex-col gap-6 border border-blue-100"
          >
            <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">
              Admin Login
            </h2>
            <p className="text-center text-gray-500 mb-2">
              Enter your admin credentials to access the dashboard.
            </p>
            <input
              type="text"
              placeholder="Username"
              className="border border-blue-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-blue-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">{renderSection()}</div>
      </main>
    </div>
  );
};

export default Admin;
