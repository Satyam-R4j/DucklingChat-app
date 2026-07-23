import React, { useState } from "react";
import { Link } from "react-router";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, MessageSquare, Video, ShieldCheck, Zap, Sparkles } from "lucide-react";
import logo from "../assets/logo.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api.js";

const SignupPage = () => {
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const {
    mutate: signupMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signUpData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-base-300 transition-colors duration-300"
      data-theme="forest"
    >
      <div className="border border-primary/20 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden min-h-[640px]">
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center gap-2 mb-8">
            <Link
              to="/features"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary hover:bg-primary/20 transition-all mb-2"
            >
              <Sparkles className="size-3.5" />
              <span>Explore Features</span>
            </Link>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-400 rounded-full blur-md opacity-40 group-hover:opacity-80 transition duration-300"></div>
              <img
                src={logo}
                alt="Duckling Logo"
                className="relative size-16 object-contain transform transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <h1 className="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400 mt-2">
              Join Duckling
            </h1>
            <p className="text-sm text-base-content/70">
              Join the flock and chat with friends in real-time
            </p>
          </div>

          {/* ERROR MESSAGE IF ANY */}
          {error && (
            <div className="alert alert-error mb-4 shadow-md text-sm py-2.5 rounded-xl border border-error/20">
              <span>{error.response?.data?.message || error.message || "An error occurred"}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-medium text-base-content/80">
                  Full Name
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/40">
                  <User className="size-5" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-11 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="John Doe"
                  value={signUpData.fullName}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, fullName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

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
                  className="input input-bordered w-full pl-11 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="john@example.com"
                  value={signUpData.email}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-medium text-base-content/80">
                  Password
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/40">
                  <Lock className="size-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-11 pr-11 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="••••••••"
                  value={signUpData.password}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, password: e.target.value })
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
              <p className="text-xs text-base-content/50 mt-1.5 pl-1">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className="form-control py-1">
              <label className="label cursor-pointer justify-start gap-3 select-none">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm rounded-md"
                  required
                />
                <span className="text-xs text-base-content/70 leading-tight font-medium">
                  I agree to the{" "}
                  <span className="text-primary hover:underline cursor-pointer font-semibold">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-primary hover:underline cursor-pointer font-semibold">
                    Privacy Policy
                  </span>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="btn btn-primary w-full shadow-lg shadow-primary/20 hover:shadow-primary/35 rounded-xl font-bold tracking-wide gap-2 py-3 transition-all duration-300"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="size-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>

            {/* Footer Signin */}
            <div className="text-center mt-6">
              <p className="text-sm text-base-content/60">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:underline transition-all"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right Side: Project Logo Showcase */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-base-300 via-base-200 to-base-300 items-center justify-center p-10 border-l border-primary/10 relative overflow-hidden">
          {/* Decorative ambient background glows */}
          <div className="absolute -top-16 -left-16 w-72 h-72 bg-primary/25 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

          <div className="max-w-md w-full text-center z-10 flex flex-col items-center">
            {/* Visual Logo Centerpiece */}
            <div className="relative mb-8 group cursor-pointer">
              {/* Outer pulsing glow ring */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary via-emerald-400 to-teal-300 rounded-full blur-xl opacity-40 group-hover:opacity-75 transition-all duration-700 animate-pulse"></div>
              
              {/* Glassmorphic logo container */}
              <div className="relative size-36 sm:size-40 p-5 bg-base-100/90 backdrop-blur-md rounded-3xl border border-primary/20 shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500 animate-float">
                <img
                  src={logo}
                  alt="Duckling App Logo"
                  className="size-full object-contain drop-shadow-md"
                />
              </div>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-400 to-teal-300 mb-3">
              Connect With The Flock
            </h2>
            <p className="text-base-content/75 leading-relaxed text-sm mb-8 max-w-sm">
              Experience seamless, instant conversations with your friends. Share files, make calls, and stay in touch wherever you go.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-base-100/70 backdrop-blur-sm border border-primary/15 shadow-xs hover:border-primary/35 transition-colors">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <MessageSquare className="size-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-base-content">Real-time Chat</div>
                  <div className="text-[10px] text-base-content/60">Instant messaging</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-base-100/70 backdrop-blur-sm border border-primary/15 shadow-xs hover:border-primary/35 transition-colors">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Video className="size-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-base-content">HD Calls</div>
                  <div className="text-[10px] text-base-content/60">Audio & Video</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-base-100/70 backdrop-blur-sm border border-primary/15 shadow-xs hover:border-primary/35 transition-colors">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                  <ShieldCheck className="size-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-base-content">Private & Safe</div>
                  <div className="text-[10px] text-base-content/60">Encrypted</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-base-100/70 backdrop-blur-sm border border-primary/15 shadow-xs hover:border-primary/35 transition-colors">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Zap className="size-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-base-content">Fast Sync</div>
                  <div className="text-[10px] text-base-content/60">Multi-device</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

