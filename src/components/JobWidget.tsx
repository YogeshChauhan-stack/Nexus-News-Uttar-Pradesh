'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Globe,
  MapPin,
  Calendar,
  GraduationCap,
  Users,
  ExternalLink,
  ChevronRight,
  Flame,
  Clock,
  Sparkles,
  ShieldCheck,
  Building2,
  X
} from 'lucide-react';
import { JobNotification, SAMPLE_JOBS } from '@/lib/jobs';

export default function JobWidget() {
  const [jobs, setJobs] = useState<JobNotification[]>(SAMPLE_JOBS);
  const [activeTab, setActiveTab] = useState<'all' | 'up_state' | 'all_india' | 'international'>('all');
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
    if (activeTab === 'all') return true;
    return job.regionType === activeTab;
  }).slice(0, 6);

  const getUrgencyBadge = (deadline: string) => {
    const today = new Date();
    const dDate = new Date(deadline);
    const diffDays = Math.ceil((dDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 7 && diffDays >= 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded shadow-xs animate-pulse">
          <Clock className="w-3 h-3" />
          <span>अंतिम {diffDays} दिन शेष</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
        <Calendar className="w-3 h-3 text-neutral-400" />
        <span>अंतिम: {deadline}</span>
      </span>
    );
  };

  const getRegionIcon = (regionType: string, countryCode?: string) => {
    if (regionType === 'international') {
      if (countryCode === 'AE' || countryCode === 'SA') return '🇦🇪 / 🇸🇦';
      if (countryCode === 'DE') return '🇩🇪';
      if (countryCode === 'JP') return '🇯🇵';
      if (countryCode === 'US') return '🇺🇸';
      return '🌍';
    }
    if (regionType === 'up_state') return '🚩';
    return '🇮🇳';
  };

  return (
    <section className="bg-gradient-to-b from-neutral-50 to-white rounded-xl border border-neutral-200/90 shadow-sm p-4 sm:p-6 my-6 sm:my-8">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black font-editorial tracking-tight text-neutral-900 leading-tight">
                नेक्सस रोजगार & सरकारी नौकरी सूचना केंद्र
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-2xs">
                <Flame className="w-3 h-3 fill-current" />
                LIVE ALERTS
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-hindi mt-0.5">
              उत्तर प्रदेश, केंद्रीय भर्तियां एवं विदेश (Gulf / Europe) में जॉब के दैनिक आधिकारिक अवसर
            </p>
          </div>
        </div>

        {/* View All Portal Link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-3 py-1.5 rounded-lg border border-red-200 transition shrink-0 self-start sm:self-auto"
        >
          <span>पूरा जॉब पोर्टल देखें</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 2. Filter Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-3.5 border-b border-neutral-100 text-xs font-bold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-full transition whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
          }`}
        >
          सभी भर्तियां ({jobs.length})
        </button>

        <button
          onClick={() => setActiveTab('up_state')}
          className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'up_state'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-600'
          }`}
        >
          <span>🚩</span>
          <span>उत्तर प्रदेश (UP State)</span>
        </button>

        <button
          onClick={() => setActiveTab('all_india')}
          className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'all_india'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-600'
          }`}
        >
          <span>🇮🇳</span>
          <span>केंद्रीय सरकार (All India)</span>
        </button>

        <button
          onClick={() => setActiveTab('international')}
          className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'international'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>विदेश / Overseas (Gulf, Europe, Remote)</span>
        </button>
      </div>

      {/* 3. Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            className="bg-white rounded-lg border border-neutral-200/90 hover:border-neutral-400/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between p-4 group relative overflow-hidden"
          >
            {/* Top Row: Region & Urgency */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-200/60">
                <span>{getRegionIcon(job.regionType, job.countryCode)}</span>
                <span className="truncate max-w-[130px]">{job.countryOrState}</span>
              </span>

              {getUrgencyBadge(job.applicationDeadline)}
            </div>

            {/* Middle: Title & Dept */}
            <div className="space-y-1.5 flex-1">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                {job.orgShort} • {job.organization}
              </span>
              <h3
                onClick={() => setSelectedJob(job)}
                className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-red-600 cursor-pointer transition line-clamp-2 leading-snug font-hindi"
              >
                {job.titleHindi}
              </h3>
              <p className="text-[11px] text-neutral-500 line-clamp-2">
                {job.description}
              </p>
            </div>

            {/* Highlights: Posts & Qualification */}
            <div className="my-3 py-2.5 px-3 bg-neutral-50 rounded-lg border border-neutral-100 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-400 block leading-none">कुल पद</span>
                  <span className="font-bold text-neutral-800">{job.totalVacancies.toLocaleString('en-IN')} पद</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-neutral-400 block leading-none">योग्यता</span>
                  <span className="font-bold text-neutral-800 truncate block">{job.qualificationHindi}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 pt-1 border-t border-neutral-100">
              <button
                onClick={() => setSelectedJob(job)}
                className="flex-1 py-1.5 px-3 rounded-md border border-neutral-300 hover:border-neutral-800 text-neutral-700 hover:text-black font-semibold text-xs transition text-center"
              >
                पूरा विवरण
              </button>

              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 px-3 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition inline-flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>आवेदन करें</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Bottom Footer Banner with quick highlights */}
      <div className="mt-5 p-3.5 rounded-lg bg-red-50 border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-red-950 font-hindi">
          <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
          <span>
            <strong>विशेष सेवा:</strong> गाजीपुर, पूर्वांचल व पूरे यूपी के अभ्यर्थियों के लिए सरकारी एडमिट कार्ड, परिणाम और आंसर-की अपडेट्स।
          </span>
        </div>

        <Link
          href="/jobs"
          className="text-xs font-black text-red-600 hover:text-red-700 underline whitespace-nowrap shrink-0"
        >
          सभी 50+ रिक्तियां एवं प्रवेश पत्र देखें →
        </Link>
      </div>

      {/* 5. Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col border border-neutral-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getRegionIcon(selectedJob.regionType, selectedJob.countryCode)}</span>
                <div>
                  <h3 className="font-bold text-sm sm:text-base leading-tight">
                    {selectedJob.orgShort} • {selectedJob.countryOrState}
                  </h3>
                  <span className="text-[11px] text-neutral-400">आधिकारिक भर्ती अधिसूचना</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs font-sans text-neutral-700">
              <div>
                <h4 className="text-base sm:text-lg font-black text-neutral-950 font-hindi leading-snug">
                  {selectedJob.titleHindi}
                </h4>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">{selectedJob.title}</p>
              </div>

              {/* Quick Stat Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 bg-neutral-50 rounded-lg border border-neutral-200/70">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-bold">कुल रिक्तियां</span>
                  <span className="text-xs font-bold text-neutral-900">{selectedJob.totalVacancies.toLocaleString('en-IN')} पद</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-bold">न्यूनतम योग्यता</span>
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
                    <span className="text-[10px] text-neutral-400 block font-bold">अनुमानित वेतनमान</span>
                    <span className="text-xs font-bold text-emerald-700">{selectedJob.salaryRange}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h5 className="font-bold text-neutral-900 mb-1">विवरण एवं कार्यक्षेत्र:</h5>
                <p className="leading-relaxed bg-neutral-50/50 p-2.5 rounded border border-neutral-100">
                  {selectedJob.description}
                </p>
              </div>

              {/* Selection Process */}
              {selectedJob.selectionProcess && (
                <div>
                  <h5 className="font-bold text-neutral-900 mb-1">चयन प्रक्रिया के चरण:</h5>
                  <ul className="list-disc pl-5 space-y-1 text-neutral-600">
                    {selectedJob.selectionProcess.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fees */}
              {selectedJob.applicationFee && (
                <div className="p-2.5 rounded bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900">
                  <strong>आवेदन शुल्क:</strong> {selectedJob.applicationFee}
                </div>
              )}
            </div>

            {/* Modal Footer */}
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
                अधिसूचना (PDF/Site)
              </a>

              <a
                href={selectedJob.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition inline-flex items-center gap-1 shadow-xs"
              >
                <span>ऑनलाइन आवेदन करें</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
