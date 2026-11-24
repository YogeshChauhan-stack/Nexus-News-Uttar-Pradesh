'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JobNotification } from '@/lib/jobs';
import {
  Briefcase,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  Users,
  GraduationCap,
  ExternalLink,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  Globe,
  Sparkles,
  Save,
  X,
  AlertTriangle,
  Building,
  Star
} from 'lucide-react';

export default function AdminJobsManager({ initialJobs }: { initialJobs: JobNotification[] }) {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobNotification[]>(initialJobs);
  const [search, setSearch] = useState('');
  const [filterRegion, setFilterRegion] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editing state (null = creating new, non-null = editing)
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  // Form Fields
  const [titleHindi, setTitleHindi] = useState('');
  const [titleEnglish, setTitleEnglish] = useState('');
  const [organization, setOrganization] = useState('');
  const [orgShort, setOrgShort] = useState('');
  const [category, setCategory] = useState<JobNotification['category']>('government');
  const [regionType, setRegionType] = useState<JobNotification['regionType']>('up_state');
  const [countryOrState, setCountryOrState] = useState('उत्तर प्रदेश');
  const [totalVacancies, setTotalVacancies] = useState<string>('1000');
  const [qualificationHindi, setQualificationHindi] = useState('12वीं पास');
  const [qualificationEnglish, setQualificationEnglish] = useState('10+2 Intermediate');
  const [ageLimit, setAgeLimit] = useState('18 से 30 वर्ष');
  const [salaryRange, setSalaryRange] = useState('₹21,700 - ₹69,100');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [status, setStatus] = useState<JobNotification['status']>('ACTIVE');
  const [applicationFee, setApplicationFee] = useState('सामान्य/ओबीसी: ₹400, एससी/एसटी: ₹0');
  const [officialNotificationUrl, setOfficialNotificationUrl] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState('');

  const openCreateModal = () => {
    setEditingJobId(null);
    setTitleHindi('');
    setTitleEnglish('');
    setOrganization('');
    setOrgShort('');
    setCategory('government');
    setRegionType('up_state');
    setCountryOrState('उत्तर प्रदेश');
    setTotalVacancies('500');
    setQualificationHindi('12वीं पास');
    setQualificationEnglish('12th Pass');
    setAgeLimit('18 से 30 वर्ष');
    setSalaryRange('₹21,700 - ₹69,100');
    setApplicationDeadline(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
    setStatus('ACTIVE');
    setApplicationFee('सामान्य: ₹400, एससी/एसटी: ₹0');
    setOfficialNotificationUrl('');
    setApplyUrl('');
    setFeatured(false);
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (job: JobNotification) => {
    setEditingJobId(job.id);
    setTitleHindi(job.titleHindi);
    setTitleEnglish(job.title);
    setOrganization(job.organization);
    setOrgShort(job.orgShort);
    setCategory(job.category);
    setRegionType(job.regionType);
    setCountryOrState(job.countryOrState);
    setTotalVacancies(String(job.totalVacancies));
    setQualificationHindi(job.qualificationHindi);
    setQualificationEnglish(job.qualification);
    setAgeLimit(job.ageLimit);
    setSalaryRange(job.salaryRange || '');
    setApplicationDeadline(job.applicationDeadline);
    setStatus(job.status);
    setApplicationFee(job.applicationFee || '');
    setOfficialNotificationUrl(job.officialNotificationUrl);
    setApplyUrl(job.applyUrl);
    setFeatured(Boolean(job.featured));
    setDescription(job.description);
    setIsModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleHindi.trim() || !organization.trim()) {
      alert('कृपया पद का हिंदी शीर्षक और संस्था का नाम भरें।');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      title: titleEnglish.trim() || titleHindi.trim(),
      titleHindi: titleHindi.trim(),
      organization: organization.trim(),
      orgShort: orgShort.trim() || organization.slice(0, 8).toUpperCase(),
      category,
      regionType,
      countryOrState,
      totalVacancies: parseInt(totalVacancies) || 1,
      qualification: qualificationEnglish.trim(),
      qualificationHindi: qualificationHindi.trim(),
      ageLimit: ageLimit.trim(),
      salaryRange: salaryRange.trim(),
      applicationDeadline,
      status,
      applicationFee: applicationFee.trim(),
      officialNotificationUrl: officialNotificationUrl.trim() || '#',
      applyUrl: applyUrl.trim() || '#',
      featured,
      description: description.trim() || titleHindi.trim()
    };

    try {
      if (editingJobId) {
        // PATCH
        const res = await fetch(`/api/jobs/${editingJobId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const updated = await res.json();
          setJobs(prev => prev.map(j => (j.id === updated.id ? updated : j)));
          setIsModalOpen(false);
          router.refresh();
        } else {
          alert('Failed to update job');
        }
      } else {
        // POST
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          setJobs(prev => [created, ...prev]);
          setIsModalOpen(false);
          router.refresh();
        } else {
          alert('Failed to create job');
        }
      }
    } catch {
      alert('Error connecting to job API');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (id: string, titleHindi: string) => {
    if (!confirm(`क्या आप इस भर्ती को हटाना चाहते हैं?\n"${titleHindi}"`)) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setJobs(prev => prev.filter(j => j.id !== id));
        router.refresh();
      }
    } catch {
      alert('Error deleting job');
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean | undefined) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !current })
      });
      if (res.ok) {
        setJobs(prev => prev.map(j => (j.id === id ? { ...j, featured: !current } : j)));
        router.refresh();
      }
    } catch {
      alert('Error updating featured status');
    }
  };

  const handleToggleStatus = async (id: string, current: string) => {
    const nextStatus = current === 'ACTIVE' ? 'CLOSING_SOON' : current === 'CLOSING_SOON' ? 'ACTIVE' : 'ACTIVE';
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setJobs(prev => prev.map(j => (j.id === id ? { ...j, status: nextStatus as any } : j)));
        router.refresh();
      }
    } catch {
      alert('Error updating job status');
    }
  };

  const filteredJobs = jobs.filter(j => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        j.title.toLowerCase().includes(q) ||
        j.titleHindi.toLowerCase().includes(q) ||
        j.organization.toLowerCase().includes(q) ||
        j.countryOrState.toLowerCase().includes(q) ||
        j.qualificationHindi.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filterRegion !== 'ALL' && j.regionType !== filterRegion) return false;
    if (filterStatus !== 'ALL' && j.status !== filterStatus) return false;

    return true;
  });

  return (
    <div className="font-sans">
      {/* 1. Header Toolbar */}
      <div className="p-4 bg-white border-b border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-red-600" />
          <h2 className="font-editorial font-bold text-lg text-neutral-900">
            सरकारी एवं विदेशी भर्ती प्रबंधन (Job Notifications Desk)
          </h2>
          <span className="bg-neutral-100 text-neutral-700 font-bold px-2 py-0.5 rounded text-xs">
            {jobs.length} कुल भर्तियां
          </span>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase px-4 py-2 rounded-lg transition shadow-xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ नई भर्ती जोड़ें (Add Job)</span>
        </button>
      </div>

      {/* 2. Search & Filters */}
      <div className="p-4 bg-neutral-50/70 border-b border-neutral-200 grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="भर्ती का नाम, विभाग, योग्यता या देश खोजें... (उदा: यूपी पुलिस, Dubai, 12वीं)"
            className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-600 font-hindi"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={filterRegion}
            onChange={e => setFilterRegion(e.target.value)}
            className="w-full py-2 px-3 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="ALL">सभी क्षेत्र (All Regions)</option>
            <option value="up_state">🚩 उत्तर प्रदेश (UP State)</option>
            <option value="all_india">🇮🇳 केंद्रीय भर्तियां (All India)</option>
            <option value="international">🌍 विदेश / Overseas (Gulf, Europe, Japan, Remote)</option>
            <option value="other_states">🏛️ अन्य राज्य (Bihar, Delhi)</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full py-2 px-3 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="ALL">सभी स्थिति (All Status)</option>
            <option value="ACTIVE">🟢 सक्रिय (ACTIVE)</option>
            <option value="CLOSING_SOON">⚡ अंतिम दिन शेष (CLOSING SOON)</option>
            <option value="ADMIT_CARD">📄 प्रवेश पत्र जारी (ADMIT CARD)</option>
            <option value="RESULT_DECLARED">🏆 परिणाम घोषित (RESULT)</option>
          </select>
        </div>
      </div>

      {/* 3. Jobs Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-600">
          <thead className="bg-neutral-100/90 text-xs font-bold text-neutral-700 uppercase tracking-wider border-b border-neutral-200">
            <tr>
              <th className="py-3 px-3">पद एवं भर्ती शीर्षक</th>
              <th className="py-3 px-3">क्षेत्र / देश</th>
              <th className="py-3 px-3">कुल पद</th>
              <th className="py-3 px-3">न्यूनतम योग्यता</th>
              <th className="py-3 px-3">अंतिम तिथि</th>
              <th className="py-3 px-3 text-center">फीचर्ड</th>
              <th className="py-3 px-3">स्थिति</th>
              <th className="py-3 px-4 text-right">कार्रवाई</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 text-xs">
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-neutral-400">
                  कोई भर्ती नहीं मिली।
                </td>
              </tr>
            ) : (
              filteredJobs.map(job => (
                <tr key={job.id} className="hover:bg-neutral-50/80 transition">
                  {/* Title & Dept */}
                  <td className="py-3 px-3 max-w-xs sm:max-w-sm">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      {job.orgShort} • {job.organization}
                    </span>
                    <span className="font-bold text-neutral-900 font-hindi text-sm line-clamp-1 block">
                      {job.titleHindi}
                    </span>
                    <span className="text-[11px] text-neutral-500 line-clamp-1 font-mono">
                      {job.salaryRange || 'वेतन नियमानुसार'}
                    </span>
                  </td>

                  {/* Region */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200">
                      {job.regionType === 'international' ? '🌍' : job.regionType === 'up_state' ? '🚩' : '🇮🇳'}
                      <span>{job.countryOrState}</span>
                    </span>
                  </td>

                  {/* Posts */}
                  <td className="py-3 px-3 whitespace-nowrap font-bold text-neutral-900">
                    {job.totalVacancies.toLocaleString('en-IN')} पद
                  </td>

                  {/* Qualification */}
                  <td className="py-3 px-3 whitespace-nowrap text-neutral-700 font-hindi">
                    {job.qualificationHindi}
                  </td>

                  {/* Deadline */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-mono text-neutral-800 font-bold block">{job.applicationDeadline}</span>
                    {job.status === 'CLOSING_SOON' && (
                      <span className="text-[10px] text-amber-700 font-bold block">⚡ अंतिम दिन शेष</span>
                    )}
                  </td>

                  {/* Featured Pin */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleToggleFeatured(job.id, job.featured)}
                      className={`p-1.5 rounded transition ${
                        job.featured
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-neutral-100 text-neutral-400 hover:text-amber-600'
                      }`}
                      title={job.featured ? 'होमपेज विजेट पर फीचर्ड है' : 'होमपेज पर फीचर करें'}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(job.id, job.status)}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                        job.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : job.status === 'CLOSING_SOON'
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {job.status}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(job)}
                        className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                        title="संपादित करें"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded transition"
                        title="आवेदन लिंक"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleDeleteJob(job.id, job.titleHindi)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Add / Edit Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-neutral-200 overflow-hidden font-sans">
            <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-red-500" />
                <h3 className="font-bold text-base font-hindi">
                  {editingJobId ? 'भर्ती सूचना संपादित करें (Edit Job)' : 'नई भर्ती अधिसूचना जोड़ें (Add New Job)'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  भर्ती शीर्षक (हिंदी) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा: यूपी पुलिस कांस्टेबल 60,244 पद सीधी भर्ती 2026"
                  value={titleHindi}
                  onChange={e => setTitleHindi(e.target.value)}
                  className="w-full text-sm font-bold px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 font-hindi"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  भर्ती शीर्षक (अंग्रेजी / Official Title)
                </label>
                <input
                  type="text"
                  placeholder="e.g. UP Police Constable & PAC 60,244 Posts Recruitment 2026"
                  value={titleEnglish}
                  onChange={e => setTitleEnglish(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    विभाग / संस्था का नाम *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: UP Police Recruitment Board"
                    value={organization}
                    onChange={e => setOrganization(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg font-hindi"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    संक्षिप्त कोड (Short Name)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा: UPPRPB, SSC, NEOM KSA"
                    value={orgShort}
                    onChange={e => setOrgShort(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    क्षेत्र प्रकार (Region Type) *
                  </label>
                  <select
                    value={regionType}
                    onChange={e => {
                      const val = e.target.value as any;
                      setRegionType(val);
                      if (val === 'up_state') setCountryOrState('उत्तर प्रदेश');
                      else if (val === 'all_india') setCountryOrState('All India (केन्द्रीय)');
                      else if (val === 'international') setCountryOrState('संयुक्त अरब अमीरात (UAE / Gulf)');
                      else setCountryOrState('बिहार (Bihar)');
                    }}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                  >
                    <option value="up_state">🚩 उत्तर प्रदेश (UP State)</option>
                    <option value="all_india">🇮🇳 केंद्रीय भर्तियां (All India)</option>
                    <option value="international">🌍 विदेश / Overseas (Gulf, EU, Remote)</option>
                    <option value="other_states">🏛️ अन्य राज्य (Other States)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    देश / राज्य नाम *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: उत्तर प्रदेश, UAE / Dubai, Germany"
                    value={countryOrState}
                    onChange={e => setCountryOrState(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg font-hindi"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    कुल पद (Vacancies) *
                  </label>
                  <input
                    type="number"
                    required
                    value={totalVacancies}
                    onChange={e => setTotalVacancies(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    श्रेणी (Category)
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                  >
                    <option value="police_defense">पुलिस व रक्षा (Police & Defense)</option>
                    <option value="railways">रेलवे (Railways)</option>
                    <option value="teaching">शिक्षक भर्ती (Teaching)</option>
                    <option value="banking">बैंकिंग (Banking)</option>
                    <option value="healthcare">स्वास्थ्य व नर्स (Healthcare)</option>
                    <option value="tech">आईटी व इंजीनियरिंग (Tech)</option>
                    <option value="government">अन्य सरकारी (Government)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    योग्यता (हिंदी) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: 12वीं पास / स्नातक / डिप्लोमा"
                    value={qualificationHindi}
                    onChange={e => setQualificationHindi(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg font-hindi"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    आयु सीमा (Age Limit)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा: 18 से 25 वर्ष"
                    value={ageLimit}
                    onChange={e => setAgeLimit(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg font-hindi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    वेतनमान (Salary)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा: ₹21,700 - ₹69,100 / माह या AED 8,500"
                    value={salaryRange}
                    onChange={e => setSalaryRange(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg font-hindi"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    आवेदन अंतिम तिथि *
                  </label>
                  <input
                    type="date"
                    required
                    value={applicationDeadline}
                    onChange={e => setApplicationDeadline(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    स्थिति (Status)
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                  >
                    <option value="ACTIVE">सक्रिय (ACTIVE)</option>
                    <option value="CLOSING_SOON">अंतिम दिन शेष (CLOSING SOON)</option>
                    <option value="ADMIT_CARD">प्रवेश पत्र जारी (ADMIT CARD)</option>
                    <option value="RESULT_DECLARED">परिणाम घोषित (RESULT)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    आधिकारिक अधिसूचना लिंक (PDF/URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={officialNotificationUrl}
                    onChange={e => setOfficialNotificationUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    ऑनलाइन आवेदन लिंक (Apply URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={applyUrl}
                    onChange={e => setApplyUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  आवेदन शुल्क विवरण (Application Fee)
                </label>
                <input
                  type="text"
                  placeholder="उदा: सामान्य / ओबीसी: ₹400, एससी / एसटी: ₹0"
                  value={applicationFee}
                  onChange={e => setApplicationFee(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg font-hindi"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  संक्षिप्त विवरण व कार्यक्षेत्र (Job Description)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg font-hindi"
                  placeholder="भर्ती संबंधी मुख्य बिंदु, पदस्थापना स्थान, आदि..."
                />
              </div>

              <div className="pt-2 border-t border-neutral-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={e => setFeatured(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-amber-900">
                    ⭐ होमपेज विजेट पर प्रमुखता से प्रदर्शित करें (Featured Priority Job)
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'सहेजा जा रहा है...' : 'भर्ती प्रकाशित करें (Save Job)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
