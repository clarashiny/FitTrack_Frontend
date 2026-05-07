import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaDumbbell,
  FaFireAlt,
  FaUsers,
  FaBars,
  FaSearch,
} from "react-icons/fa";

const Sidebar = ({ sidebarOpen, toggleSidebar, searchTerm, setSearchTerm }) => {
  const activeLink =
    "bg-emerald-600 text-white rounded p-2 flex items-center gap-2";
  const normalLink =
    "text-white hover:bg-emerald-500 rounded p-2 flex items-center gap-2";

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-16"
      } bg-gradient-to-b from-emerald-500 via-teal-600 to-zinc-800
         text-white transition-all duration-300 flex flex-col
         relative z-30 h-screen`}
    >
      <div className="flex items-center justify-between p-4">
        {sidebarOpen && <h1 className="text-xl font-bold">Dashboard</h1>}
        <button onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      <div className="px-3 pb-3">
        {sidebarOpen ? (
          <div className="flex items-center bg-white rounded px-2">
            <FaSearch className="text-gray-500 text-sm" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full p-2 outline-none text-black text-sm"
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <FaSearch />
          </div>
        )}
      </div>

      <nav className="flex-1 flex flex-col p-2 gap-2">
        <NavLink
          to="/dashboard/workouts"
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
        >
          <FaDumbbell />
          {sidebarOpen && "Workouts"}
        </NavLink>

        <NavLink
          to="/dashboard/challenges"
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
        >
          <FaFireAlt />
          {sidebarOpen && "Challenges"}
        </NavLink>

        <NavLink
          to="/dashboard/community"
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
        >
          <FaUsers />
          {sidebarOpen && "Community"}
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
