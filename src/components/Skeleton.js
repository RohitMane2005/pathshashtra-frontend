import React from "react";

const SkeletonBlock = ({ h = "h-4", w = "w-full", className = "" }) => (
  <div className={`${h} ${w} ${className} rounded-lg bg-white/[0.04] animate-pulse`} />
);

export const CardSkeleton = () => (
  <div className="card p-5">
    <div className="flex items-start justify-between mb-4">
      <SkeletonBlock h="h-9" w="w-9" className="rounded-lg flex-shrink-0" />
      <SkeletonBlock h="h-3.5" w="w-3.5" className="rounded" />
    </div>
    <SkeletonBlock h="h-3.5" w="w-3/4" className="mb-2" />
    <SkeletonBlock h="h-3" w="w-full" className="mb-1" />
    <SkeletonBlock h="h-3" w="w-5/6" className="mb-4" />
    <SkeletonBlock h="h-3" w="w-1/3" />
  </div>
);

export const StatSkeleton = () => (
  <div className="card p-4">
    <div className="flex items-center gap-2 mb-2.5">
      <SkeletonBlock h="h-3.5" w="w-3.5" className="rounded" />
      <SkeletonBlock h="h-3" w="w-16" />
    </div>
    <SkeletonBlock h="h-6" w="w-14" />
  </div>
);

export const ListItemSkeleton = () => (
  <div className="flex items-center justify-between py-2.5 border-b border-white/[0.04]">
    <div className="flex items-center gap-2.5 flex-1">
      <SkeletonBlock h="h-1.5" w="w-1.5" className="rounded-full flex-shrink-0" />
      <SkeletonBlock h="h-3" w="w-1/2" />
    </div>
    <SkeletonBlock h="h-3" w="w-14" />
  </div>
);

export const ProblemRowSkeleton = () => (
  <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06]">
    <div className="flex items-center gap-3 flex-1">
      <SkeletonBlock h="h-1.5" w="w-1.5" className="rounded-full flex-shrink-0" />
      <div className="flex-1">
        <SkeletonBlock h="h-3.5" w="w-1/2" className="mb-1.5" />
        <SkeletonBlock h="h-3" w="w-1/3" />
      </div>
    </div>
    <SkeletonBlock h="h-5" w="w-14" className="rounded-md" />
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-4">
    {[1,2,3,4].map(i => (
      <div key={i}>
        <SkeletonBlock h="h-3" w="w-24" className="mb-2" />
        <SkeletonBlock h="h-10" w="w-full" className="rounded-lg" />
      </div>
    ))}
    <SkeletonBlock h="h-10" w="w-full" className="mt-2 rounded-lg" />
  </div>
);

export default SkeletonBlock;
