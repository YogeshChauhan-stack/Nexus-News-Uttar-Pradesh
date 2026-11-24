'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Rss, ShieldCheck, CheckCircle2, AlertTriangle, Play, Filter, Globe } from 'lucide-react';
import { SyncResult } from '@/lib/types';

export default function AdminSyncPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SyncResult[] | null>(null);
  const [moderationMode, setModerationMode] = useState<'published' | 'draft'>('published');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const handleRunSync = async () => {
    setIsRunning(true);
    setResults(null);
    try {
      const res = await fetch(`/api/sync?moderation=${moderationMode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET_TOKEN || 'nexus-secure-sync-token-2026'}`
        },
        body: JSON.stringify({ moderation: moderationMode })
      });
      const data = await res.json();
      if (data.results) {
        setResults(data.results);
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    } catch (err: any) {
      alert(`Sync error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const feeds = [
    { name: 'उत्तर प्रदेश मुख्य समाचार (Google News UP Hindi)', url: 'https://news.google.com/rss/search?q=उत्तर+प्रदेश...', category: 'उत्तर प्रदेश', status: 'Priority Wire' },
    { name: 'लखनऊ एवं मध्य यूपी (Google News Lucknow)', url: 'https://news.google.com/rss/search?q=लखनऊ...', category: 'उत्तर प्रदेश (लखनऊ)', status: 'Priority Wire' },
    { name: 'वाराणसी एवं अयोध्या (Google News Purvanchal)', url: 'https://news.google.com/rss/search?q=वाराणसी+OR+अयोध्या...', category: 'उत्तर प्रदेश (वाराणसी)', status: 'Priority Wire' },
    { name: 'कानपुर एवं प्रयागराज (Google News Central UP)', url: 'https://news.google.com/rss/search?q=कानपुर+OR+प्रयागराज...', category: 'उत्तर प्रदेश (कानपुर)', status: 'Priority Wire' },
    { name: 'BBC World News (RSS)', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'World', status: 'Active' },
    { name: 'TechCrunch (RSS)', url: 'https://techcrunch.com/feed/', category: 'Technology', status: 'Active' },
    { name: 'Wired Science (RSS)', url: 'https://www.wired.com/feed/category/science/latest/rss', category: 'Science', status: 'Active' },
    { name: 'CNBC Markets (RSS)', url: 'https://search.cnbc.com/rs/search/view.html?partnerId=2000...', category: 'Business', status: 'Active' },
  ];

  const totalSaved = results?.reduce((a, b) => a + b.saved, 0) || 0;
  const totalSkipped = results?.reduce((a, b) => a + b.skipped, 0) || 0;

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black uppercase transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Console
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black font-editorial text-neutral-900 flex items-center gap-2">
            <Rss className="w-7 h-7 text-red-600" />
            <span>Automated News Wire Pipeline</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Hybrid automated ingest engine pulling, normalizing, deduplicating, and caching real-time stories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunSync}
            disabled={isRunning}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase px-5 py-2.5 rounded transition shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Syncing Feeds...' : 'Trigger Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Moderation Controls Card */}
      <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-neutral-700" />
            <h3 className="font-editorial text-base font-bold text-neutral-900">
              Ingest Moderation Policy
            </h3>
          </div>
          {lastSyncTime && (
            <span className="text-xs text-neutral-400">
              Last synced at {lastSyncTime}
            </span>
          )}
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed">
          Configure how imported API stories enter your database. You can publish trusted feeds directly to the homepage, or hold them in a draft review queue for editorial rewriting.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <label
            onClick={() => setModerationMode('published')}
            className={`border rounded-lg p-4 cursor-pointer transition flex items-start gap-3 ${
              moderationMode === 'published'
                ? 'border-red-600 bg-red-50/40 ring-1 ring-red-600'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <input
              type="radio"
              name="moderation"
              checked={moderationMode === 'published'}
              onChange={() => setModerationMode('published')}
              className="mt-1 text-red-600 focus:ring-red-500"
            />
            <div>
              <span className="text-sm font-bold text-neutral-900 block">Direct Live Publishing</span>
              <span className="text-xs text-neutral-500 mt-0.5 block">
                Articles from trusted wires appear immediately on front-page with external attribution links.
              </span>
            </div>
          </label>

          <label
            onClick={() => setModerationMode('draft')}
            className={`border rounded-lg p-4 cursor-pointer transition flex items-start gap-3 ${
              moderationMode === 'draft'
                ? 'border-red-600 bg-red-50/40 ring-1 ring-red-600'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <input
              type="radio"
              name="moderation"
              checked={moderationMode === 'draft'}
              onChange={() => setModerationMode('draft')}
              className="mt-1 text-red-600 focus:ring-red-500"
            />
            <div>
              <span className="text-sm font-bold text-neutral-900 block">Editorial Review Queue</span>
              <span className="text-xs text-neutral-500 mt-0.5 block">
                Saves fetched stories as DRAFT. Editors review, fact-check, and enrich with SEO tags before publishing.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Sync Execution Output */}
      {results && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>News Pipeline Sync Completed Successfully</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                +{totalSaved} New Stories Added
              </span>
              <span className="text-neutral-600 bg-neutral-200/70 px-2 py-0.5 rounded">
                {totalSkipped} Duplicates Filtered
              </span>
            </div>
          </div>

          <div className="divide-y divide-emerald-200/60 bg-white rounded border border-emerald-200/80 overflow-hidden text-xs">
            {results.map((res, i) => (
              <div key={i} className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-neutral-800">{res.source}</span>
                  <span className="text-neutral-400 ml-2">({res.totalFetched} fetched)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-700 font-medium">Saved: {res.saved}</span>
                  <span className="text-neutral-500">Skipped (duplicates): {res.skipped}</span>
                  {res.errors.length > 0 && (
                    <span className="text-red-600 font-bold">Errors: {res.errors.length}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Link
              href="/"
              className="text-xs font-bold uppercase text-emerald-800 hover:underline"
            >
              View Updated Front Page &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Configured News Feeds List */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <h3 className="font-editorial font-bold text-base text-neutral-900">
            Registered Ingest Sources & Feeds
          </h3>
        </div>

        <div className="divide-y divide-neutral-200 text-xs">
          {feeds.map((feed, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-neutral-50">
              <div className="space-y-0.5">
                <div className="font-bold text-neutral-900 text-sm">{feed.name}</div>
                <div className="text-neutral-400 font-mono text-[11px] truncate max-w-md">{feed.url}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="bg-neutral-100 text-neutral-700 font-semibold px-2 py-0.5 rounded">
                  {feed.category}
                </span>
                <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {feed.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal & Compliance Guidelines Card */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 text-xs text-neutral-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-neutral-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Automated News Architecture & Copyright Compliance</span>
        </div>
        <p className="leading-relaxed">
          In adherence with Section 3.A of your hybrid news architecture, all third-party API and RSS ingested articles automatically:
        </p>
        <ul className="list-disc list-inside space-y-1 text-neutral-500 ml-1">
          <li>Store the canonical wire source name and original source URL in the database.</li>
          <li>Display a fair-use summary teaser rather than copying unauthorized full-text content.</li>
          <li>Present a prominent, direct &ldquo;Read full story at [Source]&rdquo; attribution link on the article page.</li>
          <li>Filter out duplicate stories across different feeds using normalized title and URL hashing.</li>
        </ul>
      </div>
    </div>
  );
}
