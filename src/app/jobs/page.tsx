'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Search,
  Globe,
  MapPin,
  Calendar,
  GraduationCap,
  Users,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Building,
  ArrowLeft,
  X
} from 'lucide-react';
import { SAMPLE_JOBS, JobNotification } from '@/lib/jobs';

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobNotification[]>(SAMPLE_JOBS);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'up_state' | 'all_india' | 'international' | 'other_states'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'jobs' | 'admit_card' | 'result'>('jobs');
  const [selectedJob, setSelectedJob] = useState<JobNotification | null>(null);

  React.useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setJobs(data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredJobs = jobs.filter(job => {
    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(q) ||
        job.titleHindi.toLowerCase().includes(q) ||
        job.organization.toLowerCase().includes(q) ||
        job.orgShort.toLowerCase().includes(q) ||
        job.countryOrState.toLowerCase().includes(q) ||
        job.qualificationHindi.toLowerCase().includes(q) ||
        job.qualification.toLowerCase().includes(q);

      if (!matchesSearch) return false;
    }

    // 2. Region Filter
    if (regionFilter !== 'all' && job.regionType !== regionFilter) {
      return false;
    }

    // 3. Category Filter
    if (categoryFilter !== 'all' && job.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  const getRegionBadge = (regionType: string, countryOrState: string, countryCode?: string) => {
    let flag = '🇮🇳';
    if (regionType === 'international') {
      if (countryCode === 'AE' || countryCode === 'SA') flag = '🇦🇪';
      else if (countryCode === 'DE') flag = '🇩🇪';
      else if (countryCode === 'JP') flag = '🇯🇵';
      else flag = '🌍';
    } else if (regionType === 'up_state') {
      flag = '🚩';
    }

    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
        <span>{flag}</span>
        <span>{countryOrState}</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-sans">
      {/* 1. Breadcrumbs + Hero Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2 font-medium">
          <Link href="/" className="hover:text-red-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>होम (Home)</span>
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-bold">नेक्सस रोजगार & करियर पोर्टल</span>
        </div>

        <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-red-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-black tracking-wider uppercase shadow-xs">
              <Briefcase className="w-3.5 h-3.5" />
              <span>सत्यापित सरकारी व विदेशी नौकरी केंद्र</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-editorial tracking-tight leading-tight">
              नेक्सस रोजगार सूचना केंद्र (Job Notification Center)
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-hindi">
              उत्तर प्रदेश (यूपी पुलिस, लेखपाल, शिक्षक भर्ती), अखिल भारतीय केंद्रीय भर्तियां (SSC, Railway, UPSC) एवं खाड़ी देश (UAE, Saudi) व यूरोप में करियर के प्रामाणिक अवसर।
            </p>

            {/* Quick Stats Pill */}
            <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold text-neutral-200">
              <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
                🔥 1,80,000+ कुल रिक्तियां
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
                🚩 उत्तर प्रदेश विशेष कोटा
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
                🌍 विदेश/गल्फ वीजा डायरेक्ट रिक्रूटमेंट
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="पद का नाम, विभाग, योग्यता (10वीं/12वीं/स्नातक), या देश/राज्य खोजें... (उदा: यूपी पुलिस, Dubai, SSC, B.Tech)"
            className="w-full pl-11 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Region Filters */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
            देश एवं राज्य अनुसार चुनें (Region / Country Filter):
          </span>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <button
              onClick={() => setRegionFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                regionFilter === 'all'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              सभी क्षेत्र (All Regions)
            </button>
            <button
              onClick={() => setRegionFilter('up_state')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                regionFilter === 'up_state'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-600'
              }`}
            >
              <span>🚩</span>
              <span>उत्तर प्रदेश (UP State)</span>
            </button>
            <button
              onClick={() => setRegionFilter('all_india')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                regionFilter === 'all_india'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-600'
              }`}
            >
              <span>🇮🇳</span>
              <span>केंद्रीय भर्तियां (All India)</span>
            </button>
            <button
              onClick={() => setRegionFilter('international')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                regionFilter === 'international'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>विदेश / Overseas (Gulf, UAE, Europe, Japan, Remote)</span>
            </button>
            <button
              onClick={() => setRegionFilter('other_states')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                regionFilter === 'other_states'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              <span>🏛️</span>
              <span>अन्य राज्य (Bihar, Delhi)</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="space-y-1.5 pt-2 border-t border-neutral-100">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            श्रेणी (Category / Sector):
          </span>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: 'all', label: 'सभी श्रेणियां' },
              { id: 'police_defense', label: 'पुलिस व रक्षा (Police & Defense)' },
              { id: 'railways', label: 'रेलवे (Railways)' },
              { id: 'teaching', label: 'शिक्षक भर्ती (Teaching)' },
              { id: 'banking', label: 'बैंकिंग (Banking)' },
              { id: 'healthcare', label: 'स्वास्थ्य व नर्स (Healthcare)' },
              { id: 'tech', label: 'आईटी व इंजीनियरिंग (Tech & IT)' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  categoryFilter === cat.id
                    ? 'bg-neutral-800 text-white'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Tab Navigation: Latest Jobs / Admit Card / Results */}
      <div className="flex border-b border-neutral-200 text-sm font-bold">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`py-2.5 px-5 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'jobs'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>सक्रिय नौकरियां ({filteredJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('admit_card')}
          className={`py-2.5 px-5 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'admit_card'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>प्रवेश पत्र (Admit Card)</span>
        </button>

        <button
          onClick={() => setActiveTab('result')}
          className={`py-2.5 px-5 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'result'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>परीक्षा परिणाम (Results)</span>
        </button>
      </div>

      {/* 4. Tab Content: List of Jobs */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="text-base font-bold text-neutral-800">कोई भर्ती नहीं मिली</h3>
              <p className="text-xs text-neutral-500">
                कृपया अपने खोज शब्द या फ़िल्टर बदलकर दोबारा प्रयास करें।
              </p>
              <button
                onClick={() => { setSearch(''); setRegionFilter('all'); setCategoryFilter('all'); }}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                सभी फ़िल्टर रीसेट करें
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map(job => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl border border-neutral-200/90 hover:border-red-600/60 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2">
                      {getRegionBadge(job.regionType, job.countryOrState, job.countryCode)}
                      <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded">
                        अंतिम: {job.applicationDeadline}
                      </span>
                    </div>

                    {/* Department */}
                    <span className="text-xs font-bold text-neutral-400 block tracking-wide uppercase">
                      {job.orgShort} • {job.organization}
                    </span>

                    {/* Title */}
                    <h3
                      onClick={() => setSelectedJob(job)}
                      className="text-base sm:text-lg font-bold font-hindi text-neutral-900 group-hover:text-red-600 cursor-pointer transition leading-snug"
                    >
                      {job.titleHindi}
                    </h3>

                    <p className="text-xs text-neutral-500 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Key Attributes */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 px-3 bg-neutral-50 rounded-lg text-xs border border-neutral-100">
                      <div>
                        <span className="text-[10px] text-neutral-400 block font-semibold">रिक्तियां:</span>
                        <span className="font-bold text-neutral-800">{job.totalVacancies.toLocaleString('en-IN')} पद</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block font-semibold">योग्यता:</span>
                        <span className="font-bold text-neutral-800 truncate block">{job.qualificationHindi}</span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-neutral-400 block font-semibold">वेतनमान:</span>
                        <span className="font-bold text-emerald-700 truncate block">{job.salaryRange || 'नियमानुसार'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 mt-3 border-t border-neutral-100">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="flex-1 py-2 px-3 rounded-lg border border-neutral-300 hover:border-neutral-900 text-neutral-800 font-semibold text-xs transition text-center"
                    >
                      पूर्ण विवरण देखें
                    </button>

                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition inline-flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>ऑनलाइन आवेदन</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Admit Cards Mock View */}
      {activeTab === 'admit_card' && (
        <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden shadow-xs">
          {[
            { exam: 'UP Police Constable 2026 Written Exam', date: 'जारी (Download Now)', link: 'http://uppbpb.gov.in' },
            { exam: 'SSC GD Constable Tier-1 Exam City & Admit Card', date: 'सक्रिय (Active Link)', link: 'https://ssc.gov.in' },
            { exam: 'RRB ALP CBT-1 Hall Ticket 2026', date: 'जारी हुआ', link: 'https://rrbcdg.gov.in' },
            { exam: 'UPPSC PCS Prelims Examination Hall Ticket', date: 'डाउनलोड करें', link: 'https://uppsc.up.nic.in' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition text-xs">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-bold text-neutral-800 text-sm">{item.exam}</span>
              </div>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-red-700 transition inline-flex items-center gap-1"
              >
                <span>डाउनलोड</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* 6. Results Mock View */}
      {activeTab === 'result' && (
        <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden shadow-xs">
          {[
            { exam: 'UPSSSC VDO 2024 Final Selection List & Cutoff', date: 'घोषित (Declared)', link: 'http://upsssc.gov.in' },
            { exam: 'SBI Clerk Prelims 2026 Result & Scorecard', date: 'घोषित', link: 'https://sbi.co.in' },
            { exam: 'BPSC TRE 3.0 Final Merit List', date: 'परिणाम उपलब्ध', link: 'https://bpsc.bih.nic.in' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-neutral-800 text-sm">{item.exam}</span>
              </div>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-emerald-700 transition inline-flex items-center gap-1"
              >
                <span>परिणाम देखें</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* 7. Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col border border-neutral-200 overflow-hidden">
            <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base leading-tight">
                  {selectedJob.orgShort} • {selectedJob.countryOrState}
                </h3>
                <span className="text-[11px] text-neutral-400">आधिकारिक भर्ती अधिसूचना</span>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs text-neutral-700">
              <div>
                <h4 className="text-lg font-black text-neutral-950 font-hindi leading-snug">
                  {selectedJob.titleHindi}
                </h4>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">{selectedJob.title}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 bg-neutral-50 rounded-lg border border-neutral-200/70">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-bold">कुल पद</span>
                  <span className="text-xs font-bold text-neutral-900">{selectedJob.totalVacancies.toLocaleString('en-IN')} पद</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-bold">योग्यता</span>
                  <span className="text-xs font-bold text-neutral-900">{selectedJob.qualificationHindi}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-bold">आयु सीमा</span>
                  <span className="text-xs font-bold text-neutral-900">{selectedJob.ageLimit}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-bold">अंतिम तिथि</span>
                  <span className="text-xs font-bold text-red-600">{selectedJob.applicationDeadline}</span>
                </div>
                {selectedJob.salaryRange && (
                  <div className="col-span-2">
                    <span className="text-[10px] text-neutral-400 block font-bold">वेतनमान</span>
                    <span className="text-xs font-bold text-emerald-700">{selectedJob.salaryRange}</span>
                  </div>
                )}
              </div>

              <div>
                <h5 className="font-bold text-neutral-900 mb-1">विवरण:</h5>
                <p className="leading-relaxed bg-neutral-50/50 p-2.5 rounded border border-neutral-100">
                  {selectedJob.description}
                </p>
              </div>

              {selectedJob.selectionProcess && (
                <div>
                  <h5 className="font-bold text-neutral-900 mb-1">चयन प्रक्रिया:</h5>
                  <ul className="list-disc pl-5 space-y-1 text-neutral-600">
                    {selectedJob.selectionProcess.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.applicationFee && (
                <div className="p-2.5 rounded bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900">
                  <strong>आवेदन शुल्क:</strong> {selectedJob.applicationFee}
                </div>
              )}
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-200 transition"
              >
                बंद करें
              </button>

              <a
                href={selectedJob.officialNotificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg text-xs font-bold border border-neutral-300 hover:border-black text-neutral-800 transition"
              >
                अधिसूचना (PDF)
              </a>

              <a
                href={selectedJob.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition inline-flex items-center gap-1 shadow-xs"
              >
                <span>आवेदन लिंक</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
