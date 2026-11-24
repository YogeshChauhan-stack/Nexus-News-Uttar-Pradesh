export type Role = 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'USER';
export type SourceType = 'MANUAL' | 'API';
export type ArticleStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'SCHEDULED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage?: string;
  sourceType: SourceType;
  sourceName: string;
  externalUrl?: string;
  status: ArticleStatus;
  isBreaking: boolean;
  isFeatured?: boolean; // Pinned as top lead story on homepage
  viewsCount: number;
  authorId?: string;
  author?: User;
  categoryId: string;
  category?: Category;
  district?: string; // e.g. 'lucknow', 'kanpur', 'varanasi'
  pointers?: string[]; // 2-3 bullet point takeaways (Amar Ujala style)
  tags?: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RSSFeedSource {
  id: string;
  name: string;
  url: string;
  categorySlug: string;
  defaultStatus: ArticleStatus;
}

export interface SyncResult {
  source: string;
  totalFetched: number;
  saved: number;
  skipped: number;
  errors: string[];
}
