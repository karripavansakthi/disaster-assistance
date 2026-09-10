import React from 'react';

export const CardSkeleton = () => (
  <div className="animate-pulse bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-6 space-y-4">
    <div className="flex justify-between items-start">
      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
    </div>
    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-full"></div>
    <div className="flex justify-between pt-2">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-24"></div>
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-28"></div>
    </div>
  </div>
);

export const MessageSkeleton = () => (
  <div className="animate-pulse flex space-x-3 max-w-xl">
    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>
    <div className="flex-1 space-y-2 py-1">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
    </div>
  </div>
);

export const StatsSkeleton = () => (
  <div className="animate-pulse bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3"></div>
    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
  </div>
);

export default { CardSkeleton, MessageSkeleton, StatsSkeleton };
