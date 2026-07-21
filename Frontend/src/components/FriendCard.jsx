import React from 'react';
import { Link } from 'react-router';
import { MessageSquare, Phone, MapPin, Globe, Languages } from 'lucide-react';
import { LANGUAGE_TO_FLAG } from '../constants';

const FriendCard = ({ friend, isRecommendation = false, onConnect, isConnecting = false, hasSentRequest = false }) => {
  // Extract details with fallbacks
  const {
    _id,
    fullName = 'Duckling User',
    bio = '',
    profilePic = '',
    nativeLanguage = '',
    learningLanguage = '',
    location = ''
  } = friend || {};

  // Get flag image URL from flagcdn
  const getFlagUrl = (langName) => {
    if (!langName) return null;
    const code = LANGUAGE_TO_FLAG[langName.toLowerCase()];
    if (!code) return null;
    return `https://flagcdn.com/w40/${code}.png`;
  };

  const nativeFlagUrl = getFlagUrl(nativeLanguage);
  const learningFlagUrl = getFlagUrl(learningLanguage);

  // Formatting language names to start with capital letters
  const formatLanguage = (lang) => {
    if (!lang) return '';
    return lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  return (
    <div className="card bg-base-100 border border-base-300 hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-xl group overflow-hidden relative flex flex-col h-full rounded-2xl">
      {/* Dynamic Header Gradient Banner */}
      <div className="h-20 w-full bg-gradient-to-r from-primary/20 via-base-200 to-secondary/20 relative" />

      {/* Avatar Container overlapping the banner */}
      <div className="flex justify-center -mt-10 px-4 relative z-10">
        <div className="avatar relative">
          {/* Subtle surrounding glow ring */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-full blur-xs opacity-0 group-hover:opacity-60 transition duration-300"></div>
          
          <div className="relative size-20 rounded-full ring-4 ring-base-100 overflow-hidden bg-base-300 shadow-md">
            {profilePic ? (
              <img
                src={profilePic}
                alt={fullName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-2xl">
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          {/* Active / Online status badge indicator */}
          <span className="absolute bottom-1 right-1 size-3.5 bg-emerald-500 border-2 border-base-100 rounded-full animate-pulse shadow-sm" />
        </div>
      </div>

      {/* Body details */}
      <div className="flex-1 p-5 pt-3 flex flex-col items-center text-center">
        {/* Name */}
        <h3 className="font-bold text-lg text-base-content tracking-tight group-hover:text-primary transition-colors duration-200 truncate w-full max-w-[200px]">
          {fullName}
        </h3>
        
        {/* Username suggestion */}
        <span className="text-xs text-base-content/40 mb-2 font-mono">
          @{fullName.toLowerCase().replace(/\s+/g, '')}
        </span>

        {/* Location */}
        {location ? (
          <div className="flex items-center gap-1 text-xs text-base-content/60 mb-4 bg-base-200/50 px-2 py-0.5 rounded-md border border-base-300/30">
            <MapPin className="size-3.5 text-primary" />
            <span>{location}</span>
          </div>
        ) : (
          <div className="h-6" /> /* spacer */
        )}

        {/* Languages Badges */}
        <div className="flex flex-wrap gap-2 justify-center mb-4 w-full">
          {nativeLanguage && (
            <div 
              className="tooltip tooltip-bottom" 
              data-tip={`Native in ${formatLanguage(nativeLanguage)}`}
            >
              <span className="badge badge-sm py-2.5 px-3 bg-primary/10 text-primary border border-primary/20 rounded-full font-medium flex items-center gap-1.5">
                <Globe className="size-3 text-primary/70" />
                <span className="text-[10px] uppercase font-semibold">Native:</span>
                {nativeFlagUrl ? (
                  <img
                    src={nativeFlagUrl}
                    alt={nativeLanguage}
                    className="w-4.5 h-3 object-cover rounded-xs border border-base-content/10 shadow-3xs"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xs">🌐</span>
                )}
              </span>
            </div>
          )}
          
          {learningLanguage && (
            <div 
              className="tooltip tooltip-bottom" 
              data-tip={`Learning ${formatLanguage(learningLanguage)}`}
            >
              <span className="badge badge-sm py-2.5 px-3 bg-secondary/10 text-secondary border border-secondary/20 rounded-full font-medium flex items-center gap-1.5">
                <Languages className="size-3 text-secondary/70" />
                <span className="text-[10px] uppercase font-semibold">Learning:</span>
                {learningFlagUrl ? (
                  <img
                    src={learningFlagUrl}
                    alt={learningLanguage}
                    className="w-4.5 h-3 object-cover rounded-xs border border-base-content/10 shadow-3xs"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xs">🌐</span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="w-full flex-1 flex flex-col justify-center">
          {bio ? (
            <p className="text-xs text-base-content/70 italic line-clamp-2 px-1 text-center font-normal leading-relaxed">
              "{bio}"
            </p>
          ) : (
            <p className="text-xs text-base-content/30 italic px-1 text-center font-normal">
              No bio shared yet
            </p>
          )}
        </div>
      </div>

      {/* Action Footer Button Area */}
      <div className="p-4 border-t border-base-300/40 bg-base-200/30 flex gap-2 w-full mt-auto">
        {isRecommendation ? (
          <button
            type="button"
            onClick={onConnect}
            disabled={hasSentRequest || isConnecting}
            className={`btn btn-sm flex-1 gap-2 rounded-xl transition-all duration-200 border-0 ${
              hasSentRequest
                ? "bg-base-300 text-base-content/40 cursor-not-allowed"
                : "btn-secondary text-secondary-content hover:scale-[1.02] shadow-xs hover:shadow-md cursor-pointer"
            }`}
          >
            {hasSentRequest ? (
              <>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Request Sent</span>
              </>
            ) : isConnecting ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Connect</span>
              </>
            )}
          </button>
        ) : (
          <>
            <Link 
              to={`/chat?userId=${_id}`} 
              className="btn btn-primary btn-sm flex-1 gap-2 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 text-primary-content hover:scale-[1.02] border-0"
            >
              <MessageSquare className="size-4" />
              <span>Chat</span>
            </Link>
            <Link 
              to={`/call?userId=${_id}`} 
              className="btn btn-ghost border border-base-300 btn-sm btn-square rounded-xl hover:text-secondary hover:bg-secondary/10 hover:border-secondary/30 transition-all duration-200 hover:scale-[1.02]"
              title="Call"
            >
              <Phone className="size-4" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default FriendCard;