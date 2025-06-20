// src/components/ui/client/ResponsiveNavbar.tsx
"use client"; // This component is interactive

import React, { useState, useEffect } from "react";
import {
  Bell,
  Clock,
  Edit,
  Calendar,
  LogOut,
  User,
  Menu,
  X,
  Zap,
} from "lucide-react";

// Interface for NavItem props for better type checking
interface NavItemProps {
  icon: React.ElementType;
  label: string;
  hasNotification?: boolean;
  isCollapsed?: boolean;
  isActive?: boolean;
  onClick: () => void; // Keep onClick simple, it's called by the parent mapping
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  hasNotification = false,
  isCollapsed = false,
  isActive = false,
  onClick,
}) => (
  <div
    className={`relative flex items-center gap-4 px-4 py-3 mx-2 rounded-xl cursor-pointer transition-all duration-300 group transform hover:translate-x-1 hover:scale-105 active:scale-95 ${
      isActive
        ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white border border-amber-500/30 shadow-lg"
        : "text-slate-300 hover:text-white hover:bg-white/10 hover:shadow-md"
    }`}
    onClick={onClick} // The direct click handler
    style={{
      animation: isActive ? "pulse-glow 2s infinite" : "",
    }}
  >
    {/* ... (rest of NavItem's beautiful styling - no changes needed here) ... */}
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10 transition-all duration-300 opacity-0 group-hover:opacity-100" />
    <div className="relative flex items-center gap-4 z-10 w-full">
      <div className="relative">
        <div
          className={`transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 ${
            isActive ? "text-amber-400" : "group-hover:text-amber-400"
          }`}
        >
          <Icon className="w-5 h-5 transition-colors duration-300" />
        </div>
        {hasNotification && (
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg"
            style={{ animation: "notification-pulse 2s infinite" }}
          >
            <div className="w-full h-full bg-red-400 rounded-full animate-pulse" />
          </div>
        )}
      </div>
      <div
        className={`flex items-center justify-between flex-1 overflow-hidden transition-all duration-300 ${
          isCollapsed
            ? "opacity-0 w-0 -translate-x-2"
            : "opacity-100 w-auto translate-x-0"
        }`}
      >
        <span className="text-sm font-medium tracking-wide whitespace-nowrap">
          {label}
        </span>
        {isActive && (
          <div
            className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full ml-2"
            style={{ animation: "scale-pulse 1.5s infinite" }}
          />
        )}
      </div>
    </div>
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none" />
  </div>
);

// Define the items available in the navbar
// Using a more robust identifier than just the label for activeItem logic
// This should be defined in a way that ClientLayout can also access it if needed for initial state.
export const NAV_ITEMS = [
  { id: "reservations", icon: Calendar, label: "Facilities booking" }, // This might map to /client/dashboard
  { id: "profile", icon: Edit, label: "Edit profile" },
  { id: "history", icon: Clock, label: "History" },
  {
    id: "notifications",
    icon: Bell,
    label: "Notifications",
    hasNotification: true, // This could be dynamic later
  },
  // Logout is handled separately in the structure but defined here for consistency
  { id: "logout", icon: LogOut, label: "Logout" },
] as const; // Use "as const" for stricter typing of ids and labels

export type NavItemId = (typeof NAV_ITEMS)[number]["id"];

interface ResponsiveNavbarProps {
  activeItem: NavItemId;
  onSelectItem: (itemId: NavItemId) => void; // Called with the item's 'id'
  userName?: string; // Comes from session
  userRole?: string; // Comes from session, formatted for display
}

