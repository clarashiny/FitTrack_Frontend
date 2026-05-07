import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zinc-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div
        className={`min-h-screen overflow-x-hidden overflow-y-auto transition-all duration-300 w-full ${
          sidebarOpen
            ? "md:ml-64 md:w-[calc(100%-16rem)]"
            : "md:ml-16 md:w-[calc(100%-4rem)]"
        }`}
      >
        <main className="min-h-screen p-4 md:p-6">
          <Outlet context={{ searchTerm }} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
