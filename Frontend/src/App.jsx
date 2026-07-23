import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import FeaturesPage from "./pages/FeaturesPage.jsx";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "./lib/api.js";
import { StreamChat } from "stream-chat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY || "tt7vj32ujvs8";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();
  const [chatClient, setChatClient] = useState(null);

  const isAutheticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: isAutheticated,
  });

  // Global Chat Client Connection
  useEffect(() => {
    if (!authUser || !tokenData?.token) {
      const client = StreamChat.getInstance(STREAM_API_KEY);
      if (client.userID) {
        client.disconnectUser();
      }
      setChatClient(null);
      return;
    }

    const client = StreamChat.getInstance(STREAM_API_KEY);
    
    // Reuse connection if already connected to prevent double-connect races
    if (client.userID === authUser._id) {
      setChatClient(client);
      return;
    }

    let isConnected = true;

    const connectChat = async () => {
      try {
        if (client.userID) {
          await client.disconnectUser();
        }

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );
        if (isConnected) {
          setChatClient(client);
        }
      } catch (err) {
        console.error("Error connecting global Stream Chat client:", err);
      }
    };

    connectChat();

    return () => {
      isConnected = false;
    };
  }, [authUser, tokenData?.token]);

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
        <Route path="/features" element={<FeaturesPage />} />
        <Route
          path="/notifications"
          element={
            isAutheticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAutheticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/call/:id"
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
              <Layout showSidebar={false}>
                <ChatPage chatClient={chatClient} />
              </Layout>
            ) : (
              <Navigate to={!isAutheticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            isAutheticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage chatClient={chatClient} />
              </Layout>
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
