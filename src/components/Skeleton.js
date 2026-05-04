import React from "react";

const SkeletonBlock = ({ h = "h-4", w = "w-full", className = "" }) => (
  <div className={`${h} ${w} ${className}`} style={{ borderRadius: 6, background: "var(--border)", animation: "pulse 1.5s ease-in-out infinite" }} />
);

export const CardSkeleton = () => (
  <div className="lc-card">
    <SkeletonBlock h="h-4" w="w-3/4" className="mb-3" />
    <SkeletonBlock h="h-3" w="w-full" className="mb-2" />
    <SkeletonBlock h="h-3" w="w-5/6" className="mb-4" />
    <SkeletonBlock h="h-3" w="w-1/3" />
  </div>
);

export const StatSkeleton = () => (
  <div className="stat-card">
    <SkeletonBlock h="h-6" w="w-12" className="mx-auto mb-2" />
    <SkeletonBlock h="h-3" w="w-16" className="mx-auto" />
  </div>
);

export const ListItemSkeleton = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
    <SkeletonBlock h="h-3" w="w-1/2" />
    <SkeletonBlock h="h-3" w="w-14" />
  </div>
);

export const ProblemRowSkeleton = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
    <SkeletonBlock h="h-3" w="w-1/2" />
    <SkeletonBlock h="h-5" w="w-14" />
  </div>
);

export const ProfileSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    {[1,2,3,4].map(i => (
      <div key={i}>
        <SkeletonBlock h="h-3" w="w-24" className="mb-2" />
        <SkeletonBlock h="h-10" w="w-full" />
      </div>
    ))}
    <SkeletonBlock h="h-10" w="w-full" className="mt-2" />
  </div>
);

export default SkeletonBlock;
