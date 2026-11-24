# Nexus News — Hybrid News Website & Editorial CMS Platform

A full-stack, production-ready news publishing platform built with **Next.js (App Router)**, **Tailwind CSS**, **Prisma ORM**, and an automated **RSS & News API background ingest worker**.

---

## ⚡ Architectural Highlights

### 1. Hybrid Content Engine
* **Manual CMS Publishing (`/admin`)**: Dedicated editorial console for reporters and editors to draft articles, set publication workflows (`DRAFT`, `IN_REVIEW`, `PUBLISHED`), and toggle global breaking news banners.
* **Automated News Ingest Pipeline (`/api/sync` & `/admin/sync`)**:
  * Ingests real-time feeds from top sources (BBC World News, TechCrunch, Wired Science, CNBC Markets, etc.).
  * NewsAPI.org & GNews client ready (configured via `.env`).
  * **Collision Deduplication**: Normalizes titles and checks source URLs to eliminate duplicate headlines across wires.
  * **Copyright & Fair-Use Compliance**: Stores canonical source attribution and displays prominent *"Read full story at [Source]"* outbound links on the reader page.
  * **Moderation Modes**: Directly publish trusted wires or hold incoming feeds in a `DRAFT` queue for editorial review.

### 2. Frontend & News SEO
* **Server-Side Rendering (SSR)**: Instant page loads and Google News crawler indexing.
* **Structured Data**: Injects official `NewsArticle` JSON-LD schema into article pages for Google "Top Stories" carousel eligibility.
* **Dynamic Sitemaps**:
  * Standard XML sitemap (`/sitemap.xml`)
  * Specialized Google News sitemap (`/news-sitemap.xml`) serving stories published within the last 48 hours.
* **Editorial Layouts**: Breaking ticker bar, lead hero story, thematic category grids, and `#1-5` trending news sidebar with view counters.

### 3. Database & Deployment
* **Prisma Schema (`prisma/schema.prisma`)**: Configured for PostgreSQL in production (Users, Articles, Categories, Tags).
* **Local Zero-Setup Persistence**: Includes a built-in file/JSON database provider with seed articles, letting you run and test locally on any device without setting up a PostgreSQL server.

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies
```bash
cd /data/user/0/ai.antigem/files/home/.gemini/antigravity-cli/scratch/news-platform
pnpm install
```

### Step 2: Start Development Server
```bash
pnpm dev
```
Open your browser at `http://localhost:3000`.

---

## 🧭 Key Routes

| Route | Purpose |
|---|---|
| `/` | Front page with Breaking Ticker, Hero Story, Category Blocks, and Trending Sidebar |
| `/article/[slug]` | Full article view with JSON-LD schema, read time, and wire attribution links |
| `/category/[slug]` | Category archives (World, Technology, Business, Science, Politics, Culture) |
| `/search?q=...` | Headline and investigation archive search |
| `/admin` | Editorial Newsroom Console & KPI Dashboard |
| `/admin/new` | Article Publisher (Standfirst, Rich Body, Category, Breaking Switch, Tags) |
| `/admin/sync` | Ingest Engine Manager (Trigger sync, view feed reports, toggle moderation) |
| `/sitemap.xml` | Search Engine Sitemap |
| `/news-sitemap.xml` | Google News Specialized 48-Hour Sitemap |

---

## 🔑 Environment Configuration (`.env`)

```env
DATABASE_URL="file:./dev.db" # Or postgresql://user:pass@host:5432/nexus_news

# Optional News API keys (Leave blank to use public RSS feeds automatically)
NEWS_API_ORG_KEY=""
GNEWS_API_KEY=""

NEXT_PUBLIC_SITE_NAME="Nexus News"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```
