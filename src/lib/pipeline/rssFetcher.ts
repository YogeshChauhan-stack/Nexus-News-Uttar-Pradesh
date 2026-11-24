import { XMLParser } from 'fast-xml-parser';
import { RSSFeedSource } from '../types';
import { detectDistrictFromText, formatAmarUjalaHeadline } from '../districts';

export interface ExtendedRSSFeedSource extends RSSFeedSource {
  defaultDistrict?: string;
}

export const POPULAR_NEWS_FEEDS: ExtendedRSSFeedSource[] = [
  // Uttar Pradesh Regional Feeds (Top Priority)
  {
    id: 'up-ghazipur-mardah',
    name: 'गाजीपुर, मरदह एवं फेफरा बुलेटिन',
    url: 'https://news.google.com/rss/search?q=%E0%A4%97%E0%A4%BE%E0%A4%9C%E0%A4%80%E0%A4%AA%E0%A5%81%E0%A4%B0+OR+%E0%A4%AE%E0%A4%B0%E0%A4%A6%E0%A4%B9+OR+%E0%A4%AB%E0%A5%87%E0%A4%AB%E0%A4%B0%E0%A4%BE&hl=hi&gl=IN&ceid=IN:hi',
    categorySlug: 'uttar-pradesh',
    defaultDistrict: 'ghazipur',
    defaultStatus: 'PUBLISHED'
  },
  {
    id: 'up-state',
    name: 'उत्तर प्रदेश मुख्य समाचार',
    url: 'https://news.google.com/rss/search?q=%E0%A4%89%E0%A4%A4%E0%A5%8D%E0%A4%A4%E0%A4%B0+%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%A6%E0%A5%87%E0%A4%B6&hl=hi&gl=IN&ceid=IN:hi',
    categorySlug: 'uttar-pradesh',
    defaultStatus: 'PUBLISHED'
  },
  {
    id: 'up-lucknow',
    name: 'लखनऊ एवं मध्य यूपी',
    url: 'https://news.google.com/rss/search?q=%E0%A4%B2%E0%A4%96%E0%A4%A8%E0%A4%8A&hl=hi&gl=IN&ceid=IN:hi',
    categorySlug: 'uttar-pradesh',
    defaultDistrict: 'lucknow',
    defaultStatus: 'PUBLISHED'
  },
  {
    id: 'up-varanasi-ayodhya',
    name: 'वाराणसी एवं अयोध्या धाम',
    url: 'https://news.google.com/rss/search?q=%E0%A4%B5%E0%A4%BE%E0%A4%A3%E0%A4%BE%E0%A4%B0%E0%A4%B8%E0%A5%80+OR+%E0%A4%85%E0%A4%AF%E0%A5%8B%E0%A4%A7%E0%A5%8D%E0%A4%AF%E0%A4%BE&hl=hi&gl=IN&ceid=IN:hi',
    categorySlug: 'uttar-pradesh',
    defaultDistrict: 'varanasi',
    defaultStatus: 'PUBLISHED'
  },
  {
    id: 'up-kanpur-prayagraj',
    name: 'कानपुर एवं प्रयागराज',
    url: 'https://news.google.com/rss/search?q=%E0%A4%95%E0%A4%BE%E0%A4%A8%E0%A4%AA%E0%A5%81%E0%A4%B0+OR+%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%AF%E0%A4%BE%E0%A4%97%E0%A4%B0%E0%A4%BE%E0%A4%9C&hl=hi&gl=IN&ceid=IN:hi',
    categorySlug: 'uttar-pradesh',
    defaultDistrict: 'kanpur',
    defaultStatus: 'PUBLISHED'
  },
  {
    id: 'up-meerut-west',
    name: 'मेरठ, आगरा एवं पश्चिम यूपी',
    url: 'https://news.google.com/rss/search?q=%E0%A4%AE%E0%A5%87%E0%A4%B0%E0%A4%A0+OR+%E0%A4%86%E0%A4%97%E0%A4%B0%E0%A4%BE+OR+%E0%A4%A8%E0%A5%8B%E0%A4%8F%E0%A4%A1%E0%A4%BE&hl=hi&gl=IN&ceid=IN:hi',
    categorySlug: 'uttar-pradesh',
    defaultDistrict: 'meerut',
    defaultStatus: 'PUBLISHED'
  },
  // National & Global Feeds
  {
    id: 'bbc-world',
    name: 'BBC World News',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    categorySlug: 'world',
    defaultStatus: 'PUBLISHED'
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    categorySlug: 'technology',
    defaultStatus: 'PUBLISHED'
  },
  {
    id: 'wired-tech',
    name: 'Wired Science',
    url: 'https://www.wired.com/feed/category/science/latest/rss',
    categorySlug: 'science',
    defaultStatus: 'PUBLISHED'
  },
  {
    id: 'cnbc-biz',
    name: 'CNBC Markets & Economy',
    url: 'https://search.cnbc.com/rs/search/view.html?partnerId=2000&keywords=markets&sort=date',
    categorySlug: 'business',
    defaultStatus: 'PUBLISHED'
  }
];

