import React, { useState } from "react";
import { Link } from "react-router";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.png";
import vcImg from "../assets/vc.png";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { signup } from "../lib/api.js";

const SignupPage = () => {
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
    onSuccess: () => QueryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signUpData);
    console.log("Signup data:", signUpData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-base-300"
      data-theme="forest"
    >
      <div className="border border-primary/20 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-2xl shadow-2xl overflow-hidden min-h-[600px]">
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center gap-2 mb-8">
            <img
              src={logo}
              alt="Duckling Logo"
              className="size-16 object-contain"
            />
            <h1 className="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-linear-to-r from-primary to-emerald-400">
              Duckling
            </h1>
            <p className="text-sm text-base-content/70">
              Join the flock and chat with friends in real-time
            </p>
          </div>

          {/* ERROR MESSAGE IF ANY */}
          {error && (
            <div className="alert alert-errord mb-4">
              <span className="">{error.response.data.message}</span>
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <User className="size-5" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <Mail className="size-5" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <Lock className="size-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content/85 transition-colors"
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
                  className="checkbox checkbox-primary checkbox-sm rounded"
                  required
                />
                <span className="text-xs text-base-content/70 leading-tight">
                  I agree to the{" "}
                  <span className="text-primary hover:underline cursor-pointer font-medium">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-primary hover:underline cursor-pointer font-medium">
                    Privacy Policy
                  </span>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="btn btn-primary w-full shadow-lg shadow-primary/20 mt-2 font-semibold tracking-wide"
              type="submit"
            >
              {isPending ? "Signing up..." : "Create Account"}
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

        {/* Right Side: Hero Visual Display */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/10 via-base-200 to-base-300 items-center justify-center p-12 border-l border-primary/10 relative overflow-hidden">
          {/* Decorative ambient background glows */}
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-md text-center z-10 flex flex-col items-center">
            <div className="relative mb-8 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-base-100 p-6 rounded-2xl shadow-xl flex items-center justify-center">
                <img
                  src={vcImg}
                  alt="Duckling Hero"
                  className="max-h-[280px] object-contain rounded-lg animate-float"
                />
              </div>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-base-content mb-3">
              Connect with the flock
            </h2>
            <p className="text-base-content/70 leading-relaxed text-sm">
              Experience seamless, instant conversations with your friends.
              Share files, make calls, and stay in touch wherever you go.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
