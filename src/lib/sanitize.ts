/**
 * Lightweight HTML sanitizer — strips dangerous tags & attributes
 * from RSS/API-sourced article content before rendering.
 * No external dependencies required.
 */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'b', 'i', 'em', 'strong', 'u', 'h2', 'h3', 'h4',
  'ul', 'ol', 'li', 'blockquote', 'a', 'span', 'div', 'figure',
  'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
]);

const ALLOWED_ATTRS: Record<string, string[]> = {
  'a': ['href', 'title', 'rel', 'target'],
  'img': ['src', 'alt', 'width', 'height', 'loading'],
};

const DANGEROUS_PATTERNS = [
  /javascript:/gi,
  /vbscript:/gi,
  /on\w+\s*=/gi,       // onerror=, onclick=, etc.
  /<script[\s\S]*?<\/script>/gi,
  /<iframe[\s\S]*?>/gi,
  /<object[\s\S]*?>/gi,
  /<embed[\s\S]*?>/gi,
  /<form[\s\S]*?>/gi,
  /<input[\s\S]*?>/gi,
];

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';

  let clean = dirty;

  // 1. Strip outright dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    clean = clean.replace(pattern, '');
  }

  // 2. Strip tags not in the allowed list
  clean = clean.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g, (match, tagName) => {
    const tag = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      return ''; // remove entirely
    }

    // Strip disallowed attributes from allowed tags
    const allowedForTag = ALLOWED_ATTRS[tag] || [];
    if (allowedForTag.length === 0 && tag !== 'img') {
      // For structural tags with no specific attr whitelist, strip all attrs
      const isClosing = match.startsWith('</');
      return isClosing ? `</${tag}>` : `<${tag}>`;
    }

    // Keep only allowed attrs
    let rebuilt = `<${match.startsWith('</') ? '/' : ''}${tag}`;
    for (const attr of allowedForTag) {
      const attrRegex = new RegExp(`${attr}\\s*=\\s*["']([^"']*?)["']`, 'i');
      const val = match.match(attrRegex);
      if (val) {
        // Extra sanitize href to block javascript:
        if (attr === 'href' && DANGEROUS_PATTERNS[0].test(val[1])) continue;
        rebuilt += ` ${attr}="${val[1]}"`;
      }
    }
    // Auto add rel="noopener noreferrer" to external links
    if (tag === 'a') rebuilt += ' rel="noopener noreferrer" target="_blank"';
    rebuilt += '>';
    return rebuilt;
  });

  return clean;
}
