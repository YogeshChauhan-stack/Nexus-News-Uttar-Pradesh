export function normalizeTitle(title: string): string {
  return title
    .replace(/\s*-\s*[A-Za-z0-9\s]+$/, '') // strip trailing "- Reuters" or "- BBC"
    .replace(/\s*\|\s*[A-Za-z0-9\s]+$/, '') // strip trailing "| TechCrunch"
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function generateSlug(title: string): string {
  let base = title
    .toLowerCase()
    .replace(/\s*-\s*[A-Za-z0-9\s]+$/, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);

  if (!base || base.length < 3) {
    base = `samachar-${Date.now().toString(36)}`;
  }

  const hash = Math.random().toString(36).substring(2, 7);
  return `${base}-${hash}`;
}
