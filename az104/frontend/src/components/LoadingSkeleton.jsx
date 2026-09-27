import React from 'react';

export const LoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse p-6">
      <div className="h-8 bg-slate-800/60 rounded-xl w-64"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-800/40 rounded-2xl border border-slate-800/60 p-4 space-y-3">
            <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
            <div className="h-8 bg-slate-700/70 rounded w-3/4"></div>
          </div>
        ))}
      </div>
      <div className="h-64 bg-slate-800/30 rounded-2xl border border-slate-800/60"></div>
    </div>
  );
};
