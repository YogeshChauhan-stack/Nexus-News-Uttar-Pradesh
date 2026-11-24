'use client';

import React, { useState } from 'react';
import { Article } from '@/lib/types';
import { JobNotification } from '@/lib/jobs';
import AdminArticlesTable from './AdminArticlesTable';
import AdminJobsManager from './AdminJobsManager';
import { FileText, Briefcase } from 'lucide-react';

interface AdminTabsViewProps {
  articles: Article[];
  jobs: JobNotification[];
}

export default function AdminTabsView({ articles, jobs }: AdminTabsViewProps) {
  const [activeTab, setActiveTab] = useState<'news' | 'jobs'>('news');

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden font-sans">
      {/* Top Main Tab Switcher */}
      <div className="flex border-b border-neutral-200 bg-neutral-50/80 px-4 pt-2">
        <button
          onClick={() => setActiveTab('news')}
          className={`flex items-center gap-2 py-3 px-5 border-b-2 font-bold text-sm transition ${
            activeTab === 'news'
              ? 'border-red-600 text-red-600 bg-white shadow-2xs rounded-t-lg'
              : 'border-transparent text-neutral-600 hover:text-black'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>📰 समाचार प्रबंधन (News Management)</span>
          <span className="text-xs bg-neutral-200/80 text-neutral-700 px-2 py-0.5 rounded-full font-mono">
            {articles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 py-3 px-5 border-b-2 font-bold text-sm transition ${
            activeTab === 'jobs'
              ? 'border-red-600 text-red-600 bg-white shadow-2xs rounded-t-lg'
              : 'border-transparent text-neutral-600 hover:text-black'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>💼 सरकारी व विदेशी नौकरी केंद्र (Job Management)</span>
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-mono font-bold">
            {jobs.length}
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'news' ? (
          <AdminArticlesTable initialArticles={articles} />
        ) : (
          <AdminJobsManager initialJobs={jobs} />
        )}
      </div>
    </div>
  );
}
