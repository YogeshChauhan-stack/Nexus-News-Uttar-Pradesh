import fs from 'fs';
import path from 'path';
import { Article, Category, User, Tag } from './types';
import { JobNotification, SAMPLE_JOBS } from './jobs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  users: User[];
  categories: Category[];
  tags: Tag[];
  articles: Article[];
  jobs?: JobNotification[];
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-up', name: 'उत्तर प्रदेश', slug: 'uttar-pradesh', description: 'उत्तर प्रदेश की ताज़ा ख़बरें, राजनीति, विकास और क्षेत्रीय समाचार' },
  { id: 'cat-1', name: 'World', slug: 'world', description: 'Global affairs, geopolitics, and international diplomacy' },
  { id: 'cat-2', name: 'Technology', slug: 'technology', description: 'AI, computing, cybersecurity, and emerging tech breakthroughs' },
  { id: 'cat-3', name: 'Business & Economy', slug: 'business', description: 'Global markets, macroeconomic policy, startups, and commodities' },
  { id: 'cat-4', name: 'Science & Climate', slug: 'science', description: 'Space exploration, renewable energy, and environmental research' },
  { id: 'cat-5', name: 'Politics', slug: 'politics', description: 'Governance, elections, legislation, and public policies' },
  { id: 'cat-6', name: 'Culture & Arts', slug: 'culture', description: 'Cinema, literature, architecture, and contemporary society' },
];

const DEFAULT_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Alexandra Vance',
    email: 'editor@nexusnews.org',
    role: 'ADMIN',
    bio: 'Senior Investigative Journalist & Chief Managing Editor at Nexus.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-tech',
    name: 'Marcus Sterling',
    email: 'm.sterling@nexusnews.org',
    role: 'EDITOR',
    bio: 'Technology columnist covering artificial intelligence, quantum systems, and silicon engineering.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_ARTICLES: Article[] = [
  {
    id: 'art-lead-1',
    title: 'Global Energy Summit Ratifies Historic Treaty on Next-Generation Clean Grids',
    slug: 'global-energy-summit-ratifies-historic-treaty-clean-grids',
    summary: 'Delegates from 64 nations conclude bilateral negotiations, committing $320B toward cross-border resilient HVDC grids and automated power distribution networks.',
    content: `<p>In what diplomatic observers are calling the most ambitious cross-border infrastructure pact of the decade, delegates from 64 countries formally ratified the International Intergrid Protocol in Geneva today.</p>
<p>The agreement outlines a binding commitment of <strong>$320 billion over eight years</strong> to co-fund high-voltage direct current (HVDC) transmission lines connecting continental solar corridors with offshore wind hubs.</p>
<blockquote>"We are moving from intermittent localized renewable experiments to an interconnected planetary baseload," stated Chief Energy Commissioner Elena Rostova during the final press briefing.</blockquote>
<h3>Key Tenets of the Geneva Treaty</h3>
<ul>
  <li><strong>Universal Transmission Standardization:</strong> Harmonizing smart sub-station switching protocols to minimize packet loss across 10,000-kilometer lines.</li>
  <li><strong>Sovereign Energy Reserve Sharing:</strong> Automated load-balancing between adjacent countries during peak heatwave and arctic blast anomalies.</li>
  <li><strong>Critical Mineral Supply Safeguards:</strong> Collective stockpiling agreements for neodymium, lithium, and rare-earth magnetic alloys.</li>
</ul>
<p>Construction on the first multinational corridor—spanning North Africa to Southern Europe—is scheduled to commence early next quarter.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&auto=format&fit=crop&q=80',
    sourceType: 'MANUAL',
    sourceName: 'Nexus Editorial',
    status: 'PUBLISHED',
    isBreaking: true,
    viewsCount: 14200,
    authorId: 'user-admin',
    categoryId: 'cat-4',
    tags: ['Energy', 'Climate', 'Global Policy', 'Infrastructure'],
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  },
  {
    id: 'art-tech-1',
    title: 'Breakthrough Optical Neural Chips Demonstrate 100x Efficiency in Real-Time Inference',
    slug: 'breakthrough-optical-neural-chips-demonstrate-100x-efficiency',
    summary: 'Photonic computing architecture bypasses copper interconnect heat walls, enabling billion-parameter model executions at fractions of standard wattage.',
    content: `<p>Researchers have unveiled a commercial-scale silicon photonics accelerator capable of matrix multiplication using guided wave light beams rather than electron transistors.</p>
<p>The architecture reduces thermal throttling by over 90%, opening new horizons for localized edge inference without massive data center cooling requirements.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    sourceType: 'MANUAL',
    sourceName: 'Nexus Tech Desk',
    status: 'PUBLISHED',
    isBreaking: false,
    viewsCount: 8930,
    authorId: 'user-tech',
    categoryId: 'cat-2',
    tags: ['AI', 'Hardware', 'Photonics', 'Deep Tech'],
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString()
  },
  {
    id: 'art-biz-1',
    title: 'Central Banks Pioneer Unified Cross-Border Settlement Rail with Instant Liquidity Pools',
    slug: 'central-banks-pioneer-unified-cross-border-settlement-rail',
    summary: 'A consortium of top financial authorities completes trial transfers slashing multi-day correspondent banking delays down to 400 milliseconds.',
    content: `<p>The long-standing frictions of international remittance and multi-currency foreign exchange settlement took a major step toward obsolescence this morning.</p>
<p>The consortium demonstrated seamless high-volume settlements without requiring intermediate liquidity hoarding across foreign custodian vaults.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
    sourceType: 'MANUAL',
    sourceName: 'Nexus Financial Desk',
    status: 'PUBLISHED',
    isBreaking: false,
    viewsCount: 6510,
    authorId: 'user-admin',
    categoryId: 'cat-3',
    tags: ['Economy', 'Banking', 'Fintech', 'Markets'],
    publishedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString()
  },
  {
    id: 'art-api-demo-1',
    title: 'Autonomous Ocean Mapping Drones Complete First Comprehensive Trench Topography',
    slug: 'autonomous-ocean-mapping-drones-complete-first-trench-topography',
    summary: 'Sub-surface robotic fleets map previously unreachable seabed fault lines, revealing surprising hydrothermal vent biological clusters.',
    content: `<p>A synchronized swarm of deep-sea unmanned exploratory vessels has surfaced with over 40 terabytes of multi-beam bathymetric scans from the Kermadec Trench.</p>
<p>The automated dataset provides unprecedented clarity on seismic subduction zones and deep ocean thermal vents.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&auto=format&fit=crop&q=80',
    sourceType: 'API',
    sourceName: 'Reuters Science Wire',
    externalUrl: 'https://www.reuters.com/science',
    status: 'PUBLISHED',
    isBreaking: false,
    viewsCount: 4120,
    categoryId: 'cat-4',
    tags: ['Oceanography', 'Robotics', 'Science Wire'],
    publishedAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 520).toISOString()
  }
];

function ensureDataFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      users: DEFAULT_USERS,
      categories: DEFAULT_CATEGORIES,
      tags: [],
      articles: DEFAULT_ARTICLES,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data: DatabaseSchema = JSON.parse(raw);
    if (!data.jobs || data.jobs.length === 0) {
      data.jobs = [...SAMPLE_JOBS];
      saveDatabase(data);
    }
    return data;
  } catch (err) {
    console.error('Error reading db.json, restoring defaults', err);
    const fallback: DatabaseSchema = {
      users: DEFAULT_USERS,
      categories: DEFAULT_CATEGORIES,
      tags: [],
      articles: DEFAULT_ARTICLES,
      jobs: [...SAMPLE_JOBS]
    };
    return fallback;
  }
}

function saveDatabase(data: DatabaseSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export const db = {
  // Articles
  async getArticles(options?: {
    status?: string;
    categorySlug?: string;
    sourceType?: string;
    isBreaking?: boolean;
    search?: string;
    district?: string;
    priorityDistrict?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ articles: Article[]; total: number }> {
    const data = ensureDataFile();
    let items = [...data.articles];

    // Filter by status
    if (options?.status) {
      items = items.filter(a => a.status === options.status);
    } else {
      // default: only published for public queries
      items = items.filter(a => a.status === 'PUBLISHED');
    }

    // Filter by district if requested specifically
    if (options?.district && options.district !== 'all') {
      items = items.filter(a => a.district?.toLowerCase() === options.district?.toLowerCase());
    }

    // Filter by category
    if (options?.categorySlug) {
      const cat = data.categories.find(c => c.slug === options.categorySlug);
      if (cat) {
        items = items.filter(a => a.categoryId === cat.id);
      }
    }

    // Filter by sourceType
    if (options?.sourceType) {
      items = items.filter(a => a.sourceType === options.sourceType);
    }

    // Filter by isBreaking
    if (typeof options?.isBreaking === 'boolean') {
      items = items.filter(a => a.isBreaking === options.isBreaking);
    }

    // Search query
    if (options?.search) {
      const q = options.search.toLowerCase();
      items = items.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.sourceName.toLowerCase().includes(q)
      );
    }

    // Sort: Featured pinned stories first, then priorityDistrict, then newest
    if (options?.priorityDistrict && options.priorityDistrict !== 'all') {
      const targetDistrict = options.priorityDistrict.toLowerCase();
      items.sort((a, b) => {
        const aFeatured = a.isFeatured ? 1 : 0;
        const bFeatured = b.isFeatured ? 1 : 0;
        if (aFeatured !== bFeatured) return bFeatured - aFeatured;

        const aMatches = a.district?.toLowerCase() === targetDistrict ? 1 : 0;
        const bMatches = b.district?.toLowerCase() === targetDistrict ? 1 : 0;
        if (aMatches !== bMatches) {
          return bMatches - aMatches; // matching location comes first
        }
        return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
      });
    } else {
      // Sort newest published first, with featured on top
      items.sort((a, b) => {
        const aFeatured = a.isFeatured ? 1 : 0;
        const bFeatured = b.isFeatured ? 1 : 0;
        if (aFeatured !== bFeatured) return bFeatured - aFeatured;

        return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
      });
    }

    const total = items.length;
    const offset = options?.offset || 0;
    const limit = options?.limit || items.length;

    const populated = items.slice(offset, offset + limit).map(art => {
      const category = data.categories.find(c => c.id === art.categoryId);
      const author = data.users.find(u => u.id === art.authorId);
      return { ...art, category, author };
    });

    return { articles: populated, total };
  },

  async getAllAdminArticles(): Promise<Article[]> {
    const data = ensureDataFile();
    const sorted = [...data.articles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sorted.map(art => {
      const category = data.categories.find(c => c.id === art.categoryId);
      const author = data.users.find(u => u.id === art.authorId);
      return { ...art, category, author };
    });
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    const data = ensureDataFile();
    const item = data.articles.find(a => a.slug === slug);
    if (!item) return null;
    const category = data.categories.find(c => c.id === item.categoryId);
    const author = data.users.find(u => u.id === item.authorId);
    return { ...item, category, author };
  },

  async getArticleById(id: string): Promise<Article | null> {
    const data = ensureDataFile();
    const item = data.articles.find(a => a.id === id);
    if (!item) return null;
    const category = data.categories.find(c => c.id === item.categoryId);
    const author = data.users.find(u => u.id === item.authorId);
    return { ...item, category, author };
  },

  async getBreakingArticles(): Promise<Article[]> {
    const data = ensureDataFile();
    return data.articles
      .filter(a => a.isBreaking && a.status === 'PUBLISHED')
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  },

  async getTrendingArticles(limit: number = 5): Promise<Article[]> {
    const data = ensureDataFile();
    return [...data.articles]
      .filter(a => a.status === 'PUBLISHED')
      .sort((a, b) => b.viewsCount - a.viewsCount)
      .slice(0, limit)
      .map(art => {
        const category = data.categories.find(c => c.id === art.categoryId);
        return { ...art, category };
      });
  },

  async createArticle(art: Omit<Article, 'id' | 'createdAt' | 'viewsCount'>): Promise<Article> {
    const data = ensureDataFile();
    const newArticle: Article = {
      ...art,
      id: `art-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      publishedAt: art.publishedAt || (art.status === 'PUBLISHED' ? new Date().toISOString() : ''),
    };

    data.articles.unshift(newArticle);
    saveDatabase(data);
    return newArticle;
  },

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
    const data = ensureDataFile();
    const idx = data.articles.findIndex(a => a.id === id);
    if (idx === -1) return null;

    data.articles[idx] = {
      ...data.articles[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    saveDatabase(data);
    return data.articles[idx];
  },

  async deleteArticle(id: string): Promise<boolean> {
    const data = ensureDataFile();
    const prevLen = data.articles.length;
    data.articles = data.articles.filter(a => a.id !== id);
    if (data.articles.length !== prevLen) {
      saveDatabase(data);
      return true;
    }
    return false;
  },

  async incrementViews(slug: string): Promise<void> {
    const data = ensureDataFile();
    const art = data.articles.find(a => a.slug === slug);
    if (art) {
      art.viewsCount = (art.viewsCount || 0) + 1;
      saveDatabase(data);
    }
  },

  // Deduplication check
  async isDuplicate(externalUrl?: string, title?: string): Promise<boolean> {
    const data = ensureDataFile();
    if (externalUrl) {
      const matchUrl = data.articles.some(a => a.externalUrl && a.externalUrl.trim().toLowerCase() === externalUrl.trim().toLowerCase());
      if (matchUrl) return true;
    }
    if (title) {
      const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
      const matchTitle = data.articles.some(a => {
        const existingClean = a.title.toLowerCase().replace(/[^a-z0-9]/g, '');
        return existingClean === cleanTitle;
      });
      if (matchTitle) return true;
    }
    return false;
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const data = ensureDataFile();
    return data.categories;
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const data = ensureDataFile();
    return data.categories.find(c => c.slug === slug) || null;
  },

  // Job Notifications Management
  async getJobs(options?: {
    regionType?: string;
    category?: string;
    search?: string;
    status?: string;
    limit?: number;
  }): Promise<JobNotification[]> {
    const data = ensureDataFile();
    let list = [...(data.jobs || [])];

    if (options?.regionType && options.regionType !== 'all') {
      list = list.filter(j => j.regionType === options.regionType);
    }

    if (options?.category && options.category !== 'all') {
      list = list.filter(j => j.category === options.category);
    }

    if (options?.status && options.status !== 'all') {
      list = list.filter(j => j.status === options.status);
    }

    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.titleHindi.toLowerCase().includes(q) ||
        j.organization.toLowerCase().includes(q) ||
        j.countryOrState.toLowerCase().includes(q) ||
        j.qualification.toLowerCase().includes(q) ||
        j.qualificationHindi.toLowerCase().includes(q)
      );
    }

    // Sort: Featured first, then newest
    list.sort((a, b) => {
      const aFeat = a.featured ? 1 : 0;
      const bFeat = b.featured ? 1 : 0;
      if (aFeat !== bFeat) return bFeat - aFeat;
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });

    if (options?.limit) {
      return list.slice(0, options.limit);
    }

    return list;
  },

  async getJobById(id: string): Promise<JobNotification | null> {
    const data = ensureDataFile();
    return (data.jobs || []).find(j => j.id === id) || null;
  },

  async createJob(jobData: Omit<JobNotification, 'id' | 'postedAt'>): Promise<JobNotification> {
    const data = ensureDataFile();
    const newJob: JobNotification = {
      ...jobData,
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      postedAt: new Date().toISOString().split('T')[0]
    };

    if (!data.jobs) data.jobs = [];
    data.jobs.unshift(newJob);
    saveDatabase(data);
    return newJob;
  },

  async updateJob(id: string, updates: Partial<JobNotification>): Promise<JobNotification | null> {
    const data = ensureDataFile();
    if (!data.jobs) data.jobs = [];
    const idx = data.jobs.findIndex(j => j.id === id);
    if (idx === -1) return null;

    data.jobs[idx] = {
      ...data.jobs[idx],
      ...updates
    };

    saveDatabase(data);
    return data.jobs[idx];
  },

  async deleteJob(id: string): Promise<boolean> {
    const data = ensureDataFile();
    if (!data.jobs) return false;
    const prevLen = data.jobs.length;
    data.jobs = data.jobs.filter(j => j.id !== id);
    if (data.jobs.length !== prevLen) {
      saveDatabase(data);
      return true;
    }
    return false;
  },

  // Stats for Admin CMS
  async getDashboardStats() {
    const data = ensureDataFile();
    const total = data.articles.length;
    const published = data.articles.filter(a => a.status === 'PUBLISHED').length;
    const drafts = data.articles.filter(a => a.status === 'DRAFT' || a.status === 'IN_REVIEW').length;
    const apiCount = data.articles.filter(a => a.sourceType === 'API').length;
    const manualCount = data.articles.filter(a => a.sourceType === 'MANUAL').length;
    const totalViews = data.articles.reduce((acc, cur) => acc + (cur.viewsCount || 0), 0);
    const breakingCount = data.articles.filter(a => a.isBreaking).length;
    const featuredCount = data.articles.filter(a => a.isFeatured).length;

    const jobs = data.jobs || [];
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === 'ACTIVE').length;
    const closingSoonJobs = jobs.filter(j => j.status === 'CLOSING_SOON').length;
    const internationalJobs = jobs.filter(j => j.regionType === 'international').length;
    const upStateJobs = jobs.filter(j => j.regionType === 'up_state').length;

    return {
      total,
      published,
      drafts,
      apiCount,
      manualCount,
      totalViews,
      categoriesCount: data.categories.length,
      breakingCount,
      featuredCount,
      totalJobs,
      activeJobs,
      closingSoonJobs,
      internationalJobs,
      upStateJobs
    };
  }
};
