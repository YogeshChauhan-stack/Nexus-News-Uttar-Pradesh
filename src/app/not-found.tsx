import React from 'react';
import Link from 'next/link';
import { FileSearch, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20 space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto">
        <FileSearch className="w-8 h-8 text-aajtak-red" />
      </div>
      <div>
        <h1 className="text-5xl font-black font-editorial text-neutral-900">404</h1>
        <p className="text-xl font-bold text-neutral-700 mt-2">Story Not Found</p>
        <p className="text-sm text-neutral-500 mt-2 max-w-sm">
          This article may have been removed, archived, or the URL may be incorrect.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-aajtak-red hover:bg-aajtak-darkRed text-white text-sm font-bold uppercase px-5 py-2.5 rounded transition"
        >
          <Home className="w-4 h-4" /> Front Page
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 border border-neutral-300 hover:border-black text-neutral-700 text-sm font-bold uppercase px-5 py-2.5 rounded transition"
        >
          Search Stories
        </Link>
      </div>
    </div>
  );
}
