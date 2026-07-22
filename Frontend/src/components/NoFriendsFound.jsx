import React from 'react';
import { Users, Search } from 'lucide-react';

const NoFriendsFound = () => {
  return (
    <div className="card bg-base-200/50 border border-base-300 rounded-3xl p-8 md:p-12 text-center max-w-lg mx-auto flex flex-col items-center gap-4 relative overflow-hidden backdrop-blur-md shadow-lg">
      {/* Background glow effects */}
      <div className="absolute -top-10 -right-10 size-40 bg-primary/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 size-40 bg-secondary/10 rounded-full blur-2xl" />

      {/* Styled icon box */}
      <div className="size-16 rounded-2xl bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center text-primary mb-2 shadow-inner">
        <Users className="size-8" />
      </div>

      <h3 className="text-xl font-bold tracking-tight text-base-content">No Friends Found</h3>
      <p className="text-sm text-base-content/60 max-w-sm">
        You haven't added any study partners yet. Explore the profiles below and send some friend requests to start practicing!
      </p>

      {/* Action cue */}
      <div className="flex items-center gap-2 text-xs text-primary font-medium animate-pulse mt-2">
        <Search className="size-3.5" />
        <span>Discover language partners below</span>
      </div>
    </div>
  );
};

export default NoFriendsFound;
