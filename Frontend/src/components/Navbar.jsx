import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  Palette,
  Check,
  Bell,
  Search,
  LogOut,
  User,
  Settings,
  Sparkles,
  MessageSquare,
  Phone,
  Home,
  ChevronDown,
} from "lucide-react";
import logo from "../assets/logo.png";
import { THEMES } from "../constants/index.js";
import { useThemeStore } from "../store/useThemeStore.js";
import useAuthUser from "../hooks/useAuthUser.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api.js";

const Navbar = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser } = useAuthUser();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const themeDropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target)) {
        themeDropdownRef.current.removeAttribute("open");
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const { mutate: logoutMutation, isPending: isLoggingOut } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const currentThemeObj = THEMES.find((t) => t.name === theme) || THEMES[0];

  // Helper to derive current route label
  const getPageTitle = (path) => {
    switch (path) {
      case "/":
        return "Home Overview";
      case "/chat":
        return "Messages & Chats";
      case "/call":
        return "Voice & Video Calls";
      case "/notifications":
        return "Notifications";
      default:
        return "Duckling Workspace";
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-base-100/80 backdrop-blur-md border-b border-base-300 px-4 lg:px-6 py-2.5 transition-colors duration-300">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Side: Brand Logo (Mobile) / Page Title (Desktop) */}
        <div className="flex items-center gap-3">
          {/* Mobile Logo Link */}
          <Link to="/" className="flex lg:hidden items-center gap-2 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-400 rounded-full blur-xs opacity-50 group-hover:opacity-80 transition duration-300"></div>
              <img
                src={logo}
                alt="Duckling Logo"
                className="relative size-9 object-contain transform group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-lg font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">
              Duckling
            </span>
          </Link>

          {/* Desktop Page Title */}
          <div className="hidden lg:flex items-center gap-2.5">
            <span className="text-lg font-bold text-base-content tracking-tight">
              {getPageTitle(location.pathname)}
            </span>
            <span className="badge badge-primary badge-sm font-semibold tracking-wide shadow-xs">
              Live
            </span>
          </div>
        </div>

        {/* Middle: Quick Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/40">
              <Search className="size-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations, friends, or files... (Ctrl + K)"
              className="input input-sm input-bordered w-full pl-10 pr-4 bg-base-200/60 focus:bg-base-100 focus:border-primary transition-all duration-200 text-xs rounded-xl"
            />
          </div>
        </div>

        {/* Right Side: Theme Selector & User Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Selector Dropdown */}
          <details ref={themeDropdownRef} className="dropdown dropdown-end">
            <summary
              className="btn btn-sm btn-ghost gap-2 border border-base-300 hover:border-primary/40 bg-base-200/50 hover:bg-base-200 rounded-xl px-3 list-none [&::-webkit-details-marker]:hidden"
              title="Change Theme"
            >
              <Palette className="size-4 text-primary animate-pulse" />
              <span className="hidden sm:inline-block text-xs font-semibold capitalize text-base-content/90">
                {currentThemeObj.label}
              </span>
              {/* Color dots preview of current theme */}
              <div className="flex items-center gap-0.5 ml-0.5">
                {currentThemeObj.colors.slice(0, 3).map((color, idx) => (
                  <span
                    key={idx}
                    className="size-2 rounded-full ring-1 ring-base-content/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <ChevronDown className="size-3.5 text-base-content/50" />
            </summary>

            {/* Dropdown Menu List */}
            <div
              className="dropdown-content z-50 mt-2 p-2 shadow-2xl bg-base-200 border border-base-300 rounded-2xl w-64 max-h-96 overflow-y-auto grid grid-cols-1 gap-1"
            >
              <div className="px-3 py-2 border-b border-base-300/60 mb-1 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-1.5">
                  <Palette className="size-3.5 text-primary" /> Select Theme
                </span>
                <span className="badge badge-ghost badge-xs text-[10px]">
                  {THEMES.length} Themes
                </span>
              </div>

              {THEMES.map((t) => {
                const isSelected = theme === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => {
                      setTheme(t.name);
                      themeDropdownRef.current?.removeAttribute("open");
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
                      isSelected
                        ? "bg-primary text-primary-content font-bold shadow-xs"
                        : "text-base-content/80 hover:bg-base-300 hover:text-base-content"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Color Palette Swatch */}
                      <div className="flex items-center gap-0.5 p-1 rounded-md bg-base-100/50 border border-base-content/10">
                        {t.colors.map((color, idx) => (
                          <span
                            key={idx}
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="capitalize">{t.label}</span>
                    </div>

                    {isSelected && (
                      <Check className="size-4 text-primary-content" />
                    )}
                  </button>
                );
              })}
            </div>
          </details>

          {/* Notifications Button */}
          <Link
            to="/notifications"
            className="btn btn-sm btn-ghost btn-square relative border border-base-300 hover:border-primary/40 bg-base-200/50 hover:bg-base-200 rounded-xl"
            title="Notifications"
          >
            <Bell className="size-4 text-base-content/70" />
            <span className="absolute top-1 right-1 size-2 rounded-full bg-primary ring-2 ring-base-100 animate-ping"></span>
            <span className="absolute top-1 right-1 size-2 rounded-full bg-primary ring-2 ring-base-100"></span>
          </Link>

          {/* User Profile Menu */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar size-9 ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100 hover:ring-primary transition-all duration-200"
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-base-300">
                {authUser?.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt={authUser.fullName || "User Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-bold text-xs">
                    {authUser?.fullName ? (
                      authUser.fullName.charAt(0).toUpperCase()
                    ) : (
                      <User className="size-4" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Dropdown Items */}
            <ul
              tabIndex={0}
              className="dropdown-content z-50 mt-2 p-2 shadow-2xl bg-base-200 border border-base-300 rounded-2xl w-56 space-y-1"
            >
              <li className="px-3 py-2 border-b border-base-300/60 mb-1">
                <p className="text-xs font-bold text-base-content truncate">
                  {authUser?.fullName || "Duckling User"}
                </p>
                <p className="text-[11px] text-base-content/50 truncate">
                  {authUser?.email || "user@duckling.com"}
                </p>
              </li>

              <li>
                <Link
                  to="/"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-base-content/80 hover:bg-base-300 hover:text-base-content transition-colors"
                >
                  <User className="size-4 text-primary" /> Profile Settings
                </Link>
              </li>

              <li>
                <Link
                  to="/chat"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-base-content/80 hover:bg-base-300 hover:text-base-content transition-colors"
                >
                  <MessageSquare className="size-4 text-emerald-500" /> Active Chats
                </Link>
              </li>

              <div className="border-t border-base-300/60 my-1"></div>

              <li>
                <button
                  onClick={() => logoutMutation()}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-error hover:bg-error/10 transition-colors"
                >
                  {isLoggingOut ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <LogOut className="size-4" />
                  )}
                  <span>Log Out</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;