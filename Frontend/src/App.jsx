import { Navigate, Route, Routes } from "react-router";

import HomePage from "./pages/HomePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios.js";
import PageLoader from "./components/PageLoader.jsx";
import { getAuthUser } from "./lib/api.js";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAutheticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-base-100 text-base-content" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAutheticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAutheticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={!isAutheticated ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={
            !isAutheticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAutheticated && isOnboarded ? (
              <NotificationsPage />
            ) : (
              <Navigate to={!isAutheticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/call"
          element={
            isAutheticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAutheticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/chat"
          element={
            isAutheticated && isOnboarded ? (
              <ChatPage />
            ) : (
              <Navigate to={!isAutheticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            isAutheticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
