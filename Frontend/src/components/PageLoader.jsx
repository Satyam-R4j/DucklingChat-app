import React from "react";
import { LoaderIcon } from "lucide-react";
import logo from "../assets/logo.png";
import { useThemeStore } from "../store/useThemeStore.js";

const PageLoader = () => {
  const { theme } = useThemeStore();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-base-100 text-base-content gap-4 transition-colors duration-300 select-none"
      data-theme={theme}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer ambient glow & rotating spinner ring */}
        <div className="absolute -inset-3 bg-gradient-to-r from-primary to-emerald-400 rounded-full blur-md opacity-30 animate-pulse"></div>
        
        {/* Center Logo */}
        <div className="relative bg-base-200/80 backdrop-blur-md p-3.5 rounded-full border border-primary/20 shadow-xl">
          <img
            src={logo}
            alt="Duckling Logo"
            className="size-10 object-contain animate-bounce"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-base-content/70">
        <LoaderIcon className="animate-spin size-4 text-primary" />
        <span>Loading Duckling...</span>
      </div>
    </div>
  );
};

export default PageLoader;
