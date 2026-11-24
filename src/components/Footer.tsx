import React from 'react';
import Link from 'next/link';
import { Rss, ShieldCheck, Globe, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-12 pb-8 border-t border-neutral-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-800">
          {/* Brand Manifesto */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="inline-block">
              <img
                src="/images/nexus-news-up-logo.png"
                alt="Nexus News UP - उत्तर प्रदेश"
                className="h-14 w-auto object-contain rounded-md shadow-md border border-neutral-800"
              />
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed">
              <strong className="text-white">Nexus News UP (उत्तर प्रदेश)</strong> — राज्य की प्रमुख खबरें, राजनीतिक विश्लेषण, ज़मीनी कवरेज और देश-दुनिया के ताज़ा समाचार।
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>सत्यापित व निष्पक्ष पत्रकारिता</span>
            </div>
          </div>

          {/* Editorial Desks */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Desks</h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li><Link href="/category/world" className="hover:text-white transition">World Geopolitics</Link></li>
              <li><Link href="/category/technology" className="hover:text-white transition">Deep Technology & AI</Link></li>
              <li><Link href="/category/business" className="hover:text-white transition">Global Markets & Economy</Link></li>
              <li><Link href="/category/science" className="hover:text-white transition">Science, Energy & Climate</Link></li>
              <li><Link href="/category/politics" className="hover:text-white transition">Policy & Elections</Link></li>
              <li><Link href="/jobs" className="text-amber-400 hover:text-amber-300 font-bold transition">💼 सरकारी नौकरी & करियर केंद्र</Link></li>
            </ul>
          </div>

          {/* Legal & Syndication */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Compliance & Feeds</h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li>
                <a href="/sitemap.xml" target="_blank" className="hover:text-white transition">
                  XML Sitemap
                </a>
              </li>
              <li>
                <a href="/news-sitemap.xml" target="_blank" className="hover:text-white transition flex items-center gap-1 text-red-400">
                  Google News Sitemap (48h)
                </a>
              </li>
              <li>
                <Link href="/admin/sync" prefetch={false} className="hover:text-white transition flex items-center gap-1">
                  <Rss className="w-3.5 h-3.5" /> RSS Pipeline Status
                </Link>
              </li>
              <li><span className="text-neutral-500">API Copyright Compliance: Fair Use Snippets</span></li>
            </ul>
          </div>

          {/* Publishing CMS Portal */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Publishing Staff</h4>
            <p className="text-xs text-neutral-400">
              Reporters and editors can access the unified CMS to draft articles, verify breaking alerts, or review automated wire syncs.
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                prefetch={false}
                className="inline-block bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase px-3 py-1.5 rounded transition"
              >
                Access CMS Console &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3">
          <p>© {new Date().getFullYear()} Nexus News Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5" /> Next.js 14 • Tailwind • Prisma
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
