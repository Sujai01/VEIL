import React from 'react';
import { ActiveTab } from '../types';

interface TabSkeletonProps {
  activeTab: ActiveTab;
}

export default function TabSkeleton({ activeTab }: TabSkeletonProps) {
  // Render specific layout matching the selected tab
  const renderSkeletonContent = () => {
    switch (activeTab) {
      case 'HOME':
        return (
          <div className="space-y-6">
            {/* Quick Actions circular/rounded grid skeleton */}
            <div className="grid grid-cols-3 gap-3.5 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-surface-container border border-outline-variant/15 dark:border-outline/10 rounded-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-highest dark:bg-neutral-800 animate-pulse"></div>
                  <div className="w-12 h-3 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Main spotlight category title skeleton */}
            <div className="space-y-2 pt-2">
              <div className="w-32 h-5 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
              <div className="w-48 h-3.5 bg-surface-container-highest dark:bg-neutral-800/60 rounded animate-pulse"></div>
            </div>

            {/* Card skeletons */}
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-5 bg-white dark:bg-surface-container border border-outline-variant/15 dark:border-outline/10 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest dark:bg-neutral-800 animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="w-24 h-4 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                      <div className="w-16 h-3 bg-surface-container-highest dark:bg-neutral-800/60 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-3.5 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                    <div className="w-5/6 h-3.5 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                  </div>
                  <div className="pt-2 flex justify-between border-t border-surface-container-high/30 dark:border-outline/10">
                    <div className="w-14 h-6 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                    <div className="w-14 h-6 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'SEARCH':
        return (
          <div className="space-y-6 pt-2">
            {/* Search Input skeleton */}
            <div className="w-full h-12 bg-white dark:bg-surface-container border border-outline-variant/15 dark:border-outline/10 rounded-full flex items-center px-4 gap-3">
              <div className="w-5 h-5 rounded-full bg-surface-container-highest dark:bg-neutral-800 animate-pulse"></div>
              <div className="w-32 h-4 bg-surface-container-highest dark:bg-neutral-800/60 rounded animate-pulse"></div>
            </div>

            {/* Categories scroll tracker */}
            <div className="flex gap-2.5 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-8 bg-surface-container-highest dark:bg-neutral-800 rounded-full shrink-0 animate-pulse"></div>
              ))}
            </div>

            {/* List entries skeleton */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-white dark:bg-surface-container border border-outline-variant/15 dark:border-outline/10 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-surface-container-highest dark:bg-neutral-800 rounded-xl animate-pulse"></div>
                    <div className="space-y-1.5">
                      <div className="w-28 h-4 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                      <div className="w-16 h-3 bg-surface-container-highest dark:bg-neutral-800/60 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-16 h-8 bg-surface-container-highest dark:bg-neutral-800 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'BLIND_DATE':
        return (
          <div className="space-y-6 pt-2">
            {/* High fidelity matching view skeleton */}
            <div className="p-6 bg-white dark:bg-surface-container border border-outline-variant/15 dark:border-outline/10 rounded-3xl space-y-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-surface-container-highest dark:bg-neutral-800 animate-pulse flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 animate-ping"></div>
              </div>
              <div className="space-y-2 w-full flex flex-col items-center">
                <div className="w-40 h-5 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                <div className="w-64 h-3.5 bg-surface-container-highest dark:bg-neutral-800/60 rounded animate-pulse"></div>
              </div>
              <div className="w-full grid grid-cols-2 gap-4 border-t border-b border-surface-container-high/30 dark:border-outline/10 py-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-surface/50 dark:bg-surface-container-low">
                    <div className="w-16 h-3 bg-surface-container-highest dark:bg-neutral-800/65 rounded animate-pulse"></div>
                    <div className="w-8 h-4 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="w-full h-12 bg-primary/20 dark:bg-primary/10 rounded-full animate-pulse"></div>
            </div>
          </div>
        );

      case 'RIDES':
        return (
          <div className="space-y-5 pt-2">
            {/* Quick rides summary header */}
            <div className="p-4 bg-white dark:bg-surface-container border border-outline-variant/15 dark:border-outline/10 rounded-2xl flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="w-24 h-4 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                <div className="w-36 h-3 bg-surface-container-highest dark:bg-neutral-800/60 rounded animate-pulse"></div>
              </div>
              <div className="w-20 h-8 bg-surface-container-highest dark:bg-neutral-800 rounded-full animate-pulse"></div>
            </div>

            {/* List with routes */}
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-5 bg-white dark:bg-surface-container border border-outline-variant/15 dark:border-outline/10 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-surface-container-highest dark:bg-neutral-800 rounded-full animate-pulse"></div>
                      <div className="space-y-1.5">
                        <div className="w-20 h-4.5 bg-surface-container-highest dark:bg-neutral-800/90 rounded animate-pulse"></div>
                        <div className="w-12 h-3 bg-surface-container-highest dark:bg-neutral-800/50 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="w-14 h-5 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2 border-l-2 border-dashed border-surface-container-high/60 dark:border-outline/20 pl-4 py-1">
                    <div className="w-32 h-3 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                    <div className="w-28 h-3 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'PROFILE':
        return (
          <div className="space-y-6 pt-2">
            {/* Header info profile segment */}
            <div className="flex flex-col items-center text-center space-y-3.5">
              <div className="w-20 h-20 rounded-full bg-surface-container-highest dark:bg-neutral-800 animate-pulse"></div>
              <div className="space-y-1.5 flex flex-col items-center w-full">
                <div className="w-32 h-5 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                <div className="w-20 h-3.5 bg-surface-container-highest dark:bg-neutral-800/60 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Stat panels */}
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 bg-white dark:bg-surface-container border border-outline-variant/15 dark:border-outline/10 rounded-2xl space-y-2">
                  <div className="w-12 h-3.5 bg-surface-container-highest dark:bg-neutral-800/60 rounded animate-pulse"></div>
                  <div className="w-8 h-5 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Control cards */}
            <div className="bg-white dark:bg-surface-container rounded-2xl border border-outline-variant/15 dark:border-outline/10 divide-y divide-surface-container/30 dark:divide-outline/10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-5 h-5 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                    <div className="space-y-1.5 flex-1">
                      <div className="w-24 h-4 bg-surface-container-highest dark:bg-neutral-800 rounded animate-pulse"></div>
                      <div className="w-40 h-3 bg-surface-container-highest dark:bg-neutral-800/50 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {renderSkeletonContent()}
    </div>
  );
}
