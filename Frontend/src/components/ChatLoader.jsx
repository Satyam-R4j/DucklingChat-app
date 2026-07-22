import React from 'react';
import { Loader2 } from 'lucide-react';

const ChatLoader = () => {
  return (
    <div className="h-[93vh] w-full flex flex-col items-center justify-center gap-4 bg-base-100">
      <Loader2 className="size-10 text-primary animate-spin" />
      <p className="text-sm text-base-content/60 animate-pulse font-medium">Loading conversation...</p>
    </div>
  );
};

export default ChatLoader;