const ResponsiveNavbar: React.FC<ResponsiveNavbarProps> = ({
  activeItem,
  onSelectItem,
  userName = "Guest", // Default values
  userRole = "User",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Separate main items from logout for structural placement
  const mainNavItems = NAV_ITEMS.filter((item) => item.id !== "logout");
  const logoutItem = NAV_ITEMS.find((item) => item.id === "logout"); // Should always be found

  const getActiveLabel = () => {
    return NAV_ITEMS.find((item) => item.id === activeItem)?.label || "Menu"; // Default for mobile title
  };

  // This handles closing the mobile menu when an item is clicked inside it.
  const handleMobileItemClick = (itemId: NavItemId) => {
    onSelectItem(itemId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <style jsx>{`
        /* ... your existing keyframes ... */
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(245, 158, 11, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.6),
              0 0 30px rgba(251, 146, 60, 0.4);
          }
        }
        @keyframes notification-pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
        @keyframes scale-pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.5);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .floating-bg-1 {
          animation: float 6s ease-in-out infinite;
        }
        .floating-bg-2 {
          animation: float 8s ease-in-out infinite reverse;
        }
        .gradient-animated {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
      `}</style>

      {/* Animated background elements (optional) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-3xl floating-bg-1 transition-transform duration-1000 ease-out"
          style={{
            left: "10%",
            top: "20%",
            transform: `translate(${mousePosition.x / 50}px, ${
              mousePosition.y / 50
            }px)`,
          }}
        />
        <div
          className="absolute w-72 h-72 bg-gradient-to-r from-yellow-500/15 to-amber-500/15 rounded-full blur-3xl floating-bg-2 transition-transform duration-1000 ease-out"
          style={{
            right: "10%",
            bottom: "20%",
            transform: `translate(${-mousePosition.x / 80}px, ${
              -mousePosition.y / 80
            }px)`,
          }}
        />
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex fixed left-0 top-0 h-full z-50 transition-all duration-500 ease-out ${
          isHovered ? "w-72" : "w-20" // Sidebar width
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-full flex flex-col w-full">
          {/* Background Styling */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-50" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Profile Section */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg transform hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-pointer gradient-animated">
                  <User className="w-6 h-6 text-white" />{" "}
                  {/* Or user's actual profile picture if available */}
                </div>
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isHovered
                      ? "opacity-100 translate-x-0 w-auto"
                      : "opacity-0 -translate-x-4 w-0"
                  }`}
                >
                  <h3
                    className="text-white font-semibold text-lg truncate"
                    title={userName}
                  >
                    {userName}
                  </h3>
                  <p
                    className="text-slate-400 text-sm truncate"
                    title={userRole}
                  >
                    {userRole}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 py-6 space-y-2">
              {mainNavItems.map((item, index) => (
                <div
                  key={item.id}
                  className="opacity-0 -translate-x-4 animate-[slideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <NavItem
                    icon={item.icon}
                    label={item.label}
                    hasNotification={item.hasNotification}
                    isCollapsed={!isHovered}
                    isActive={activeItem === item.id}
                    onClick={() => onSelectItem(item.id)} // Pass item.id
                  />
                </div>
              ))}
            </nav>

            {/* Logout Section */}
            {logoutItem && ( // Ensure logoutItem exists
              <div className="p-4 border-t border-white/10">
                <div className="transform hover:scale-105 active:scale-95 transition-transform duration-200">
                  <NavItem
                    icon={logoutItem.icon}
                    label={logoutItem.label}
                    isCollapsed={!isHovered}
                    isActive={activeItem === logoutItem.id}
                    onClick={() => onSelectItem(logoutItem.id)} // Pass 'logout' id
                  />
                </div>
              </div>
            )}

            {/* Expand hint */}
            {!isHovered && (
              <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-50"
                style={{ animation: "float 2s ease-in-out infinite" }}
              >
                <Zap className="w-4 h-4 text-slate-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Top Navbar */}
      <div className="lg:hidden sticky top-0 z-40">
        <div className="relative bg-slate-900/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/80 to-slate-900/80" />
          <div className="relative z-10 flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg active:scale-90 transition-transform duration-200 gradient-animated">
                <User className="w-5 h-5 text-white" />{" "}
                {/* Or user's profile pic */}
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">
                  {getActiveLabel()}
                </h1>
                <p className="text-slate-400 text-xs">
                  Welcome, {userName ? userName.split(" ")[0] : "User"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300 active:scale-90"
            >
              <div
                className={`transform transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </div>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          <div
            className={`overflow-hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl transition-all duration-500 ease-out ${
              isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0" // Adjust max-h if needed
            }`}
          >
            <div className="py-4 space-y-1">
              {mainNavItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`transform transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 0.05}s` }}
                  onClick={() => handleMobileItemClick(item.id)} // Use helper for mobile
                >
                  <NavItem // Pass empty onClick as parent div handles it
                    icon={item.icon}
                    label={item.label}
                    hasNotification={item.hasNotification}
                    isActive={activeItem === item.id}
                    onClick={() => {}}
                  />
                </div>
              ))}
              {logoutItem && (
                <div
                  className="border-t border-white/10 mt-4 pt-4"
                  onClick={() => handleMobileItemClick(logoutItem.id)} // Use helper for mobile
                >
                  <NavItem // Pass empty onClick
                    icon={logoutItem.icon}
                    label={logoutItem.label}
                    isActive={activeItem === logoutItem.id}
                    onClick={() => {}}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveNavbar;
