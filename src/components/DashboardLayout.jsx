import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";

import Workout from "../pages/Workout";
import Challenges from "../pages/Challenges";
import Community from "../pages/Community";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Navigate to="workouts" replace />} />
          <Route path="workouts" element={<Workout searchTerm={searchTerm} />} />
          <Route path="challenges" element={<Challenges searchTerm={searchTerm} />} />
          <Route path="community" element={<Community searchTerm={searchTerm} />} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardLayout;

