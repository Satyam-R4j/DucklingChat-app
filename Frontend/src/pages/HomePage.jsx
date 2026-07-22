import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { LANGUAGE_TO_FLAG } from "../constants";

// Helper utilities to replace missing exports and avoid import errors
const capitialize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getLanguageFlag = (langName) => {
  if (!langName) return null;
  const code = LANGUAGE_TO_FLAG[langName.toLowerCase()];
  if (!code) return null;
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={langName}
      className="w-4 h-2.5 object-cover rounded-2xs inline-block mr-1.5 border border-base-content/10 shadow-3xs"
      loading="lazy"
    />
  );
};

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      toast.success("Friend request sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to send friend request");
    }
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        const recipientId = req.recipient?._id || req.recipient;
        if (recipientId) {
          outgoingIds.add(recipientId.toString());
        }
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-base-100">
      <div className="container mx-auto space-y-10">
        
        {/* Your Friends Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-base-300/40 pb-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <UsersIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
              <p className="text-xs text-base-content/50 mt-0.5">Your connected language learning circle</p>
            </div>
          </div>
          <Link to="/notifications" className="btn btn-outline btn-sm rounded-xl border-base-300 gap-1.5 hover:bg-base-200">
            <UsersIcon className="size-4" />
            <span>Friend Requests</span>
          </Link>
        </div>

        {/* Friends Section */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* Recommended Partners Section */}
        <section className="space-y-6 pt-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-base-300/40 pb-5">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Sparkles className="size-5 text-secondary animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                <p className="text-xs text-base-content/50 mt-0.5">
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center border border-base-300 rounded-3xl max-w-lg mx-auto">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-100 border border-base-300 hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-xl group overflow-hidden relative flex flex-col h-full rounded-2xl"
                  >
                    {/* Header Banner */}
                    <div className="h-16 w-full bg-gradient-to-r from-primary/15 via-base-200 to-secondary/15 relative" />

                    {/* Avatar Container overlapping the banner */}
                    <div className="flex justify-center -mt-8 px-4 relative z-10">
                      <div className="avatar relative">
                        {/* Glow ring */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-full blur-xs opacity-0 group-hover:opacity-60 transition duration-300"></div>
                        <div className="relative size-16 rounded-full ring-4 ring-base-100 overflow-hidden bg-base-300 shadow-md">
                          <img 
                            src={user.profilePic || "https://robohash.org/user.png"} 
                            alt={user.fullName} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Body details */}
                    <div className="flex-1 p-5 pt-3 flex flex-col items-center text-center space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-base-content tracking-tight group-hover:text-primary transition-colors duration-200">
                          {user.fullName}
                        </h3>
                        <span className="text-xs text-base-content/40 font-mono">
                          @{user.fullName.toLowerCase().replace(/\s+/g, '')}
                        </span>
                      </div>

                      {user.location && (
                        <div className="flex items-center gap-1 text-xs text-base-content/60 bg-base-200/50 px-2 py-0.5 rounded-md border border-base-300/30">
                          <MapPinIcon className="size-3.5 text-primary" />
                          <span>{user.location}</span>
                        </div>
                      )}

                      {/* Languages Badges */}
                      <div className="flex flex-wrap gap-2 justify-center w-full">
                        <span className="badge badge-sm py-2.5 px-3 bg-secondary/10 text-secondary border border-secondary/20 rounded-full font-medium flex items-center gap-1">
                          {getLanguageFlag(user.nativeLanguage)}
                          <span>Native: {capitialize(user.nativeLanguage)}</span>
                        </span>
                        <span className="badge badge-sm py-2.5 px-3 bg-primary/10 text-primary border border-primary/20 rounded-full font-medium flex items-center gap-1">
                          {getLanguageFlag(user.learningLanguage)}
                          <span>Learning: {capitialize(user.learningLanguage)}</span>
                        </span>
                      </div>

                      {user.bio ? (
                        <p className="text-xs text-base-content/75 italic line-clamp-2 px-1 text-center font-normal leading-relaxed">
                          "{user.bio}"
                        </p>
                      ) : (
                        <p className="text-xs text-base-content/30 italic px-1 text-center font-normal">
                          No bio shared yet
                        </p>
                      )}
                    </div>

                    {/* Action button */}
                    <div className="p-4 border-t border-base-300/40 bg-base-200/30 w-full mt-auto">
                      <button
                        className={`btn btn-sm w-full gap-2 rounded-xl transition-all duration-200 border-0 ${
                          hasRequestBeenSent 
                            ? "bg-base-300 text-base-content/40 cursor-not-allowed" 
                            : "btn-primary text-primary-content hover:scale-[1.02] shadow-xs hover:shadow-md cursor-pointer"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4" />
                            <span>Request Sent</span>
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4" />
                            <span>Send Friend Request</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
