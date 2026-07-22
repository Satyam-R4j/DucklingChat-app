import React from 'react';
import { Video } from 'lucide-react';

const CallButton = ({ handleVideoCall }) => {
  return (
    <button
      onClick={() => handleVideoCall("video")}
      className="absolute top-4 right-16 z-20 btn btn-circle btn-primary btn-sm text-primary-content hover:scale-105 transition-all shadow-md"
      title="Start Video Call"
    >
      <Video className="size-4" />
    </button>
  );
};

export default CallButton;
