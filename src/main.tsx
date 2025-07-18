import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initToolbar } from "@stagewise/toolbar";
import { StudentLevelProvider } from "./contexts/StudentLevelContext";

createRoot(document.getElementById("root")!).render(
  <StudentLevelProvider>
    <App />
  </StudentLevelProvider>
);

// 1. Import the toolbar
// 2. Define your toolbar configuration
const stagewiseConfig = {
  plugins: [],
};

// 3. Initialize the toolbar when your app starts
// Framework-agnostic approach - call this when your app initializes
function setupStagewise() {
  // Only initialize once and only in development mode
  if (process.env.NODE_ENV === "development") {
    initToolbar(stagewiseConfig);
  }
}

// Call the setup function when appropriate for your framework
setupStagewise();
