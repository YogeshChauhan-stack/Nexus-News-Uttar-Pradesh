'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Image as ImageIcon,
  Zap,
  MapPin,
  Star,
  FileText,
  Pin
} from 'lucide-react';
import { Category } from '@/lib/types';
import { UP_DISTRICTS } from '@/lib/districts';

export default function NewArticlePublisher() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('cat-up');
  const [district, setDistrict] = useState('ghazipur');
  const [sourceName, setSourceName] = useState('नेक्सस गाजीपुर डेस्क');
  const [featuredImage, setFeaturedImage] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'DRAFT' | 'IN_REVIEW' | 'PUBLISHED'>('PUBLISHED');
  const [pointers, setPointers] = useState<string[]>(['', '', '']);
  const [tags, setTags] = useState('उत्तर प्रदेश, गाजीपुर, ब्रेकिंग');

  useEffect(() => {
    // Preset full categories
    setCategories([
      { id: 'cat-up', name: 'उत्तर प्रदेश (UP State)', slug: 'uttar-pradesh' },
      { id: 'cat-1', name: 'देश व राजनीति (World & Politics)', slug: 'world' },
      { id: 'cat-2', name: 'साइंस व टेक्नोलॉजी (Technology)', slug: 'technology' },
      { id: 'cat-3', name: 'कारोबार व बाजार (Business)', slug: 'business' },
      { id: 'cat-4', name: 'जलवायु व विज्ञान (Science & Climate)', slug: 'science' },
      { id: 'cat-5', name: 'चुनाव विशेष (Elections)', slug: 'politics' },
      { id: 'cat-6', name: 'मनोरंजन व समाज (Culture)', slug: 'culture' }
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('कृपया समाचार का शीर्षक और मुख्य विवरण भरें।');
      return;
    }

    setIsSubmitting(true);
    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      const cleanedPointers = pointers.map(p => p.trim()).filter(Boolean);

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          summary,
          content: content.startsWith('<p>') ? content : `<p>${content.replace(/\n\n/g, '</p><p>')}</p>`,
          categoryId,
          district: district || undefined,
          sourceName: sourceName.trim() || 'Nexus Editorial',
          featuredImage: featuredImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
          isBreaking,
          isFeatured,
          status,
          pointers: cleanedPointers.length > 0 ? cleanedPointers : undefined,
          tags: tagArray
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to publish');
      }

      const created = await res.json();
      router.push(`/article/${created.slug}`);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error publishing article');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6 font-sans">
      {/* Top action header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black uppercase transition"
        >
          <ArrowLeft className="w-4 h-4" /> वापस एडमिन कंसोल (Back to Console)
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Newsroom Editorial Publisher
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Editorial Details */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm space-y-5">
          {/* Headline */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              समाचार शीर्षक (Headline) *
            </label>
            <input
              type="text"
              required
              placeholder="उदा: गाजीपुर: मरदह ब्लॉक के फेफरा गांव में नई सड़क व पेयजल परियोजना को मिली मंजूरी"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-lg sm:text-xl font-bold px-3.5 py-2.5 border border-neutral-300 rounded focus:outline-none focus:border-red-600 font-hindi"
            />
          </div>

          {/* District, Category, Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                जिला / क्षेत्र (District)
              </label>
              <select
                value={district}
                onChange={e => {
                  setDistrict(e.target.value);
                  if (e.target.value === 'ghazipur') {
                    setSourceName('नेक्सस गाजीपुर डेस्क');
                  }
                }}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-red-600 bg-white font-hindi"
              >
                <option value="ghazipur">📍 गाजीपुर (मरदह / फेफरा)</option>
                <option value="">🌐 राज्यव्यापी (कोई विशेष जिला नहीं)</option>
                {UP_DISTRICTS.filter(d => d.id !== 'ghazipur').map(d => (
                  <option key={d.id} value={d.id}>
                    📍 {d.nameHindi} ({d.nameEnglish})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                संपादकीय डेस्क (Category) *
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-red-600 bg-white font-hindi"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                प्रकाशन स्थिति (Status)
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-red-600 bg-white"
              >
                <option value="PUBLISHED">🟢 लाइव तुरंत प्रकाशित (PUBLISHED)</option>
                <option value="IN_REVIEW">🟡 संपादक समीक्षा (IN_REVIEW)</option>
                <option value="DRAFT">⚪ ड्राफ्ट कार्य (DRAFT)</option>
              </select>
            </div>
          </div>

          {/* Source Name & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                स्रोत नाम (Source / Bureau)
              </label>
              <input
                type="text"
                placeholder="उदा: नेक्सस गाजीपुर डेस्क / पूर्वांचल ब्यूरो"
                value={sourceName}
                onChange={e => setSourceName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-red-600 font-hindi"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                संक्षिप्त सारांश (Standfirst / Lead Summary)
              </label>
              <input
                type="text"
                placeholder="1-2 वाक्यों में खबर का मुख्य सार..."
                value={summary}
                onChange={e => setSummary(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-red-600 font-hindi"
              />
            </div>
          </div>

          {/* 3 Amar Ujala Style Bullet Points */}
          <div className="p-4 bg-amber-50/60 rounded-lg border border-amber-200/80 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>अमर उजाला स्टाइल 3 मुख्य पॉइंटर्स (Key Takeaways):</span>
            </div>
            {[0, 1, 2].map(idx => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-red-600 font-black text-sm">•</span>
                <input
                  type="text"
                  placeholder={`पॉइंटर #${idx + 1} (उदा: मरदह ब्लॉक के ग्राम फेफरा में संपर्क मार्ग का कायाकल्प)`}
                  value={pointers[idx] || ''}
                  onChange={e => {
                    const next = [...pointers];
                    next[idx] = e.target.value;
                    setPointers(next);
                  }}
                  className="flex-1 py-1.5 px-3 border border-neutral-300 rounded text-xs bg-white font-hindi"
                />
              </div>
            ))}
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              कवर फोटो URL (Featured Image)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={featuredImage}
                onChange={e => setFeaturedImage(e.target.value)}
                className="flex-1 text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-red-600 font-mono"
              />
              <button
                type="button"
                onClick={() => setFeaturedImage('https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=1200&auto=format&fit=crop&q=80')}
                className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded font-semibold whitespace-nowrap transition"
              >
                सैंपल फोटो
              </button>
            </div>
            {featuredImage && (
              <div className="mt-2 w-48 aspect-video rounded overflow-hidden border border-neutral-200">
                <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Body Content */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              समाचार का पूर्ण विवरण (Full Story Copy) *
            </label>
            <textarea
              rows={10}
              required
              placeholder="<p>गाजीपुर जिले के मरदह विकास खंड में...</p>&#10;&#10;<p>स्थानीय ग्रामीणों और अधिकारियों ने बताया कि...</p>"
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full text-xs font-hindi px-3.5 py-3 border border-neutral-300 rounded focus:outline-none focus:border-red-600 leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              टैग्स (Tags - अल्पविराम से अलग करें)
            </label>
            <input
              type="text"
              placeholder="गाजीपुर, मरदह, फेफरा, विकास, उत्तर प्रदेश"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-red-600 font-hindi"
            />
          </div>

          {/* Switches */}
          <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Urgent Breaking Ticker */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBreaking}
                onChange={e => setIsBreaking(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-neutral-900 block">
                  🔴 ब्रेकिंग न्यूज़ टिकर में पिन करें
                </span>
                <span className="text-[11px] text-neutral-500">
                  शीर्ष ब्रेकिंग न्यूज़ बैनर पर तुरंत प्रदर्शित होगी
                </span>
              </div>
            </label>

            {/* Pin as Hero Lead */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-amber-900 block">
                  ⭐ होमपेज लीड स्टोरी (Hero Grid) पर पिन करें
                </span>
                <span className="text-[11px] text-neutral-500">
                  होमपेज के मुख्य 68% बड़े बॉक्स में पहली खबर बनेगी
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit action */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin"
            className="px-5 py-2.5 rounded text-xs font-bold uppercase text-neutral-600 hover:text-black transition"
          >
            रद्द करें (Cancel)
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase px-6 py-2.5 rounded transition shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'प्रकाशित हो रहा है...' : 'समाचार प्रकाशित करें (Publish Article)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
