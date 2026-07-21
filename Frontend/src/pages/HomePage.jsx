import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { User as UserIcon, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import FriendCard from "../components/FriendCard.jsx";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestIds, setOutgoingRequestsIds] = useState(new Set());

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

  const {
    mutate: sendRequestMutation,
    isPending,
  } = useMutation({
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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm rounded-xl border-base-300">
            <UserIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {/* Friends Section */}
        <div className="space-y-6">
          {loadingFriends ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : friends.length === 0 ? (
            <div className="text-center py-16 bg-base-200/40 rounded-2xl border border-dashed border-base-300 flex flex-col items-center justify-center p-6">
              <p className="text-base-content/60 text-sm">No friends in the database yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </div>

        {/* Recommended Partners Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-secondary animate-pulse" />
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content">
              People You May Know
            </h3>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="text-center py-12 bg-base-200/30 rounded-2xl border border-dashed border-base-300 p-6">
              <p className="text-sm text-base-content/50">No recommendations available right now</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {recommendedUsers.map((user) => (
                <FriendCard
                  key={user._id}
                  friend={user}
                  isRecommendation={true}
                  onConnect={() => sendRequestMutation(user._id)}
                  isConnecting={isPending}
                  hasSentRequest={outgoingRequestIds.has(user._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
