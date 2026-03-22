import React from "react";

const SkeletonBlock = ({ h = "h-4", w = "w-full", className = "" }) => (
  <div className={`${h} ${w} ${className} rounded-lg bg-white/5 animate-pulse`} />
);

export const CardSkeleton = () => (
  <div className="glass p-5">
    <div className="flex items-start justify-between mb-4">
      <SkeletonBlock h="h-10" w="w-10" className="rounded-xl flex-shrink-0" />
      <SkeletonBlock h="h-5" w="w-16" className="rounded-full" />
    </div>
    <SkeletonBlock h="h-4" w="w-3/4" className="mb-2" />
    <SkeletonBlock h="h-3" w="w-full" className="mb-1" />
    <SkeletonBlock h="h-3" w="w-5/6" className="mb-4" />
    <SkeletonBlock h="h-3" w="w-1/3" />
  </div>
);

export const StatSkeleton = () => (
  <div className="glass p-4">
    <div className="flex items-center gap-2 mb-2">
      <SkeletonBlock h="h-4" w="w-4" className="rounded" />
      <SkeletonBlock h="h-3" w="w-20" />
    </div>
    <SkeletonBlock h="h-7" w="w-16" />
  </div>
);

export const ListItemSkeleton = () => (
  <div className="flex items-center justify-between py-2 border-b border-white/5">
    <div className="flex items-center gap-2 flex-1">
      <SkeletonBlock h="h-2" w="w-2" className="rounded-full flex-shrink-0" />
      <SkeletonBlock h="h-3" w="w-1/2" />
    </div>
    <SkeletonBlock h="h-3" w="w-16" />
  </div>
);

export const ProblemRowSkeleton = () => (
  <div className="flex items-center justify-between p-4 rounded-xl border border-white/7">
    <div className="flex items-center gap-3 flex-1">
      <SkeletonBlock h="h-2" w="w-2" className="rounded-full flex-shrink-0" />
      <div className="flex-1">
        <SkeletonBlock h="h-4" w="w-1/2" className="mb-1" />
        <SkeletonBlock h="h-3" w="w-1/3" />
      </div>
    </div>
    <SkeletonBlock h="h-5" w="w-16" className="rounded-full" />
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-4">
    {[1,2,3,4].map(i => (
      <div key={i}>
        <SkeletonBlock h="h-3" w="w-24" className="mb-2" />
        <SkeletonBlock h="h-11" w="w-full" />
      </div>
    ))}
    <SkeletonBlock h="h-11" w="w-full" className="mt-2" />
  </div>
);

export default SkeletonBlock;
