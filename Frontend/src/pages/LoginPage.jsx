import React, { useState } from "react";
import { Link } from "react-router";
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, ShieldCheck, MessageSquare } from "lucide-react";
import logo from "../assets/logo.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api.js";

import vcImg from "../assets/vc.png";

const LoginPage = () => {
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const {
    mutate: loginMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-base-300 transition-colors duration-300"
      data-theme="forest"
    >
      <div className="border border-primary/20 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-2xl shadow-2xl overflow-hidden min-h-[600px]">
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center gap-2 mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-400 rounded-full blur-md opacity-40 group-hover:opacity-75 transition duration-300"></div>
              <img
                src={logo}
                alt="Duckling Logo"
                className="relative size-16 object-contain transform transition-transform duration-300 hover:scale-105"
              />
            </div>
            <h1 className="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">
              Welcome Back
            </h1>
            <p className="text-sm text-base-content/70">
              Log in to continue chatting with your flock
            </p>
          </div>

          {/* ERROR MESSAGE IF ANY */}
          {error && (
            <div className="alert alert-error mb-4 shadow-md text-sm py-2.5">
              <span>{error.response?.data?.message || error.message || "Invalid credentials. Please try again."}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-medium text-base-content/80">
                  Email Address
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/40">
                  <Mail className="size-5" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-11 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control w-full">
              <div className="flex justify-between items-center py-1">
                <label className="label py-0">
                  <span className="label-text font-medium text-base-content/80">
                    Password
                  </span>
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="text-xs text-primary hover:underline font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/40">
                  <Lock className="size-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-11 pr-11 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-base-content/40 hover:text-base-content/85 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="form-control py-1">
              <label className="label cursor-pointer justify-start gap-3 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox checkbox-primary checkbox-sm rounded"
                />
                <span className="text-xs text-base-content/70 leading-tight">
                  Remember me on this device
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="btn btn-primary w-full shadow-lg shadow-primary/20 mt-2 font-semibold tracking-wide gap-2 group"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="size-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  <span>Log In</span>
                </>
              )}
            </button>

            {/* Footer Signup Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-base-content/60">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary font-semibold hover:underline transition-all"
                >
                  Sign up now
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right Side: Hero Visual Display */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/10 via-base-200 to-base-300 items-center justify-center p-12 border-l border-primary/10 relative overflow-hidden">
          {/* Decorative ambient background glows */}
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-md text-center z-10 flex flex-col items-center">
            {/* Visual card badge */}
            <div className="relative mb-8 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-base-100/90 backdrop-blur-md p-6 rounded-2xl shadow-xl flex items-center justify-center border border-primary/10">
                <img
                  src={vcImg}
                  alt="Duckling App Illustration"
                  className="max-h-[260px] object-contain rounded-lg transform transition duration-500 hover:scale-105"
                />
              </div>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-base-content mb-3">
              Stay Connected Anywhere
            </h2>
            <p className="text-base-content/70 leading-relaxed text-sm mb-6">
              Catch up with your friends, start instant voice or video calls, and share memories effortlessly.
            </p>

            {/* Feature Highlights Pills */}
            <div className="flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-base-100/80 border border-primary/20 text-base-content/80 shadow-xs">
                <MessageSquare className="size-3.5 text-primary" /> Real-time Chat
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-base-100/80 border border-primary/20 text-base-content/80 shadow-xs">
                <ShieldCheck className="size-3.5 text-emerald-400" /> Secure Auth
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-base-100/80 border border-primary/20 text-base-content/80 shadow-xs">
                <Sparkles className="size-3.5 text-primary" /> Voice & Video
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
