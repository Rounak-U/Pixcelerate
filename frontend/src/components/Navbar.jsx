// Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

// --- ICON DEFINITIONS ---
const SlidersIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

// --- MAIN HEADER ---
const MainHeader = () => (
  <header className="bg-black text-white shadow-xl border-b border-black font-sans fixed top-0 left-0 w-full z-30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
      <div className="p-2 rounded-full flex-shrink-0 shadow-lg bg-white text-black transition-colors duration-300">
        <SlidersIcon size={20} />
      </div>
      <div className="flex flex-col justify-center ml-4">
        <h1 className="text-xl font-bold leading-tight">Pixcelerate</h1>
        <p className="text-xs text-gray-400 mt-[-2px] tracking-wide">
          Parallel & Distributed Processing
        </p>
      </div>
    </div>
  </header>
);

// --- SUB NAVBAR ---
const SubNavbar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Upload", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "Process", path: "/process" },
    { name: "Metrics", path: "/metrics" },
  ];

  return (
    <nav className="fixed top-16 left-0 w-full flex space-x-2 px-4 py-2 bg-white border-b border-gray-200 shadow-inner z-20">
      <div className="max-w-7xl mx-auto flex space-x-2 w-full">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (location.pathname === "/" && item.path === "/");
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-black text-white shadow-lg shadow-gray-400/50"
                  : "text-gray-700 hover:text-black hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

// --- NAVBAR COMPONENT ---
const Navbar = ({ children }) => {
  return (
    <div className="relative">
      <MainHeader />
      <SubNavbar />
      {/* Add padding top equal to header + subnavbar height so content doesn't go under */}
      <div className="pt-[8rem]">{children}</div>
    </div>
  );
};

export default Navbar;
