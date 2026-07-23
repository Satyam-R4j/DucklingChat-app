import React from "react";
import { Link } from "react-router";
import {
  MessageSquare,
  Video,
  Users,
  ShieldCheck,
  Bell,
  Sparkles,
  ArrowRight,
  LogIn,
  CheckCircle2,
  Zap,
  Lock,
} from "lucide-react";
import logo from "../assets/logo.png";

const FeaturesPage = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Real-Time Messaging",
      description:
        "Lightning-fast chat delivery powered by instant WebSocket synchronization. Send text, emojis, and media seamlessly.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      icon: Video,
      title: "HD Video & Audio Calls",
      description:
        "High-definition room calling with crystal clear audio and ultra-low latency WebRTC streaming.",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      icon: Users,
      title: "Flock Friend Discovery",
      description:
        "Search, discover, and send friend requests to chatters. Build your social circle with simple one-click connections.",
      color: "text-teal-400",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/20",
    },
    {
      icon: ShieldCheck,
      title: "End-to-End Security",
      description:
        "Protected by modern JWT authentication, secure HTTP-only cookies, and encrypted data transmission.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Stay informed with real-time in-app alerts, unread badges, and friend activity notifications.",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      icon: Sparkles,
      title: "Rich Theme Engine",
      description:
        "Switch between dozens of sleek visual themes—from deep dark mode to forest green—matching your style.",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
  ];

  const stats = [
    { value: "< 50ms", label: "Global Message Latency" },
    { value: "99.9%", label: "Platform Uptime SLA" },
    { value: "100%", label: "Free & Encrypted" },
    { value: "HD 4K", label: "Voice & Video Clarity" },
  ];

  return (
    <div
      className="min-h-screen bg-base-300 text-base-content transition-colors duration-300 flex flex-col justify-between"
      data-theme="forest"
    >
      {/* Floating Rounded Navbar */}
      <header className="sticky top-4 z-50 mx-4 sm:mx-8 md:mx-12">
        <div className="max-w-7xl mx-auto bg-base-100/85 backdrop-blur-2xl border border-primary/20 shadow-xl shadow-base-300/50 rounded-2xl sm:rounded-full px-5 sm:px-8 py-3 flex items-center justify-between transition-all duration-300">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-emerald-400 to-teal-300 rounded-full blur-xs opacity-50 group-hover:opacity-90 transition duration-300"></div>
              <img
                src={logo}
                alt="Duckling Logo"
                className="relative size-9 sm:size-10 object-contain transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-400 to-teal-300">
                Duckling
              </span>
            </div>
          </Link>

          {/* Quick Nav Badge */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-base-content/80">
            <a href="#features-section" className="hover:text-primary transition-colors">Features</a>
            <a href="#stats-section" className="hover:text-primary transition-colors">Platform Stats</a>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="size-3.5 animate-pulse" /> Live Features
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="btn btn-ghost btn-sm font-semibold hover:bg-base-200/80 rounded-xl gap-1.5 text-xs sm:text-sm"
            >
              <LogIn className="size-4" />
              <span>Log In</span>
            </Link>
            <Link
              to="/signup"
              className="btn btn-primary btn-sm font-bold shadow-md shadow-primary/25 hover:shadow-primary/40 gap-1.5 rounded-xl sm:rounded-full px-4 sm:px-5 transition-all"
            >
              <span>Join Duckling</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 px-4 sm:px-8 overflow-hidden">
          {/* Ambient Glow Orbs */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-primary/20 via-emerald-500/15 to-teal-400/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-base-100/90 border border-primary/20 shadow-md mb-6 backdrop-blur-md">
              <Sparkles className="size-4 text-primary animate-pulse" />
              <span className="text-xs font-bold text-base-content/85 tracking-wide">
                Next-Gen Live Chat & Video Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-base-content leading-tight mb-6">
              Connect, Chat & Call — <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-400 to-teal-300">
                All In One Flock
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-base-content/75 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Duckling Chat combines ultra-fast real-time messaging, crystal-clear audio & video calling, bank-grade security, and instant friend discovery into one seamless experience.
            </p>

            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/signup"
                className="btn btn-primary btn-lg px-8 shadow-xl shadow-primary/25 rounded-2xl font-extrabold tracking-wide gap-2 group w-full sm:w-auto"
              >
                <span>Join Duckling Now</span>
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="btn btn-outline btn-lg px-8 border-primary/30 hover:border-primary rounded-2xl font-bold gap-2 w-full sm:w-auto"
              >
                <LogIn className="size-5" />
                <span>Sign In to Account</span>
              </Link>
            </div>

            {/* Hero Visual Showcase Mockup */}
            <div className="relative max-w-3xl mx-auto group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary via-emerald-400 to-teal-300 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-700"></div>
              <div className="relative bg-base-100/90 backdrop-blur-xl border border-primary/20 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center">
                {/* Floating Logo Badge */}
                <div className="size-28 p-4 bg-base-200/80 rounded-2xl border border-primary/30 shadow-lg mb-6 flex items-center justify-center animate-float">
                  <img src={logo} alt="Duckling Emblem" className="size-full object-contain drop-shadow-md" />
                </div>
                <h3 className="text-2xl font-extrabold text-base-content mb-2">Duckling Live Experience</h3>
                <p className="text-xs sm:text-sm text-base-content/60 max-w-md mb-6">
                  Built for seamless instant messaging, group conversations, and crisp HD calling with zero hassle.
                </p>

                {/* Feature Tags Row */}
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-base-200 border border-primary/20 text-base-content/80">
                    <CheckCircle2 className="size-3.5 text-primary" /> 100% Free Access
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-base-200 border border-primary/20 text-base-content/80">
                    <Zap className="size-3.5 text-emerald-400" /> WebRTC Instant Calls
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-base-200 border border-primary/20 text-base-content/80">
                    <Lock className="size-3.5 text-teal-400" /> Secure Tokens
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Features Grid */}
        <section id="features-section" className="py-16 px-4 sm:px-8 bg-base-200/50 border-t border-b border-primary/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content mb-4">
                Everything You Need To Stay Connected
              </h2>
              <p className="text-base-content/70 max-w-xl mx-auto text-sm sm:text-base">
                Discover the features designed to make your daily conversations faster, safer, and more enjoyable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className={`p-6 sm:p-8 rounded-3xl bg-base-100/90 backdrop-blur-md border ${item.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between`}
                  >
                    <div>
                      <div
                        className={`size-12 rounded-2xl ${item.bgColor} ${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="size-6" />
                      </div>
                      <h3 className="text-xl font-bold text-base-content mb-2">{item.title}</h3>
                      <p className="text-sm text-base-content/70 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                      <span>Learn more</span>
                      <ArrowRight className="size-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Platform Stats */}
        <section id="stats-section" className="py-16 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-base-100/70 border border-primary/15 shadow-sm flex flex-col items-center"
                >
                  <div className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-base-content/70">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="py-16 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-emerald-400 to-teal-300 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition duration-500"></div>
            <div className="relative bg-base-100 p-8 sm:p-12 rounded-3xl border border-primary/20 text-center shadow-2xl flex flex-col items-center">
              <img src={logo} alt="Duckling Logo" className="size-16 object-contain mb-4 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content mb-4">
                Ready to Join the Flock?
              </h2>
              <p className="text-base-content/75 text-sm sm:text-base max-w-lg mb-8">
                Create your account in seconds and start chatting, calling, and sharing moments with your friends right away.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  to="/signup"
                  className="btn btn-primary btn-lg px-8 shadow-lg shadow-primary/20 rounded-2xl font-bold gap-2"
                >
                  <span>Create Account Now</span>
                  <ArrowRight className="size-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline btn-lg px-8 rounded-2xl font-bold gap-2"
                >
                  <LogIn className="size-5" />
                  <span>Log In to Existing</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-base-100 py-8 px-4 sm:px-8 text-center text-xs text-base-content/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Duckling Logo" className="size-6 object-contain" />
            <span className="font-bold text-base-content">Duckling Chat</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/features" className="hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/login" className="hover:text-primary transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="hover:text-primary transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;
