import { RawNewsItem } from './rssFetcher';

export async function fetchNewsAPIOrg(category: string = 'general'): Promise<RawNewsItem[]> {
  const apiKey = process.env.NEWS_API_ORG_KEY;
  if (!apiKey) {
    return [];
  }

  try {
    const url = `https://newsapi.org/v2/top-headlines?language=en&category=${category}&pageSize=15&apiKey=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`NewsAPI.org returned ${res.status}`);
      return [];
    }

    const json = await res.json();
    if (json.status !== 'ok' || !json.articles) return [];

    return json.articles.map((art: any) => ({
      title: art.title || '',
      link: art.url || '',
      summary: art.description || art.title || '',
      content: art.content ? `<p>${art.content}</p>` : `<p>${art.description || ''}</p>`,
      imageUrl: art.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&auto=format&fit=crop&q=80',
      publishedAt: art.publishedAt || new Date().toISOString(),
      sourceName: art.source?.name || 'NewsAPI Wire',
      categorySlug: category === 'general' ? 'world' : category
    }));
  } catch (err) {
    console.error('Error fetching NewsAPI.org:', err);
    return [];
  }
}

export async function fetchGNews(topic: string = 'world'): Promise<RawNewsItem[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    return [];
  }

  try {
    const url = `https://gnews.io/api/v4/top-headlines?category=${topic}&lang=en&max=10&apikey=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const json = await res.json();
    if (!json.articles) return [];

    return json.articles.map((art: any) => ({
      title: art.title || '',
      link: art.url || '',
      summary: art.description || '',
      content: `<p>${art.description || ''}</p>`,
      imageUrl: art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&auto=format&fit=crop&q=80',
      publishedAt: art.publishedAt || new Date().toISOString(),
      sourceName: art.source?.name || 'GNews Wire',
      categorySlug: topic
    }));
  } catch (err) {
    console.error('Error fetching GNews:', err);
    return [];
  }
}
