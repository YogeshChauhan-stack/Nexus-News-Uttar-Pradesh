'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Article } from '@/lib/types';
import { UP_DISTRICTS } from '@/lib/districts';
import {
  Zap,
  ExternalLink,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
  Search,
  Filter,
  Edit,
  Star,
  Pin,
  CheckSquare,
  Square,
  X,
  Save,
  MapPin,
  Flame,
  Globe,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AdminArticlesTable({ initialArticles }: { initialArticles: Article[] }) {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState<string>('ALL');
  const [filterDistrict, setFilterDistrict] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  // Edit Modal state
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editStatus, setEditStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [editIsBreaking, setEditIsBreaking] = useState(false);
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editPointers, setEditPointers] = useState<string[]>(['', '', '']);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Toggle Breaking
  const handleToggleBreaking = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBreaking: !current })
      });
      if (res.ok) {
        setArticles(prev => prev.map(a => (a.id === id ? { ...a, isBreaking: !current } : a)));
        router.refresh();
      }
    } catch {
      alert('Error updating article breaking status');
    }
  };

  // Toggle Featured (Pin to Hero Lead)
  const handleToggleFeatured = async (id: string, current: boolean | undefined) => {
    const nextVal = !current;
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: nextVal })
      });
      if (res.ok) {
        setArticles(prev => prev.map(a => (a.id === id ? { ...a, isFeatured: nextVal } : a)));
        router.refresh();
      }
    } catch {
      alert('Error pinning article to lead hero');
    }
  };

  // Toggle Publish / Draft
  const handleToggleStatus = async (id: string, current: string) => {
    const nextStatus = current === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          publishedAt: nextStatus === 'PUBLISHED' ? new Date().toISOString() : ''
        })
      });
      if (res.ok) {
        setArticles(prev => prev.map(a => (a.id === id ? { ...a, status: nextStatus as any } : a)));
        router.refresh();
      }
    } catch {
      alert('Error updating status');
    }
  };

  // Delete single article
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`क्या आप इस समाचार को हटाना चाहते हैं?\n"${title.slice(0, 50)}..."`)) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles(prev => prev.filter(a => a.id !== id));
        setSelectedIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        router.refresh();
      }
    } catch {
      alert('Error deleting article');
    }
  };

  // Open Edit Modal
  const openEditModal = (art: Article) => {
    setEditingArticle(art);
    setEditTitle(art.title);
    setEditSummary(art.summary || '');
    setEditDistrict(art.district || '');
    setEditStatus(art.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT');
    setEditIsBreaking(Boolean(art.isBreaking));
    setEditIsFeatured(Boolean(art.isFeatured));
    const p = art.pointers && art.pointers.length > 0 ? [...art.pointers] : ['', '', ''];
    while (p.length < 3) p.push('');
    setEditPointers(p.slice(0, 3));
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    setIsSavingEdit(true);

    try {
      const cleanedPointers = editPointers.map(p => p.trim()).filter(Boolean);
      const res = await fetch(`/api/articles/${editingArticle.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          summary: editSummary,
          district: editDistrict || undefined,
          status: editStatus,
          isBreaking: editIsBreaking,
          isFeatured: editIsFeatured,
          pointers: cleanedPointers.length > 0 ? cleanedPointers : undefined
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setArticles(prev => prev.map(a => (a.id === updated.id ? updated : a)));
        setEditingArticle(null);
        router.refresh();
      } else {
        alert('Failed to update article');
      }
    } catch {
      alert('Error saving changes');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Select / Deselect All
  const handleToggleSelectAll = () => {
    if (selectedIds.size === filtered.length && filtered.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(a => a.id)));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Bulk Status Update (Publish / Draft)
  const handleBulkStatus = async (status: 'PUBLISHED' | 'DRAFT') => {
    if (selectedIds.size === 0) return;
    setIsBulkLoading(true);
    try {
      const promises = Array.from(selectedIds).map(id =>
        fetch(`/api/articles/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        })
      );
      await Promise.all(promises);
      setArticles(prev =>
        prev.map(a => (selectedIds.has(a.id) ? { ...a, status: status as any } : a))
      );
      setSelectedIds(new Set());
      router.refresh();
    } catch {
      alert('Error performing bulk update');
    } finally {
      setIsBulkLoading(false);
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`क्या आप चयनित ${selectedIds.size} समाचारों को स्थायी रूप से हटाना चाहते हैं?`)) return;

    setIsBulkLoading(true);
    try {
      const promises = Array.from(selectedIds).map(id =>
        fetch(`/api/articles/${id}`, { method: 'DELETE' })
      );
      await Promise.all(promises);
      setArticles(prev => prev.filter(a => !selectedIds.has(a.id)));
      setSelectedIds(new Set());
      router.refresh();
    } catch {
      alert('Error performing bulk delete');
    } finally {
      setIsBulkLoading(false);
    }
  };

  // Filter Pipeline
  const filtered = articles.filter(a => {
    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        a.title.toLowerCase().includes(q) ||
        (a.summary && a.summary.toLowerCase().includes(q)) ||
        a.sourceName.toLowerCase().includes(q) ||
        (a.district && a.district.toLowerCase().includes(q));
      if (!match) return false;
    }

    // 2. Source Filter
    if (filterSource === 'MANUAL' && a.sourceType !== 'MANUAL') return false;
    if (filterSource === 'API' && a.sourceType !== 'API') return false;

    // 3. Status Filter
    if (filterStatus === 'PUBLISHED' && a.status !== 'PUBLISHED') return false;
    if (filterStatus === 'DRAFT' && a.status !== 'DRAFT' && a.status !== 'IN_REVIEW') return false;

    // 4. District Filter
    if (filterDistrict !== 'ALL') {
      if (filterDistrict === 'statewide') {
        if (a.district) return false;
      } else if (a.district?.toLowerCase() !== filterDistrict.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="font-sans">
      {/* 1. Search and District Filter Controls */}
      <div className="p-4 bg-white border-b border-neutral-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Bar */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="शीर्षक, जिला या समाचार स्रोत खोजें... (उदा: गाजीपुर, मरदह, UP Police)"
            className="w-full pl-9 pr-8 py-2 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* District Filter Dropdown */}
        <div className="md:col-span-3">
          <select
            value={filterDistrict}
            onChange={e => setFilterDistrict(e.target.value)}
            className="w-full py-2 px-3 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-600 font-hindi"
          >
            <option value="ALL">📍 सभी जिले व क्षेत्र (All Districts)</option>
            <option value="ghazipur">📍 गाजीपुर (मरदह / फेफरा)</option>
            <option value="statewide">🌐 राज्यव्यापी / गैर-जिला</option>
            {UP_DISTRICTS.filter(d => d.id !== 'ghazipur').map(d => (
              <option key={d.id} value={d.id}>
                📍 {d.nameHindi} ({d.nameEnglish})
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter Dropdown */}
        <div className="md:col-span-2">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full py-2 px-2.5 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="ALL">सभी स्थिति (All Status)</option>
            <option value="PUBLISHED">🟢 लाइव प्रकाशित (Published)</option>
            <option value="DRAFT">🟡 ड्राफ्ट / समीक्षा (Draft)</option>
          </select>
        </div>

        {/* Source Filter Dropdown */}
        <div className="md:col-span-2">
          <select
            value={filterSource}
            onChange={e => setFilterSource(e.target.value)}
            className="w-full py-2 px-2.5 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="ALL">सभी स्रोत (All Sources)</option>
            <option value="MANUAL">✍️ मौलिक रिपोर्ट (CMS)</option>
            <option value="API">🔄 वायर सिंक (RSS Feed)</option>
          </select>
        </div>
      </div>

      {/* 2. Bulk Actions Bar (Appears when items are selected) */}
      {selectedIds.size > 0 && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-red-900">
            <CheckSquare className="w-4 h-4 text-red-600" />
            <span>{selectedIds.size} समाचार चयनित (Selected)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatus('PUBLISHED')}
              disabled={isBulkLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded font-bold transition flex items-center gap-1 shadow-2xs"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>प्रकाशित करें (Bulk Publish)</span>
            </button>

            <button
              onClick={() => handleBulkStatus('DRAFT')}
              disabled={isBulkLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded font-bold transition flex items-center gap-1 shadow-2xs"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>ड्राफ्ट बनाएं (Bulk Draft)</span>
            </button>

            <button
              onClick={handleBulkDelete}
              disabled={isBulkLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded font-bold transition flex items-center gap-1 shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>हटाएं (Bulk Delete)</span>
            </button>

            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-neutral-500 hover:text-black font-semibold px-2 py-1"
            >
              रद्द करें
            </button>
          </div>
        </div>
      )}

      {/* 3. Filter Stats Bar */}
      <div className="px-4 py-2 bg-neutral-50/70 border-b border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-3">
          <span>
            दिखाए जा रहे समाचार: <strong className="text-neutral-900">{filtered.length}</strong> / {articles.length}
          </span>
          {filterDistrict !== 'ALL' && (
            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[11px] font-bold">
              जिला: {filterDistrict}
            </span>
          )}
        </div>

        <button
          onClick={() => {
            setSearch('');
            setFilterSource('ALL');
            setFilterDistrict('ALL');
            setFilterStatus('ALL');
          }}
          className="text-red-600 hover:underline font-bold text-[11px]"
        >
          फ़िल्टर रीसेट करें
        </button>
      </div>

      {/* 4. Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-600">
          <thead className="bg-neutral-100/90 text-xs font-bold text-neutral-700 uppercase tracking-wider border-b border-neutral-200">
            <tr>
              <th className="py-3 px-3 w-10 text-center">
                <button
                  onClick={handleToggleSelectAll}
                  className="p-1 hover:text-red-600 transition"
                  title="सभी चुनें"
                >
                  {selectedIds.size > 0 && selectedIds.size === filtered.length ? (
                    <CheckSquare className="w-4 h-4 text-red-600" />
                  ) : (
                    <Square className="w-4 h-4 text-neutral-400" />
                  )}
                </button>
              </th>
              <th className="py-3 px-3">शीर्षक व विवरण (Headline)</th>
              <th className="py-3 px-3">जिला (District)</th>
              <th className="py-3 px-3">स्रोत (Source)</th>
              <th className="py-3 px-3 text-center">लीड पिन (Hero Pin)</th>
              <th className="py-3 px-3 text-center">ब्रेकिंग (Breaking)</th>
              <th className="py-3 px-3">स्थिति (Status)</th>
              <th className="py-3 px-3 text-right">व्यूज (Views)</th>
              <th className="py-3 px-4 text-right">कार्रवाई (Actions)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-neutral-400">
                  कोई समाचार नहीं मिला। कृपया अपने खोज शब्द या फ़िल्टर बदलें।
                </td>
              </tr>
            ) : (
              filtered.map(article => {
                const isSelected = selectedIds.has(article.id);
                return (
                  <tr
                    key={article.id}
                    className={`transition ${isSelected ? 'bg-red-50/50' : 'hover:bg-neutral-50/80'}`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleSelectOne(article.id)}
                        className="p-1 hover:text-red-600 transition"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-red-600" />
                        ) : (
                          <Square className="w-4 h-4 text-neutral-400" />
                        )}
                      </button>
                    </td>

                    {/* Headline */}
                    <td className="py-3 px-3 max-w-sm sm:max-w-md">
                      <div className="font-bold text-neutral-900 font-editorial text-sm line-clamp-2 hover:text-red-600 leading-snug">
                        <Link href={`/article/${article.slug}`} target="_blank">
                          {article.title}
                        </Link>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400 mt-1">
                        <span className="text-neutral-700 font-semibold">{article.category?.name || 'General'}</span>
                        <span>•</span>
                        <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('hi-IN')}</span>
                        {article.pointers && article.pointers.length > 0 && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 rounded">
                            {article.pointers.length} पॉइंटर्स
                          </span>
                        )}
                      </div>
                    </td>

                    {/* District */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {article.district ? (
                        <span className="inline-flex items-center gap-1 font-hindi text-[11px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                          <MapPin className="w-3 h-3" />
                          <span>{article.district === 'ghazipur' ? 'गाजीपुर (मरदह)' : article.district}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-neutral-400">राज्यव्यापी</span>
                      )}
                    </td>

                    {/* Source */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                          article.sourceType === 'API'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {article.sourceType === 'API' ? `API: ${article.sourceName}` : '✍️ मूल रिपोर्ट'}
                      </span>
                    </td>

                    {/* Pin to Hero Lead */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(article.id, article.isFeatured)}
                        className={`p-1.5 rounded transition ${
                          article.isFeatured
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-neutral-100 text-neutral-400 hover:text-amber-600'
                        }`}
                        title={article.isFeatured ? 'होमपेज लीड पर पिन है (क्लिक कर हटाएं)' : 'होमपेज लीड पर पिन करें'}
                      >
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </td>

                    {/* Breaking Alert */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleBreaking(article.id, article.isBreaking)}
                        className={`p-1.5 rounded transition ${
                          article.isBreaking
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-neutral-100 text-neutral-400 hover:text-red-600'
                        }`}
                        title={article.isBreaking ? 'ब्रेकिंग अलर्ट सक्रिय' : 'ब्रेकिंग अलर्ट बनाएं'}
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(article.id, article.status)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded cursor-pointer transition ${
                          article.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        title="स्थिति बदलने के लिए क्लिक करें"
                      >
                        {article.status === 'PUBLISHED' ? (
                          <>
                            <CheckCircle className="w-3 h-3" /> लाइव
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" /> ड्राफ्ट
                          </>
                        )}
                      </button>
                    </td>

                    {/* Views */}
                    <td className="py-3 px-3 text-right whitespace-nowrap font-medium text-neutral-700">
                      {(article.viewsCount || 0).toLocaleString('en-IN')}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(article)}
                          className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                          title="संपादित करें (Edit)"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <Link
                          href={`/article/${article.slug}`}
                          target="_blank"
                          className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded transition"
                          title="वेबसाइट पर देखें"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                          title="समाचार हटाएं (Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Inline Edit Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-neutral-200 overflow-hidden font-sans">
            <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-red-500" />
                <h3 className="font-bold text-base font-hindi">समाचार संपादित करें (Edit News Story)</h3>
              </div>
              <button
                onClick={() => setEditingArticle(null)}
                className="p-1 text-neutral-400 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  समाचार शीर्षक (Headline) *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full text-sm font-bold px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 font-hindi"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  संक्षिप्त विवरण (Standfirst / Summary)
                </label>
                <textarea
                  rows={2}
                  value={editSummary}
                  onChange={e => setEditSummary(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 font-hindi"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    जिला / क्षेत्र (District)
                  </label>
                  <select
                    value={editDistrict}
                    onChange={e => setEditDistrict(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg bg-white font-hindi"
                  >
                    <option value="">राज्यव्यापी (कोई विशेष जिला नहीं)</option>
                    <option value="ghazipur">गाजीपुर (मरदह / फेफरा)</option>
                    {UP_DISTRICTS.filter(d => d.id !== 'ghazipur').map(d => (
                      <option key={d.id} value={d.id}>
                        {d.nameHindi} ({d.nameEnglish})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    प्रकाशन स्थिति (Status)
                  </label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                  >
                    <option value="PUBLISHED">🟢 लाइव प्रकाशित (PUBLISHED)</option>
                    <option value="DRAFT">🟡 ड्राफ्ट (DRAFT)</option>
                  </select>
                </div>
              </div>

              {/* 3 Bullet Points (Amar Ujala Pointers) */}
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                <span className="block text-xs font-bold text-neutral-800 font-hindi">
                  मुख्य 3 पॉइंटर्स (Bullet Point Takeaways):
                </span>
                {[0, 1, 2].map(idx => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-red-600 font-black text-sm">•</span>
                    <input
                      type="text"
                      placeholder={`पॉइंटर #${idx + 1}...`}
                      value={editPointers[idx] || ''}
                      onChange={e => {
                        const next = [...editPointers];
                        next[idx] = e.target.value;
                        setEditPointers(next);
                      }}
                      className="flex-1 py-1 px-2.5 border border-neutral-300 rounded text-xs font-hindi"
                    />
                  </div>
                ))}
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2 border-t border-neutral-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsBreaking}
                    onChange={e => setEditIsBreaking(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-neutral-800">
                    🔴 ब्रेकिंग न्यूज़ अलर्ट टिकर में शामिल करें
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsFeatured}
                    onChange={e => setEditIsFeatured(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-amber-900">
                    ⭐ होमपेज लीड स्टोरी (Hero Grid) पर पिन करें
                  </span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingEdit ? 'सहेजा जा रहा है...' : 'परिवर्तन सहेजें (Save Changes)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
