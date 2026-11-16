/** Text normalisation shared by property and room matching (Arabic + Latin). */

const ARABIC_INDIC_ZERO = 0x0660;
const EXTENDED_INDIC_ZERO = 0x06f0;

export function normalizeText(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/\p{M}/gu, '') // diacritics, hamza marks
    .replace(/ـ/g, '') // tatweel
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - ARABIC_INDIC_ZERO))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - EXTENDED_INDIC_ZERO))
    .replace(/[آأإٱ]/g, 'ا') // alef variants
    .replace(/ة/g, 'ه') // ta marbuta -> ha
    .replace(/ى/g, 'ي') // alef maqsura -> ya
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** Tokens with the Arabic definite article removed from longer words. */
export function tokenize(input: string): string[] {
  const norm = normalizeText(input);
  if (!norm) return [];
  return norm.split(' ').map((t) => (t.length > 3 && t.startsWith('ال') ? t.slice(2) : t));
}

const GENERIC_NAME_TOKENS = new Set([
  'hotel', 'hotels', 'resort', 'resorts', 'suites', 'suite', 'inn', 'the', 'and', 'by', 'a', 'an', 'of',
  'فندق', 'فنادق', 'منتجع', 'اجنحه', 'جناح', 'و',
]);

const DIRECTION_TOKENS = new Set([
  'north', 'south', 'east', 'west', 'annex', 'ii', 'iii', 'iv',
  'شمال', 'شمالي', 'جنوب', 'جنوبي', 'شرق', 'شرقي', 'غرب', 'غربي', 'ملحق',
]);

/** Name tokens without generic words such as "hotel" / "فندق". */
export function nameTokens(name: string): string[] {
  return tokenize(name).filter((t) => !GENERIC_NAME_TOKENS.has(t));
}

/** Tokens that separate otherwise similar properties: numbers, directions, annexes. */
export function distinguishingTokens(name: string): string[] {
  return [...new Set(tokenize(name).filter((t) => /^\d+$/.test(t) || DIRECTION_TOKENS.has(t)))].sort();
}

export function jaccard(a: readonly string[], b: readonly string[]): number {
  const sa = new Set(a);
  const sb = new Set(b);
  if (sa.size === 0 && sb.size === 0) return 0;
  let inter = 0;
  for (const t of sa) if (sb.has(t)) inter++;
  return inter / (sa.size + sb.size - inter);
}

function trigrams(s: string): Map<string, number> {
  const padded = `  ${s} `;
  const out = new Map<string, number>();
  for (let i = 0; i < padded.length - 2; i++) {
    const g = padded.slice(i, i + 3);
    out.set(g, (out.get(g) ?? 0) + 1);
  }
  return out;
}

/** Dice coefficient over character trigrams. */
export function trigramSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const ta = trigrams(a);
  const tb = trigrams(b);
  let inter = 0;
  let total = 0;
  for (const [g, n] of ta) {
    total += n;
    inter += Math.min(n, tb.get(g) ?? 0);
  }
  for (const n of tb.values()) total += n;
  return (2 * inter) / total;
}

/** Order-insensitive name similarity in [0,1]: mean of token Jaccard and trigram Dice. */
export function nameSimilarity(a: string, b: string): number {
  const ta = nameTokens(a);
  const tb = nameTokens(b);
  if (ta.length === 0 || tb.length === 0) return 0;
  const j = jaccard(ta, tb);
  const t = trigramSimilarity([...ta].sort().join(' '), [...tb].sort().join(' '));
  return (j + t) / 2;
}
