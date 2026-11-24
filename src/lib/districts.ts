export interface District {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  lat: number;
  lng: number;
  isPopular?: boolean;
  subLocations?: string[];
}

export const UP_DISTRICTS: District[] = [
  {
    id: 'ghazipur',
    nameHindi: 'गाजीपुर',
    nameEnglish: 'Ghazipur',
    lat: 25.5866,
    lng: 83.5770,
    isPopular: true,
    subLocations: ['मरदह', 'फेफरा', 'जमानिया', 'सैदपुर', 'कासिमाबाद', 'मुहम्मदाबाद', 'जखनिया', 'बिरनो']
  },
  { id: 'lucknow', nameHindi: 'लखनऊ', nameEnglish: 'Lucknow', lat: 26.8467, lng: 80.9462, isPopular: true },
  { id: 'varanasi', nameHindi: 'वाराणसी', nameEnglish: 'Varanasi', lat: 25.3176, lng: 82.9739, isPopular: true },
  { id: 'kanpur', nameHindi: 'कानपुर', nameEnglish: 'Kanpur', lat: 26.4499, lng: 80.3319, isPopular: true },
  { id: 'ayodhya', nameHindi: 'अयोध्या', nameEnglish: 'Ayodhya', lat: 26.7922, lng: 82.1998, isPopular: true },
  { id: 'prayagraj', nameHindi: 'प्रयागराज', nameEnglish: 'Prayagraj', lat: 25.4358, lng: 81.8463, isPopular: true },
  { id: 'gorakhpur', nameHindi: 'गोरखपुर', nameEnglish: 'Gorakhpur', lat: 26.7606, lng: 83.3732, isPopular: true },
  { id: 'mau', nameHindi: 'मऊ', nameEnglish: 'Mau', lat: 25.9417, lng: 83.5611, isPopular: true },
  { id: 'ballia', nameHindi: 'बलिया', nameEnglish: 'Ballia', lat: 25.7584, lng: 84.1489, isPopular: true },
  { id: 'azamgarh', nameHindi: 'आजमगढ़', nameEnglish: 'Azamgarh', lat: 26.0738, lng: 83.1859, isPopular: true },
  { id: 'jaunpur', nameHindi: 'जौनपुर', nameEnglish: 'Jaunpur', lat: 25.7464, lng: 82.6837, isPopular: true },
  { id: 'agra', nameHindi: 'आगरा', nameEnglish: 'Agra', lat: 27.1767, lng: 78.0081, isPopular: true },
  { id: 'meerut', nameHindi: 'मेरठ', nameEnglish: 'Meerut', lat: 28.9845, lng: 77.7064, isPopular: true },
  { id: 'noida', nameHindi: 'नोएडा', nameEnglish: 'Noida', lat: 28.5355, lng: 77.3910, isPopular: true },
  { id: 'bareilly', nameHindi: 'बरेली', nameEnglish: 'Bareilly', lat: 28.3670, lng: 79.4304, isPopular: true },
  { id: 'jhansi', nameHindi: 'झांसी', nameEnglish: 'Jhansi', lat: 25.4484, lng: 78.5685, isPopular: true },
  { id: 'aligarh', nameHindi: 'अलीगढ़', nameEnglish: 'Aligarh', lat: 27.8974, lng: 78.0880, isPopular: false },
  { id: 'mathura', nameHindi: 'मथुरा', nameEnglish: 'Mathura', lat: 27.4924, lng: 77.6737, isPopular: false },
  { id: 'moradabad', nameHindi: 'मुरादाबाद', nameEnglish: 'Moradabad', lat: 28.8389, lng: 78.7768, isPopular: false },
  { id: 'saharanpur', nameHindi: 'सहारनपुर', nameEnglish: 'Saharanpur', lat: 29.9671, lng: 77.5510, isPopular: false },
  { id: 'ghaziabad', nameHindi: 'गाजियाबाद', nameEnglish: 'Ghaziabad', lat: 28.6692, lng: 77.4538, isPopular: false },
  { id: 'muzaffarnagar', nameHindi: 'मुजफ्फरनगर', nameEnglish: 'Muzaffarnagar', lat: 29.4727, lng: 77.7085, isPopular: false },
  { id: 'basti', nameHindi: 'बस्ती', nameEnglish: 'Basti', lat: 26.7995, lng: 82.7486, isPopular: false },
];

/**
 * Calculate distance between two lat/lng points using Haversine formula
 */
function getDistanceFromLatLng(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Automatically determine the closest UP district from coordinates
 */
export function getNearestUPDistrict(lat: number, lng: number): District {
  let closest = UP_DISTRICTS[0];
  let minDistance = Infinity;

  for (const d of UP_DISTRICTS) {
    const dist = getDistanceFromLatLng(lat, lng, d.lat, d.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = d;
    }
  }

  return closest;
}

/**
 * Keyword match text against UP districts and tehsils/villages
 */
export function detectDistrictFromText(text: string): District | null {
  if (!text) return null;
  const lower = text.toLowerCase();

  // Special match for Ghazipur and local blocks: Mardah, Fefra, जमानिया, etc.
  if (
    lower.includes('गाजीपुर') ||
    lower.includes('ghazipur') ||
    lower.includes('मरदह') ||
    lower.includes('mardah') ||
    lower.includes('फेफरा') ||
    lower.includes('fefra') ||
    lower.includes('phephra') ||
    lower.includes('सैदपुर') ||
    lower.includes('जमानिया') ||
    lower.includes('कासिमाबाद')
  ) {
    return UP_DISTRICTS.find(d => d.id === 'ghazipur') || null;
  }

  for (const d of UP_DISTRICTS) {
    if (
      lower.includes(d.nameHindi.toLowerCase()) ||
      lower.includes(d.nameEnglish.toLowerCase())
    ) {
      return d;
    }
  }

  // Common aliases
  if (lower.includes('काशी') || lower.includes('kashi')) {
    return UP_DISTRICTS.find(d => d.id === 'varanasi') || null;
  }
  if (lower.includes('इलाहाबाद') || lower.includes('allahabad')) {
    return UP_DISTRICTS.find(d => d.id === 'prayagraj') || null;
  }
  if (lower.includes('फैजाबाद') || lower.includes('faizabad')) {
    return UP_DISTRICTS.find(d => d.id === 'ayodhya') || null;
  }
  if (lower.includes('ग्रेटर नोएडा') || lower.includes('greater noida')) {
    return UP_DISTRICTS.find(d => d.id === 'noida') || null;
  }

  return null;
}

/**
 * Ensure headline has Amar Ujala style city tag prefix
 */
export function formatAmarUjalaHeadline(title: string, district?: District | null): { prefix: string; mainTitle: string } {
  // If title already has colon prefix like "लखनऊ: ..." or "गाजीपुर: ..."
  const colonIndex = title.indexOf(':');
  if (colonIndex > 0 && colonIndex <= 20) {
    return {
      prefix: title.slice(0, colonIndex).trim() + ':',
      mainTitle: title.slice(colonIndex + 1).trim()
    };
  }

  if (district) {
    return {
      prefix: `${district.nameHindi}:`,
      mainTitle: title
    };
  }

  return {
    prefix: 'यूपी:',
    mainTitle: title
  };
}
