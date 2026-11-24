import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import BreakingTicker from '@/components/BreakingTicker';
import MandiWeatherStrip from '@/components/MandiWeatherStrip';
import UPDistrictBar from '@/components/UPDistrictBar';
import AmarUjalaHeroGrid from '@/components/AmarUjalaHeroGrid';
import JobWidget from '@/components/JobWidget';
import CityNewsSection from '@/components/CityNewsSection';
import CommunityAlertBar from '@/components/CommunityAlertBar';
import AajTakVideoReel from '@/components/AajTakVideoReel';
import ArticleCard from '@/components/ArticleCard';
import TrendingSidebar from '@/components/TrendingSidebar';
import CategorySection from '@/components/CategorySection';
import AutoRefresh from '@/components/AutoRefresh';
import { UP_DISTRICTS } from '@/lib/districts';

export const revalidate = 60; // ISR every 60 seconds

interface PageProps {
  searchParams?: {
    city?: string;
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  // Determine selected district from query param or persistent cookie
  const cookieStore = cookies();
  const rawCity = searchParams?.city || cookieStore.get('nexus_user_city')?.value || 'ghazipur';
  const selectedCity = rawCity.toLowerCase();
  const currentDistrict = UP_DISTRICTS.find(d => d.id === selectedCity);

  // Fetch articles prioritized by the user's detected / selected location
  const { articles } = await db.getArticles({
    limit: 30,
    priorityDistrict: selectedCity
  });

  const trending = await db.getTrendingArticles(5);
  const categories = await db.getCategories();

  if (articles.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg border border-neutral-200 p-8 my-8">
        <h2 className="text-2xl font-bold font-editorial text-neutral-800">कोई खबर उपलब्ध नहीं है</h2>
        <p className="text-sm text-neutral-500 mt-2">
          न्यूज फीड सिंक करें या एडिटोरियल सीएमएस से पहली खबर प्रकाशित करें।
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/admin/sync"
            prefetch={false}
            className="bg-aajtak-red hover:bg-aajtak-darkRed text-white px-4 py-2 rounded text-sm font-bold uppercase transition"
          >
            Run News Sync Now
          </Link>
          <Link
            href="/admin/new"
            prefetch={false}
            className="border border-neutral-300 hover:border-black px-4 py-2 rounded text-sm font-bold uppercase transition"
          >
            Create Article
          </Link>
        </div>
      </div>
    );
  }

  const [leadStory, ...remaining] = articles;
  const secondaryStories = remaining.slice(0, 4);
  const feedStories = remaining.slice(4);

  // Filter city-specific articles for "आपके शहर की बड़ी खबरें"
  const cityArticles = articles.filter(a =>
    a.district?.toLowerCase() === selectedCity && a.id !== leadStory.id
  );

  // Group by category for thematic blocks
  const upArticles = articles.filter(a => a.category?.slug === 'uttar-pradesh');
  const techArticles = articles.filter(a => a.category?.slug === 'technology');
  const bizArticles = articles.filter(a => a.category?.slug === 'business');
  const scienceArticles = articles.filter(a => a.category?.slug === 'science');

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Silent auto-refresh every 5 mins to pick up new articles */}
      <AutoRefresh intervalMinutes={5} />

      {/* 1. Superfast Breaking News Flash Ticker */}
      <BreakingTicker />

      {/* 2. Live Mandi Bhav (Ghazipur/UP) & Weather Strip */}
      <MandiWeatherStrip />

      {/* 3. Amar Ujala Style Regional UP District Switcher Bar */}
      <UPDistrictBar activeDistrictId={selectedCity} />

      {/* 4. Amar Ujala Style 68/32 Lead Hero Grid with 3 Pointers & City Prefixes */}
      <AmarUjalaHeroGrid
        leadArticle={leadStory}
        secondaryArticles={secondaryStories}
        userDistrictHindi={currentDistrict?.nameHindi}
      />

      {/* 5. Dedicated Country & State-wise Job Notification Center */}
      <JobWidget />

      {/* 6. Location-Prioritized "आपके शहर की बड़ी खबरें" Block */}
      {cityArticles.length > 0 && (
        <CityNewsSection
          districtNameHindi={currentDistrict?.nameHindi || 'उत्तर प्रदेश'}
          articles={cityArticles}
        />
      )}

      {/* 7. Official WhatsApp & Telegram Community Channel Alert Bar */}
      <CommunityAlertBar />

      {/* 4. Continuous News Feed Stream + Trending Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* News Feed Stream (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="border-b-2 border-red-600 pb-2 flex items-center justify-between">
            <h3 className="text-lg font-black font-editorial uppercase tracking-wide text-neutral-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full"></span>
              <span>ताज़ा समाचार प्रवाह (Continuous Wire Stream)</span>
            </h3>
            <span className="text-xs font-bold text-neutral-400">लाइव अपडेट्स</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {feedStories.slice(0, 6).map(story => (
              <ArticleCard key={story.id} article={story} variant="grid" />
            ))}
          </div>
        </div>

        {/* Trending Sidebar (#1 to #5) (4 cols) */}
        <div className="lg:col-span-4">
          <TrendingSidebar articles={trending} />
        </div>
      </div>

      {/* 5. Amar Ujala TV Style Multimedia Video Reel Section */}
      <AajTakVideoReel articles={articles} />

      {/* 6. Live Broadcast Banner */}
      <section className="bg-gradient-to-r from-neutral-900 via-[#002765] to-neutral-900 text-white rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border-l-8 border-red-600">
        <div className="space-y-2 max-w-2xl">
          <span className="text-yellow-400 font-black uppercase tracking-wider text-xs">
            लाइव अपडेट्स & विश्लेषण / 24x7 BROADCAST
          </span>
          <h3 className="text-xl sm:text-2xl font-editorial font-bold">
            नेक्सस न्यूज़ यूपी डिजिटल बुलेटिन (Real-Time Automated News Wire)
          </h3>
          <p className="text-neutral-300 text-xs sm:text-sm">
            उत्तर प्रदेश के 75 जिलों से पल-पल की खबरें, ग्राउंड रिपोर्ट और सरकारी घोषणाएं सीधे आपके मोबाइल पर।
          </p>
        </div>
        <div className="shrink-0 flex gap-3">
          <Link
            href="/admin"
            prefetch={false}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-5 py-3 rounded-lg tracking-wider transition shadow-md"
          >
            Editorial CMS Console &rarr;
          </Link>
        </div>
      </section>

      {/* 7. Category Thematic Sections */}
      {upArticles.length > 0 && (
        <CategorySection
          category={categories.find(c => c.slug === 'uttar-pradesh') || { id: 'cat-up', name: 'उत्तर प्रदेश', slug: 'uttar-pradesh' }}
          articles={upArticles}
        />
      )}

      {techArticles.length > 0 && (
        <CategorySection
          category={categories.find(c => c.slug === 'technology') || { id: 'tech', name: 'Technology', slug: 'technology' }}
          articles={techArticles}
        />
      )}

      {bizArticles.length > 0 && (
        <CategorySection
          category={categories.find(c => c.slug === 'business') || { id: 'biz', name: 'Business & Economy', slug: 'business' }}
          articles={bizArticles}
        />
      )}

      {scienceArticles.length > 0 && (
        <CategorySection
          category={categories.find(c => c.slug === 'science') || { id: 'sci', name: 'Science & Climate', slug: 'science' }}
          articles={scienceArticles}
        />
      )}
    </div>
  );
}
