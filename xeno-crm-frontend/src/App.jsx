import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Segments from "./pages/Segments";
import CampaignStudio from "./pages/CampaignStudio";
import Analytics from "./pages/Analytics";

import Navbar from "./components/Navbar";

function App() {
  const [theme, setTheme] = useState("default");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("theme-terra", theme === "terra");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "terra" ? "default" : "terra"));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-brand-bg text-slate-100 selection:bg-brand-purple/30 selection:text-brand-purpleLight">
      {/* Sidebar Navigation */}
      <Navbar theme={theme} toggleTheme={toggleTheme} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Content Pane */}
      <main className={`flex-1 transition-all duration-300 min-h-screen px-4 pt-4 pb-24 md:pb-8 md:pt-8 md:pr-8 ${sidebarCollapsed ? "md:pl-24" : "md:pl-72"}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/segments" element={<Segments />} />
            <Route path="/campaigns" element={<CampaignStudio />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
