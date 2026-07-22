import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { getFriendRequests, acceptFriendRequest } from "../lib/api";
import { 
  Bell, 
  UserCheck, 
  MessageSquare, 
  Phone, 
  Inbox, 
  Languages, 
  Globe, 
  Check, 
  Sparkles, 
  ArrowLeft 
} from "lucide-react";
import toast from "react-hot-toast";
import { LANGUAGE_TO_FLAG } from "../constants";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("requests");
  const [acceptingId, setAcceptingId] = useState(null);

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast.success("Friend request accepted! You are now connected.");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to accept friend request");
    },
    onSettled: () => {
      setAcceptingId(null);
    }
  });

  const handleAccept = (requestId) => {
    setAcceptingId(requestId);
    acceptMutation(requestId);
  };

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  const getFlagUrl = (langName) => {
    if (!langName) return null;
    const code = LANGUAGE_TO_FLAG[langName.toLowerCase()];
    if (!code) return null;
    return `https://flagcdn.com/w40/${code}.png`;
  };

  const formatLanguage = (lang) => {
    if (!lang) return "";
    return lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="btn btn-ghost btn-sm btn-square rounded-xl border border-base-300 hover:bg-base-200"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Notifications
          </h1>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300 rounded-3xl shadow-xl overflow-hidden backdrop-blur-md bg-opacity-70">
        {/* Tab Selection Headers */}
        <div className="flex border-b border-base-300 bg-base-200/30 p-2 gap-2">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
              activeTab === "requests"
                ? "bg-base-100 text-primary shadow-xs border border-base-300/50"
                : "text-base-content/60 hover:text-base-content hover:bg-base-200/50"
            }`}
          >
            <UserCheck className="size-4" />
            <span>Friend Requests</span>
            {incomingRequests.length > 0 && (
              <span className="badge badge-primary badge-sm font-semibold ml-1 animate-pulse">
                {incomingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
              activeTab === "activity"
                ? "bg-base-100 text-secondary shadow-xs border border-base-300/50"
                : "text-base-content/60 hover:text-base-content hover:bg-base-200/50"
            }`}
          >
            <Sparkles className="size-4" />
            <span>Recent Activity</span>
            {acceptedRequests.length > 0 && (
              <span className="badge badge-secondary badge-sm font-semibold ml-1">
                {acceptedRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-sm text-base-content/60 animate-pulse">Loading notifications...</p>
          </div>
        ) : (
          <div className="p-6">
            {activeTab === "requests" ? (
              incomingRequests.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center justify-center p-6">
                  <div className="relative mb-6">
                    <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative size-16 bg-primary/5 rounded-full border border-primary/20 flex items-center justify-center text-primary">
                      <Inbox className="size-8" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-base-content mb-1">Inbox Clear</h3>
                  <p className="text-sm text-base-content/50 max-w-sm mb-6 leading-relaxed">
                    You don't have any incoming friend requests at the moment.
                  </p>
                  <Link 
                    to="/" 
                    className="btn btn-primary btn-sm rounded-xl px-5 text-primary-content shadow-xs hover:shadow-md hover:scale-[1.02] border-0"
                  >
                    Find Language Partners
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {incomingRequests.map((req) => {
                    const sender = req.sender;
                    if (!sender) return null;
                    const isUserAccepting = isPending && acceptingId === req._id;

                    return (
                      <div
                        key={req._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-base-200/20 border border-base-300/60 hover:border-primary/30 rounded-2xl transition-all duration-200 gap-4 group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="avatar">
                            <div className="size-14 rounded-full ring-2 ring-primary/20 overflow-hidden bg-base-300 shadow-xs relative">
                              {sender.profilePic ? (
                                <img
                                  src={sender.profilePic}
                                  alt={sender.fullName}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                                  {sender.fullName?.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="font-bold text-base-content group-hover:text-primary transition-colors duration-200">
                              {sender.fullName}
                            </h4>
                            <p className="text-xs text-base-content/40 font-mono">
                              @{sender.fullName?.toLowerCase().replace(/\s+/g, "")}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 pt-1">
                              {sender.nativeLanguage && (
                                <span className="badge badge-sm py-2 px-2.5 bg-primary/10 text-primary border-0 rounded-lg text-[10px] font-medium flex items-center gap-1">
                                  <Globe className="size-3 text-primary/70" />
                                  <span>Native: {formatLanguage(sender.nativeLanguage)}</span>
                                  {getFlagUrl(sender.nativeLanguage) ? (
                                    <img
                                      src={getFlagUrl(sender.nativeLanguage)}
                                      alt={sender.nativeLanguage}
                                      className="w-3.5 h-2.5 object-cover rounded-xs border border-base-content/10"
                                    />
                                  ) : (
                                    <span>🌐</span>
                                  )}
                                </span>
                              )}
                              {sender.learningLanguage && (
                                <span className="badge badge-sm py-2 px-2.5 bg-secondary/10 text-secondary border-0 rounded-lg text-[10px] font-medium flex items-center gap-1">
                                  <Languages className="size-3 text-secondary/70" />
                                  <span>Learning: {formatLanguage(sender.learningLanguage)}</span>
                                  {getFlagUrl(sender.learningLanguage) ? (
                                    <img
                                      src={getFlagUrl(sender.learningLanguage)}
                                      alt={sender.learningLanguage}
                                      className="w-3.5 h-2.5 object-cover rounded-xs border border-base-content/10"
                                    />
                                  ) : (
                                    <span>🌐</span>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleAccept(req._id)}
                            disabled={isPending}
                            className="btn btn-primary btn-sm px-4 rounded-xl gap-2 shadow-xs hover:shadow-md transition-all duration-200 text-primary-content border-0"
                          >
                            {isUserAccepting ? (
                              <>
                                <span className="loading loading-spinner loading-xs"></span>
                                <span>Accepting...</span>
                              </>
                            ) : (
                              <>
                                <Check className="size-4" />
                                <span>Accept</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              acceptedRequests.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center justify-center p-6">
                  <div className="relative mb-6">
                    <div className="absolute -inset-4 bg-secondary/10 rounded-full blur-xl"></div>
                    <div className="relative size-16 bg-secondary/5 rounded-full border border-secondary/20 flex items-center justify-center text-secondary">
                      <Bell className="size-8" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-base-content mb-1">No Activity</h3>
                  <p className="text-sm text-base-content/50 max-w-sm leading-relaxed">
                    Once users accept your connections, your notifications will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {acceptedRequests.map((req) => {
                    const recipient = req.recipient;
                    if (!recipient) return null;

                    return (
                      <div
                        key={req._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-base-200/20 border border-base-300/60 hover:border-secondary/30 rounded-2xl transition-all duration-200 gap-4 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="avatar">
                            <div className="size-12 rounded-full overflow-hidden bg-base-300 relative ring-2 ring-secondary/10">
                              {recipient.profilePic ? (
                                <img
                                  src={recipient.profilePic}
                                  alt={recipient.fullName}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-secondary/10 text-secondary font-bold text-base">
                                  {recipient.fullName?.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-base-content group-hover:text-secondary transition-colors duration-200">
                                {recipient.fullName}
                              </h4>
                              <span className="badge badge-success badge-sm text-[10px] text-success-content font-bold border-0">
                                Connected
                              </span>
                            </div>
                            <p className="text-xs text-base-content/60">
                              Accepted your friend request. Start a conversation!
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Link
                            to={`/chat?userId=${recipient._id}`}
                            className="btn btn-secondary btn-sm px-4 rounded-xl gap-2 text-secondary-content border-0 shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                          >
                            <MessageSquare className="size-4" />
                            <span>Chat</span>
                          </Link>
                          <Link
                            to={`/call?userId=${recipient._id}`}
                            className="btn btn-ghost border border-base-300 btn-sm btn-square rounded-xl hover:text-secondary hover:bg-secondary/10 hover:border-secondary/30 transition-all duration-200 hover:scale-105"
                            title="Call"
                          >
                            <Phone className="size-4" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
