import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends, getStreamToken } from "../lib/api";
import { useThemeStore } from "../store/useThemeStore";

import {
  Channel,
  Chat,
  MessageComposer,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import {
  Phone,
  Video,
  ChevronLeft,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { LANGUAGE_TO_FLAG } from "../constants";
import ChatLoader from "../components/ChatLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY || "tt7vj32ujvs8";

const DARK_THEMES = new Set([
  "dark", "synthwave", "halloween", "forest", "black", "luxury",
  "dracula", "business", "night", "coffee", "dim", "sunset",
]);

const ChatPage = ({ chatClient: globalChatClient }) => {
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();

  const [chatClient, setChatClient] = useState(globalChatClient);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isDark = DARK_THEMES.has(theme);
  const streamTheme = isDark ? "str-chat__theme-dark" : "str-chat__theme-light";

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser && !globalChatClient,
  });

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const activeFriend = friends.find((f) => f._id === targetUserId);

  useEffect(() => {
    let client = globalChatClient;
    let currChannel = null;
    let isMounted = true;

    const initChat = async () => {
      if (!authUser) return;

      try {
        setLoading(true);

        if (!client && tokenData?.token) {
          client = StreamChat.getInstance(STREAM_API_KEY);
          if (client.userID !== authUser._id) {
            if (client.userID) await client.disconnectUser();
            await client.connectUser(
              {
                id: authUser._id,
                name: authUser.fullName,
                image: authUser.profilePic,
              },
              tokenData.token
            );
          }
        }

        if (client && targetUserId) {
          const channelId = [authUser._id, targetUserId].sort().join("-");
          currChannel = client.channel("messaging", channelId, {
            members: [authUser._id, targetUserId],
          });
          await currChannel.watch();
          if (isMounted) {
            setChatClient(client);
            setChannel(currChannel);
          }
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        if (isMounted) toast.error("Could not connect to chat. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initChat();

    return () => {
      isMounted = false;
      if (currChannel) currChannel.stopWatching().catch(() => {});
    };
  }, [globalChatClient, tokenData, authUser, targetUserId]);

  const handleVideoCall = (type = "video") => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}?type=${type}`;
      channel.sendMessage({
        text: `I've started a ${type} call. Join me here: ${callUrl}`,
      });
      toast.success(`Starting ${type} call...`);
      navigate(`/call/${channel.id}?type=${type}`);
    }
  };

  const customChatStyles = {
    "--str-chat__primary-color": "var(--color-primary)",
    "--str-chat__background-color": "var(--color-base-100)",
    "--str-chat__body-background-color": "var(--color-base-100)",
    "--str-chat__border-color": "var(--color-base-300)",
    "--str-chat__text-color": "var(--color-base-content)",
    "--str-chat__active-channel-background-color": "var(--color-base-200)",
    "--str-chat__message-bubble-background-color-own": "var(--color-primary)",
    "--str-chat__message-bubble-text-color-own": "var(--color-primary-content)",
    "--str-chat__message-bubble-background-color-other": "var(--color-base-200)",
    "--str-chat__message-bubble-text-color-other": "var(--color-base-content)",
    "--str-chat__input-background-color": "var(--color-base-200)",
    "--str-chat__input-text-color": "var(--color-base-content)",
    "--str-chat__input-placeholder-color":
      "color-mix(in srgb, var(--color-base-content) 40%, transparent)",
    "--str-chat__input-border-color": "var(--color-base-300)",
    "--str-chat__font-family": "inherit",
  };

  const getFlagUrl = (langName) => {
    if (!langName) return null;
    const code = LANGUAGE_TO_FLAG[langName.toLowerCase()];
    return code ? `https://flagcdn.com/w40/${code}.png` : null;
  };

  const renderMessageText = (text, message) => {
    if (typeof text === "string" && text.includes("/call/")) {
      const match = text.match(
        /(https?:\/\/[^\s]+|\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?::\d+)?\/call\/[^\s]+|\blocalhost:\d+\/call\/[^\s]+)/i
      );
      let rawUrl = match ? match[0] : null;
      if (rawUrl && !rawUrl.startsWith("http")) {
        rawUrl = "http://" + rawUrl;
      }

      const isVoice = text.toLowerCase().includes("voice");

      if (rawUrl) {
        try {
          const urlObj = new URL(rawUrl);
          const callPath = urlObj.pathname + urlObj.search;

          return (
            <div className="my-1 p-3 bg-base-100/90 border border-primary/30 rounded-2xl flex flex-col gap-2.5 shadow-sm text-left backdrop-blur-sm max-w-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`size-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                    isVoice
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary/20 text-secondary"
                  }`}
                >
                  {isVoice ? <Phone className="size-4" /> : <Video className="size-4" />}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-xs text-base-content">
                    {isVoice ? "Voice Call Invite" : "Video Call Invite"}
                  </span>
                  <span className="text-[10px] text-base-content/60 leading-tight mt-0.5">
                    Click join to connect room
                  </span>
                </div>
              </div>
              <Link
                to={callPath}
                className={`btn btn-xs rounded-xl font-bold text-[11px] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-1.5 ${
                  isVoice
                    ? "btn-primary text-primary-content"
                    : "btn-secondary text-secondary-content"
                }`}
              >
                {isVoice ? <Phone className="size-3" /> : <Video className="size-3" />}
                Join {isVoice ? "Voice" : "Video"} Call
              </Link>
            </div>
          );
        } catch (e) {
          console.error("URL parse error in call card:", e);
        }
      }
    }

    // Always return text for normal messages so standard text is displayed!
    return text;
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-base-100 overflow-hidden">
      {/* LEFT SIDEBAR */}
      <div
        className={`w-full md:w-80 border-r border-base-300 flex flex-col h-full bg-base-200/50 backdrop-blur-md select-none shrink-0 ${
          targetUserId ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-5 border-b border-base-300 flex items-center gap-2.5 bg-base-100 shrink-0">
          <Link to="/" className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-base-content">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">Chats</h2>
            <p className="text-[10px] text-base-content/40 leading-none">Connect with study friends</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {loadingFriends ? (
            <div className="flex justify-center items-center h-32">
              <span className="loading loading-spinner loading-md text-primary" />
            </div>
          ) : friends.length === 0 ? (
            <div className="p-6 text-center space-y-3">
              <p className="text-xs text-base-content/40 italic">No friends connected yet</p>
              <Link to="/" className="btn btn-xs btn-primary rounded-lg">Find Friends</Link>
            </div>
          ) : (
            friends.map((friend) => {
              const isSelected = friend._id === targetUserId;
              const name = friend.fullName || "User";
              const pic = friend.profilePic || "";
              return (
                <Link
                  key={friend._id}
                  to={`/chat/${friend._id}`}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    isSelected
                      ? "bg-primary text-primary-content font-semibold shadow-md shadow-primary/20"
                      : "hover:bg-base-300/60 text-base-content/80 hover:text-base-content"
                  }`}
                >
                  <div className="avatar relative shrink-0">
                    <div className={`size-10 rounded-full bg-base-300 ring-2 overflow-hidden ${isSelected ? "ring-primary-content/20" : "ring-base-content/10"}`}>
                      {pic ? (
                        <img src={pic} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-sm">{name.charAt(0).toUpperCase()}</div>
                      )}
                    </div>
                    <span className="absolute bottom-0.5 right-0.5 size-2.5 bg-emerald-500 border-2 border-base-100 rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold truncate block leading-tight">{name}</span>
                    <div className="flex gap-1 mt-0.5">
                      {friend.nativeLanguage && getFlagUrl(friend.nativeLanguage) && (
                        <img src={getFlagUrl(friend.nativeLanguage)} alt="native" className="w-3.5 h-2 object-cover rounded border border-base-content/10" />
                      )}
                      {friend.learningLanguage && getFlagUrl(friend.learningLanguage) && (
                        <img src={getFlagUrl(friend.learningLanguage)} alt="learning" className="w-3.5 h-2 object-cover rounded border border-base-content/10" />
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT: ACTIVE CHAT */}
      <div className={`flex-1 flex flex-col h-full bg-base-100 relative ${!targetUserId ? "hidden md:flex items-center justify-center" : ""}`}>
        {targetUserId ? (
          loading || !chatClient || !channel ? (
            <ChatLoader />
          ) : (
            <div className={`h-full w-full ${streamTheme}`} style={customChatStyles}>
              <Chat client={chatClient} theme={streamTheme}>
                <Channel channel={channel}>
                  <Window>
                    {/* Chat Header */}
                    <div className="str-chat__channel-header px-4 py-3 border-b border-base-300 flex items-center justify-between gap-3 bg-base-100 shrink-0 z-10">
                      <div className="flex items-center gap-3 min-w-0">
                        <button onClick={() => navigate("/chat")} className="btn btn-ghost btn-sm btn-square md:hidden">
                          <ChevronLeft className="size-5" />
                        </button>
                        <div className="avatar shrink-0">
                          <div className="size-9 rounded-full bg-base-300 overflow-hidden ring-2 ring-primary/20">
                            {activeFriend?.profilePic ? (
                              <img src={activeFriend.profilePic} alt={activeFriend.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-sm">
                                {activeFriend?.fullName?.charAt(0).toUpperCase() || "?"}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold truncate">{activeFriend?.fullName || "Study Friend"}</span>
                          <div className="flex gap-1 items-center">
                            {activeFriend?.nativeLanguage && getFlagUrl(activeFriend.nativeLanguage) && (
                              <span className="text-[10px] text-base-content/50 flex items-center gap-0.5">
                                L1: <img src={getFlagUrl(activeFriend.nativeLanguage)} alt="" className="w-3.5 h-2 object-cover rounded" />
                              </span>
                            )}
                            {activeFriend?.learningLanguage && getFlagUrl(activeFriend.learningLanguage) && (
                              <span className="text-[10px] text-base-content/50 flex items-center gap-0.5">
                                L2: <img src={getFlagUrl(activeFriend.learningLanguage)} alt="" className="w-3.5 h-2 object-cover rounded" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleVideoCall("voice")}
                          className="btn btn-ghost border border-base-300 btn-sm btn-square rounded-xl hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all"
                          title="Voice Call"
                        >
                          <Phone className="size-4" />
                        </button>
                        <button
                          onClick={() => handleVideoCall("video")}
                          className="btn btn-ghost border border-base-300 btn-sm btn-square rounded-xl hover:text-secondary hover:bg-secondary/10 hover:border-secondary/30 transition-all"
                          title="Video Call"
                        >
                          <Video className="size-4" />
                        </button>
                      </div>
                    </div>

                    <MessageList renderText={renderMessageText} />
                    <MessageComposer />
                  </Window>
                  <Thread />
                </Channel>
              </Chat>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center p-8 max-w-sm text-center space-y-5 select-none">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
              <MessageSquare className="size-8 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl tracking-tight">Select a conversation</h3>
              <p className="text-xs text-base-content/60 mt-2 leading-relaxed">
                Choose a language partner from the sidebar to start chatting and calling!
              </p>
            </div>
            <Link to="/" className="btn btn-sm btn-primary rounded-xl px-5 shadow-md">Find Partners</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;