import React from "react";
import { Link, useLocation } from "react-router";
import { Home, MessageSquare, Bell, LogOut, Sparkles, User } from "lucide-react";
import logo from "../assets/logo.png";
import useAuthUser from "../hooks/useAuthUser.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api.js";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const queryClient = useQueryClient();

  const { mutate: logoutMutation, isPending: isLoggingOut } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Chats", path: "/chat", icon: MessageSquare },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Features", path: "/features", icon: Sparkles },
  ];

  return (
    <aside className="w-64 bg-base-200/90 backdrop-blur-md border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0 z-30 select-none transition-all duration-300">
      {/* Header / Brand Logo */}
      <div className="p-5 border-b border-base-300 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-400 rounded-full blur-xs opacity-50 group-hover:opacity-85 transition duration-300"></div>
            <img
              src={logo}
              alt="Duckling Logo"
              className="relative size-10 object-contain transform group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">
              Duckling
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-base-content/50 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Chat
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-base-content/40">
            Menu
          </span>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? "bg-primary text-primary-content font-semibold shadow-md shadow-primary/20"
                  : "text-base-content/70 hover:text-base-content hover:bg-base-300/70"
              }`}
            >
              <Icon
                className={`size-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-primary-content" : "text-base-content/60 group-hover:text-primary"
                }`}
              />
              <span className="text-sm">{item.label}</span>

              {/* Active Indicator dot if needed */}
              {isActive && (
                <span className="ml-auto size-2 rounded-full bg-primary-content animate-pulse"></span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Quick Upgrade / Banner box */}
      <div className="p-3 mx-3 mb-3 bg-gradient-to-br from-primary/10 to-base-300 rounded-xl border border-primary/20 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="size-4 text-primary" />
          <span className="text-xs font-bold text-base-content">Duckling Connect</span>
        </div>
        <p className="text-[11px] text-base-content/60 leading-tight">
          Real-time video, audio, & chat messaging for teams.
        </p>
      </div>

      {/* User Profile & Logout Footer */}
      <div className="p-4 border-t border-base-300 bg-base-200/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="avatar">
              <div className="size-10 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100 overflow-hidden bg-base-300">
                {authUser?.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt={authUser.fullName || "User Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                    {authUser?.fullName ? authUser.fullName.charAt(0).toUpperCase() : <User className="size-5" />}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-base-content truncate">
                {authUser?.fullName || "Duckling User"}
              </span>
              <span className="text-xs text-base-content/50 truncate">
                {authUser?.email || "online"}
              </span>
            </div>
          </div>

          <button
            onClick={() => logoutMutation()}
            disabled={isLoggingOut}
            title="Log Out"
            className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-error hover:bg-error/10 transition-colors"
          >
            {isLoggingOut ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <LogOut className="size-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