export interface RawNewsItem {
  title: string;
  link: string;
  summary: string;
  content: string;
  imageUrl?: string;
  publishedAt: string;
  sourceName: string;
  categorySlug: string;
  district?: string;
  pointers?: string[];
}

/**
 * Generate 2-3 Amar Ujala style bullet points (पॉइंटर्स)
 */
function extractBulletPointers(title: string, summary: string): string[] {
  const sentences = summary
    .split(/[।.;]/)
    .map(s => s.trim())
    .filter(s => s.length > 15 && s !== title);

  if (sentences.length >= 2) {
    return sentences.slice(0, 3);
  }

  // Fallbacks based on title
  return [
    `${title} को लेकर प्रशासन और संबंधित विभागों में अलर्ट जारी।`,
    'स्थानीय स्तर पर स्थिति की लगातार निगरानी की जा रही है।',
    'विस्तृत जानकारी और आधिकारिक बयान की प्रतीक्षा।'
  ];
}

export async function fetchRSSFeed(feed: ExtendedRSSFeedSource): Promise<RawNewsItem[]> {
  try {
    const res = await fetch(feed.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NexusNewsBot/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
      },
      next: { revalidate: 900 }
    });

    if (!res.ok) {
      console.warn(`Failed to fetch RSS from ${feed.name}: HTTP ${res.status}`);
      return [];
    }

    const xmlText = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });

    const parsed = parser.parse(xmlText);
    const channel = parsed.rss?.channel || parsed.feed;
    if (!channel) return [];

    const items = channel.item || channel.entry || [];
    const itemArray = Array.isArray(items) ? items : [items];

    const results: RawNewsItem[] = [];

    for (const item of itemArray.slice(0, 10)) {
      const rawTitle = item.title?.['#text'] || item.title || '';
      const link = item.link?.['#text'] || item.link?.['@_href'] || item.link || '';
      const desc = item.description?.['#text'] || item.description || item.summary?.['#text'] || item.summary || '';
      
      // Clean HTML from summary
      const cleanSummary = String(desc)
        .replace(/<[^>]*>?/gm, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .trim();

      // Extract image if available
      let imageUrl = '';
      if (item['media:content']?.['@_url']) {
        imageUrl = item['media:content']['@_url'];
      } else if (item['media:thumbnail']?.['@_url']) {
        imageUrl = item['media:thumbnail']['@_url'];
      } else if (item.enclosure?.['@_url'] && item.enclosure?.['@_type']?.startsWith('image')) {
        imageUrl = item.enclosure['@_url'];
      }

      // Default fallback imagery based on category if RSS did not supply one
      if (!imageUrl) {
        if (feed.categorySlug === 'uttar-pradesh') {
          imageUrl = 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&auto=format&fit=crop&q=80'; // UP / India Heritage photo
        } else if (feed.categorySlug === 'technology') {
          imageUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80';
        } else if (feed.categorySlug === 'business') {
          imageUrl = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1000&auto=format&fit=crop&q=80';
        } else if (feed.categorySlug === 'science') {
          imageUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80';
        } else {
          imageUrl = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80';
        }
      }

      const pubDate = item.pubDate || item.published || item.updated || new Date().toISOString();

      if (rawTitle && link) {
        // District identification
        const detected = detectDistrictFromText(String(rawTitle) + ' ' + cleanSummary);
        const districtId = detected ? detected.id : (feed.defaultDistrict || (feed.categorySlug === 'uttar-pradesh' ? 'lucknow' : undefined));

        // Format headline with Amar Ujala district prefix if UP category
        let finalTitle = String(rawTitle).trim();
        // Remove trailing source attribution like "- Navbharat Live" or "- Amar Ujala" from Google News title
        const sourceDashIdx = finalTitle.lastIndexOf(' - ');
        if (sourceDashIdx > 15) {
          finalTitle = finalTitle.substring(0, sourceDashIdx).trim();
        }

        if (feed.categorySlug === 'uttar-pradesh' && detected && !finalTitle.includes(':')) {
          finalTitle = `${detected.nameHindi}: ${finalTitle}`;
        }

        const pointers = extractBulletPointers(finalTitle, cleanSummary);

        results.push({
          title: finalTitle,
          link: String(link).trim(),
          summary: cleanSummary.slice(0, 320) || finalTitle,
          content: `<p>${cleanSummary || finalTitle}</p>`,
          imageUrl,
          publishedAt: new Date(pubDate).toISOString(),
          sourceName: feed.name,
          categorySlug: feed.categorySlug,
          district: districtId,
          pointers
        });
      }
    }

    return results;
  } catch (error) {
    console.error(`Error parsing feed ${feed.name}:`, error);
    return [];
  }
}
