import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus,
  FaUserShield,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { IoFitness } from "react-icons/io5";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const loadUser = () => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(storedUser);
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("authChange", loadUser);
    return () => window.removeEventListener("authChange", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("authChange"));
    setIsMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <IoFitness size={22} /> FitChallenge
          </Link>

          {/* HAMBURGER BUTTON - Mobile Only */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="flex items-center gap-2 hover:text-yellow-300">
              <FaHome /> Home
            </Link>

            <Link to="/about" className="flex items-center gap-2 hover:text-yellow-300">
              <FaInfoCircle /> About
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 hover:text-yellow-300"
            >
              <FaTachometerAlt /> Dashboard
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center gap-2 hover:text-yellow-300"
              >
                <FaUserShield /> Admin
              </Link>
            )}

            {!user && (
              <>
                <Link to="/login" className="flex items-center gap-2 hover:text-yellow-300">
                  <FaSignInAlt /> Login
                </Link>
                <Link to="/signup" className="flex items-center gap-2 hover:text-yellow-300">
                  <FaUserPlus /> Sign Up
                </Link>
              </>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 px-4 py-1.5 rounded-full hover:bg-red-600"
              >
                <FaSignOutAlt /> Logout
              </button>
            )}
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 mt-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-3 pb-4">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-2 hover:text-yellow-300 py-2"
            >
              <FaHome /> Home
            </Link>

            <Link
              to="/about"
              onClick={closeMenu}
              className="flex items-center gap-2 hover:text-yellow-300 py-2"
            >
              <FaInfoCircle /> About
            </Link>

            <Link
              to="/dashboard"
              onClick={closeMenu}
              className="flex items-center gap-2 hover:text-yellow-300 py-2"
            >
              <FaTachometerAlt /> Dashboard
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className="flex items-center gap-2 hover:text-yellow-300 py-2"
              >
                <FaUserShield /> Admin
              </Link>
            )}

            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-2 hover:text-yellow-300 py-2"
                >
                  <FaSignInAlt /> Login
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="flex items-center gap-2 hover:text-yellow-300 py-2"
                >
                  <FaUserPlus /> Sign Up
                </Link>
              </>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-full hover:bg-red-600 w-fit"
              >
                <FaSignOutAlt /> Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
