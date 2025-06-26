import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSignOutAlt, FaTasks } from "react-icons/fa";
import {
  FaUserShield,
  FaMagnifyingGlass,
  FaChartBar,
  FaChartPie,
  FaBell,
} from "react-icons/fa6";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "../utils/toastNotifications";
import { useLoading } from "../contexts/LoadingContext";
import { MdDashboard } from "react-icons/md";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { showLoading, hideLoading, setRefresh } = useLoading();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasAccess = (requiredRole) => {
    return user?.access?.includes(requiredRole);
  };

  const handleLogout = async () => {
    try {
      showLoading(2000);
      await logout();
      setRefresh(true);
      hideLoading(2000);
      showToast("Logout successful!", "success");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const menuItems = [
    { path: "/admin", icon: <FaUserShield />, label: "Admin", role: "ad" },
    {
      path: "/monitoring",
      icon: <FaMagnifyingGlass />,
      label: "Monitoring",
      role: "mr",
    },
    { path: "/activities", icon: <FaTasks />, label: "Activities", role: "ac" },
    { path: "/reports", icon: <FaChartBar />, label: "Reports", role: "rp" },
    {
      path: "/analytics",
      icon: <FaChartPie />,
      label: "Analytics",
      role: "an",
    },
    {
      path: "/notifications",
      icon: <FaBell />,
      label: "Notifications",
      role: "nt",
    },
  ];

  return (
    <div
      className={`flex ${
        isOpen ? "w-64" : "w-20"
      } h-full transition-all duration-300`}
    >
      <div
        ref={sidebarRef}
        className="bg-[#03346E] text-white p-5 space-y-6 shadow-lg flex flex-col w-full relative"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white text-2xl mb-6 relative group"
        >
          {isOpen ? (
            <div className="flex justify-end cursor-grab">
              <FaTimes />
            </div>
          ) : (
            <div className="flex justify-center cursor-grab">
              <FaBars />
              <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Open Menu
              </span>
            </div>
          )}
        </button>

        <div className="mb-4">
          <Link
            to="/"
            className={`flex items-center space-x-3 p-2 rounded-md hover:bg-[#E2E2B6] relative group ${
              location.pathname === "/" ? "bg-[#a5a58c] text-white" : ""
            } ${isOpen ? "pl-5" : "justify-center"}`}
          >
            <div
              className={`flex items-center justify-center ${
                isOpen ? "mr-3" : ""
              }`}
            >
              <MdDashboard />
              {!isOpen && (
                <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Dashboard
                </span>
              )}
            </div>
            {isOpen && <span>Dashboard</span>}
          </Link>
        </div>

        <div className="space-y-4">
          {menuItems.map(
            ({ path, icon, label, role }) =>
              hasAccess(role) && (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-3 p-2 rounded-md hover:bg-[#E2E2B6] relative group ${
                    location.pathname === path ? "bg-[#a5a58c] text-white" : ""
                  } ${isOpen ? "pl-5" : "justify-center"}`}
                >
                  <div
                    className={`flex items-center justify-center ${
                      isOpen ? "mr-3" : ""
                    }`}
                  >
                    {icon}
                    {!isOpen && (
                      <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                        {label}
                      </span>
                    )}
                  </div>
                  {isOpen && <span>{label}</span>}
                </Link>
              )
          )}
        </div>

        <button
          onClick={handleLogout}
          className={`flex items-center space-x-3 p-2 rounded-md hover:bg-[#E2E2B6] mt-auto bg-[#a5a58c] text-white relative group ${
            isOpen ? "pl-5" : "justify-center"
          }`}
        >
          <div
            className={`flex items-center justify-center ${
              isOpen ? "mr-3" : ""
            }`}
          >
            <FaSignOutAlt />
            {!isOpen && (
              <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Logout
              </span>
            )}
          </div>
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
