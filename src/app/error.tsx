'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4">
        <div className="text-center space-y-5 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto">
            <AlertTriangle className="w-8 h-8 text-aajtak-red" />
          </div>
          <h1 className="text-3xl font-black font-editorial text-neutral-900">
            Something went wrong
          </h1>
          <p className="text-sm text-neutral-500">
            {error?.message || 'An unexpected error occurred while loading this page.'}
          </p>
          {error?.digest && (
            <p className="text-xs text-neutral-400 font-mono bg-neutral-100 px-3 py-1 rounded">
              Error ID: {error.digest}
            </p>
          )}
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-aajtak-red hover:bg-aajtak-darkRed text-white text-sm font-bold uppercase px-5 py-2.5 rounded transition"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-neutral-300 hover:border-black text-neutral-700 text-sm font-bold uppercase px-5 py-2.5 rounded transition"
            >
              <Home className="w-4 h-4" /> Front Page
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
