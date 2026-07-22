import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken, getUserFriends } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import { Globe, Languages } from "lucide-react";
import { LANGUAGE_TO_FLAG } from "../constants";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY || "tt7vj32ujvs8";

const CallPage = () => {
  const { id: callId } = useParams();
  const [searchParams] = useSearchParams();
  const callType = searchParams.get("type") || "video";

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let videoClient;
    let callInstance;
    let isMounted = true;

    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        setIsConnecting(true);
        console.log("Initializing Stream video client...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        // Safe track initialization
        try {
          if (callType === "voice") {
            await callInstance.camera.disable();
          } else {
            await callInstance.camera.enable();
          }
        } catch (e) {
          console.warn("Camera track configuration warning:", e);
        }

        try {
          await callInstance.microphone.enable();
        } catch (e) {
          console.warn("Microphone track configuration warning:", e);
        }

        if (isMounted) {
          setClient(videoClient);
          setCall(callInstance);
        }
      } catch (error) {
        console.error("Error joining call:", error);
        if (isMounted) {
          toast.error("Could not join the call. Please check permissions and try again.");
        }
      } finally {
        if (isMounted) {
          setIsConnecting(false);
        }
      }
    };

    initCall();

    return () => {
      isMounted = false;
      const cleanup = async () => {
        if (callInstance) {
          try {
            await callInstance.leave();
          } catch (e) {}
        }
        if (videoClient) {
          try {
            await videoClient.disconnectUser();
          } catch (e) {}
        }
      };
      cleanup();
    };
  }, [tokenData?.token, authUser, callId, callType]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen w-screen bg-slate-950 text-white flex flex-col justify-between items-center overflow-hidden select-none">
      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent callType={callType} />
          </StreamCall>
        </StreamVideo>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <p className="text-slate-400">Could not initialize call. Please refresh or try again later.</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary btn-sm rounded-xl">
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

const CallContent = ({ callType }) => {
  const { useCallCallingState, useRemoteParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const remoteParticipants = useRemoteParticipants();
  const navigate = useNavigate();

  // Fetch friends list to show caller profile details
  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const otherParticipantId = remoteParticipants[0]?.userId;
  const activeFriend = friends.find((f) => f._id === otherParticipantId);

  const getFlagUrl = (langName) => {
    if (!langName) return null;
    const code = LANGUAGE_TO_FLAG[langName.toLowerCase()];
    return code ? `https://flagcdn.com/w40/${code}.png` : null;
  };

  // Single source of truth for leaving navigation
  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/chat");
    }
  }, [callingState, navigate]);

  const isConnected = callingState === CallingState.JOINED;
  const isRinging = callingState === CallingState.RINGING || callingState === CallingState.JOINING;

  const partnerName = activeFriend?.fullName || remoteParticipants[0]?.name || "Language Partner";
  const partnerPic = activeFriend?.profilePic || remoteParticipants[0]?.image || "";

  return (
    <div className="w-full h-full flex flex-col justify-between items-center relative p-4">
      {/* Top Overlay Section: Status & Partner Details */}
      <div className="z-20 w-full max-w-md flex flex-col items-center gap-3 pt-2">
        <span className="badge bg-slate-900 border border-slate-800 text-[11px] px-3 py-1 rounded-full text-slate-400 font-semibold tracking-wider uppercase animate-pulse">
          {isRinging && "Connecting..."}
          {callingState === CallingState.CONNECTING && "Connecting..."}
          {isConnected && "Connected"}
          {callingState === CallingState.LEFT && "Call Ended"}
        </span>

        {/* Partner Info Card */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl">
          <div className="avatar">
            <div className="size-10 rounded-full overflow-hidden bg-slate-800 ring-2 ring-primary/30">
              {partnerPic ? (
                <img src={partnerPic} alt={partnerName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-bold text-sm">
                  {partnerName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col text-left">
            <h2 className="text-sm font-bold tracking-tight">{partnerName}</h2>
            {activeFriend && (
              <div className="flex gap-2 items-center mt-0.5">
                {activeFriend.nativeLanguage && (
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span>Native: {activeFriend.nativeLanguage}</span>
                    {getFlagUrl(activeFriend.nativeLanguage) && (
                      <img src={getFlagUrl(activeFriend.nativeLanguage)} alt="" className="w-3.5 h-2 object-cover rounded-2xs" />
                    )}
                  </span>
                )}
                {activeFriend.learningLanguage && (
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span>Learning: {activeFriend.learningLanguage}</span>
                    {getFlagUrl(activeFriend.learningLanguage) && (
                      <img src={getFlagUrl(activeFriend.learningLanguage)} alt="" className="w-3.5 h-2 object-cover rounded-2xs" />
                    )}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Video Viewport using StreamTheme & SpeakerLayout */}
      <div className="flex-1 w-full max-w-5xl flex items-center justify-center relative overflow-hidden my-2 rounded-3xl border border-slate-800/60 bg-slate-900/40">
        <StreamTheme className="w-full h-full flex flex-col justify-center items-center">
          <SpeakerLayout />
        </StreamTheme>
      </div>

      {/* Control Panel using Stream's CallControls */}
      <div className="z-20 pb-4">
        <StreamTheme>
          <CallControls onLeave={() => navigate("/chat")} />
        </StreamTheme>
      </div>
    </div>
  );
};

export default CallPage;