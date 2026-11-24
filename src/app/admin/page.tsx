import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  FileText,
  PlusCircle,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  Zap,
  Globe,
  Sliders,
  ExternalLink,
  LogOut,
  Briefcase,
  Flame,
  Star
} from 'lucide-react';
import AdminTabsView from './AdminTabsView';

export const revalidate = 0; // always fresh for CMS

export default async function AdminDashboardPage() {
  const stats = await db.getDashboardStats();
  const articles = await db.getAllAdminArticles();
  const jobs = await db.getJobs();

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4 font-sans">
      {/* 1. CMS Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/images/nexus-news-up-logo.png"
              alt="Nexus News UP"
              className="h-11 w-auto object-contain rounded border border-neutral-200 shadow-2xs"
            />
            <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded shadow-2xs">
              CMS ADMIN
            </span>
            <h1 className="text-xl sm:text-2xl font-black font-editorial text-neutral-900">
              संपादकीय नियंत्रण केंद्र (Newsroom & Job Management Console)
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-hindi">
            गाजीपुर, पूर्वांचल व उत्तर प्रदेश समाचार, लाइव ब्रेकिंग अलर्ट्स, और सरकारी व विदेशी भर्ती अधिसूचनाओं का संपूर्ण प्रबंधन।
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase px-3.5 py-2 rounded-lg transition shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ नया समाचार लिखें</span>
          </Link>

          <Link
            href="/admin/sync"
            className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase px-3.5 py-2 rounded-lg transition border border-neutral-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>फीड सिंक</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase px-3 py-2 rounded-lg transition border border-neutral-200"
            title="लाइव वेबसाइट देखें"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">लाइव साइट</span>
          </Link>

          <a
            href="/api/auth/logout"
            className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-red-600 text-xs font-bold uppercase px-3 py-2 rounded-lg transition border border-neutral-200"
            title="लॉगआउट करें"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">लॉगआउट</span>
          </a>
        </div>
      </div>

      {/* 2. Bilingual KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total News */}
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-[11px] font-bold uppercase">कुल समाचार</span>
            <FileText className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-editorial text-neutral-900">{stats.total}</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">{stats.manualCount} मूल • {stats.apiCount} वायर</div>
        </div>

        {/* Live Published */}
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-[11px] font-bold uppercase">लाइव प्रकाशित</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-editorial text-neutral-900">{stats.published}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5 font-bold">वेबसाइट पर दृश्यमान</div>
        </div>

        {/* Drafts */}
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-[11px] font-bold uppercase">ड्राफ्ट / समीक्षा</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-editorial text-neutral-900">{stats.drafts}</div>
          <div className="text-[10px] text-amber-600 mt-0.5">स्वीकृति प्रतीक्षित</div>
        </div>

        {/* Total Jobs */}
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-red-600 mb-1">
            <span className="text-[11px] font-bold uppercase">कुल नौकरियां</span>
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-editorial text-neutral-900">
            {stats.totalJobs || jobs.length}
          </div>
          <div className="text-[10px] text-red-600 mt-0.5 font-bold">
            {stats.activeJobs || 0} सक्रिय आवेदन
          </div>
        </div>

        {/* International / Gulf Jobs */}
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-[11px] font-bold uppercase">विदेश / खाड़ी देश</span>
            <Globe className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-editorial text-neutral-900">
            {stats.internationalJobs || 0}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">UAE, Saudi, Germany</div>
        </div>

        {/* Total Views */}
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-[11px] font-bold uppercase">कुल पाठक / व्यूज</span>
            <Eye className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-editorial text-neutral-900">
            {stats.totalViews.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">पेज इंप्रेशंस</div>
        </div>
      </div>

      {/* 3. Main Tabs View (News Management & Job Management) */}
      <AdminTabsView articles={articles} jobs={jobs} />
    </div>
  );
}
