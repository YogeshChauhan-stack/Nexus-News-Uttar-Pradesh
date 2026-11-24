import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero Grid Skeleton */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="h-6 bg-aajtak-red rounded w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[16/9] bg-neutral-200 rounded-lg" />
            <div className="h-8 bg-neutral-200 rounded w-4/5" />
            <div className="h-5 bg-neutral-100 rounded w-3/5" />
          </div>
          <div className="lg:col-span-5 space-y-4 divide-y divide-neutral-100">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3 pt-3 first:pt-0">
                <div className="w-24 h-20 bg-neutral-200 rounded-md shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-neutral-200 rounded w-1/4" />
                  <div className="h-4 bg-neutral-200 rounded w-full" />
                  <div className="h-4 bg-neutral-200 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
            <div className="aspect-[16/10] bg-neutral-200" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-neutral-200 rounded w-1/4" />
              <div className="h-5 bg-neutral-200 rounded w-full" />
              <div className="h-5 bg-neutral-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
