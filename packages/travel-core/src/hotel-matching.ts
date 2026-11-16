/**
 * Property matching decision rules (plan 2026-11-03 section 7).
 * Pure function of two records: no storage, no network, no AI.
 * A human reviewer, not this module, resolves REVIEW outcomes.
 */
import { haversineMeters } from './geo';
import { distinguishingTokens, jaccard, nameSimilarity, tokenize } from './text';

export interface PropertyRecord {
  readonly nameEn?: string;
  readonly nameAr?: string;
  readonly countryCode: string;
  readonly cityCode: string;
  readonly lat?: number;
  readonly lng?: number;
  readonly phoneE164?: string;
  readonly address?: string;
  readonly brand?: string;
}

/** `null` always means "unknown", never "false". */
export interface MatchEvidence {
  readonly sameCity: boolean;
  readonly nameSimilarity: number | null;
  readonly distanceMeters: number | null;
  readonly phoneEqual: boolean | null;
  readonly addressOverlap: number | null;
  readonly brandEqual: boolean | null;
  readonly distinguishingConflict: boolean;
}

export type MatchDecision = 'AUTO_ACCEPT' | 'REVIEW' | 'REJECT';

export interface MatchConfig {
  readonly autoMaxDistanceMeters: number;
  readonly autoMinNameSimilarity: number;
  readonly autoMinAddressOverlap: number;
  readonly reviewMinComposite: number;
  readonly reviewMinNameSimilarity: number;
  /** Distance at which the proximity score reaches zero. */
  readonly proximityZeroMeters: number;
}

/** Starting thresholds from the plan; to be re-tuned against measured fixtures, not treated as proven. */
export const DEFAULT_MATCH_CONFIG: MatchConfig = {
  autoMaxDistanceMeters: 150,
  autoMinNameSimilarity: 0.9,
  autoMinAddressOverlap: 0.6,
  reviewMinComposite: 0.6,
  reviewMinNameSimilarity: 0.85,
  proximityZeroMeters: 1000,
};

export interface MatchResult {
  readonly decision: MatchDecision;
  readonly composite: number;
  readonly evidence: MatchEvidence;
  readonly reasons: readonly string[];
}

function digits(phone: string): string {
  return phone.replace(/\D/g, '');
}

function bestNameSimilarity(a: PropertyRecord, b: PropertyRecord): number | null {
  const scores: number[] = [];
  if (a.nameEn && b.nameEn) scores.push(nameSimilarity(a.nameEn, b.nameEn));
  if (a.nameAr && b.nameAr) scores.push(nameSimilarity(a.nameAr, b.nameAr));
  return scores.length ? Math.max(...scores) : null;
}

function hasDistinguishingConflict(a: PropertyRecord, b: PropertyRecord): boolean {
  const pairs: Array<[string | undefined, string | undefined]> = [
    [a.nameEn, b.nameEn],
    [a.nameAr, b.nameAr],
  ];
  for (const [x, y] of pairs) {
    if (x && y && distinguishingTokens(x).join('|') !== distinguishingTokens(y).join('|')) return true;
  }
  return false;
}

export function collectEvidence(a: PropertyRecord, b: PropertyRecord): MatchEvidence {
  const hasGeo = (r: PropertyRecord): r is PropertyRecord & { lat: number; lng: number } =>
    typeof r.lat === 'number' && typeof r.lng === 'number';
  return {
    sameCity: a.countryCode === b.countryCode && a.cityCode === b.cityCode,
    nameSimilarity: bestNameSimilarity(a, b),
    distanceMeters: hasGeo(a) && hasGeo(b) ? haversineMeters(a.lat, a.lng, b.lat, b.lng) : null,
    phoneEqual: a.phoneE164 && b.phoneE164 ? digits(a.phoneE164) === digits(b.phoneE164) : null,
    addressOverlap: a.address && b.address ? jaccard(tokenize(a.address), tokenize(b.address)) : null,
    brandEqual: a.brand && b.brand ? tokenize(a.brand).join(' ') === tokenize(b.brand).join(' ') : null,
    distinguishingConflict: hasDistinguishingConflict(a, b),
  };
}

function compositeScore(e: MatchEvidence, cfg: MatchConfig): number {
  let weight = 0;
  let score = 0;
  // Name and distance always count: an unknown value contributes zero, so a
  // record with little evidence cannot reach a high composite.
  weight += 0.45;
  score += 0.45 * (e.nameSimilarity ?? 0);
  weight += 0.3;
  if (e.distanceMeters !== null) {
    const span = cfg.proximityZeroMeters - 50;
    score += 0.3 * Math.max(0, Math.min(1, 1 - (e.distanceMeters - 50) / span));
  }
  if (e.phoneEqual !== null) {
    weight += 0.15;
    score += e.phoneEqual ? 0.15 : 0;
  }
  if (e.addressOverlap !== null) {
    weight += 0.1;
    score += 0.1 * e.addressOverlap;
  }
  return score / weight;
}

export function evaluateMatch(
  a: PropertyRecord,
  b: PropertyRecord,
  cfg: MatchConfig = DEFAULT_MATCH_CONFIG,
): MatchResult {
  const evidence = collectEvidence(a, b);
  const composite = compositeScore(evidence, cfg);
  const reasons: string[] = [];

  if (!evidence.sameCity) {
    return { decision: 'REJECT', composite, evidence, reasons: ['DIFFERENT_CITY'] };
  }

  const nameOk = evidence.nameSimilarity !== null && evidence.nameSimilarity >= cfg.autoMinNameSimilarity;
  const near = evidence.distanceMeters !== null && evidence.distanceMeters <= cfg.autoMaxDistanceMeters;
  const corroborated =
    evidence.phoneEqual === true ||
    (evidence.addressOverlap !== null && evidence.addressOverlap >= cfg.autoMinAddressOverlap);

  if (evidence.distinguishingConflict) reasons.push('DISTINGUISHING_TOKEN_CONFLICT');
  if (evidence.phoneEqual === false) reasons.push('PHONE_CONFLICT');
  if (evidence.brandEqual === false) reasons.push('BRAND_CONFLICT');
  if (!nameOk) reasons.push(evidence.nameSimilarity === null ? 'NAME_UNKNOWN' : 'NAME_BELOW_AUTO_THRESHOLD');
  if (!near) reasons.push(evidence.distanceMeters === null ? 'DISTANCE_UNKNOWN' : 'DISTANCE_ABOVE_AUTO_THRESHOLD');
  if (!corroborated) reasons.push('NO_PHONE_OR_ADDRESS_CORROBORATION');

  if (reasons.length === 0) {
    return { decision: 'AUTO_ACCEPT', composite, evidence, reasons: ['ALL_AUTO_ACCEPT_CONDITIONS_MET'] };
  }

  const worthReview =
    composite >= cfg.reviewMinComposite ||
    (evidence.nameSimilarity !== null && evidence.nameSimilarity >= cfg.reviewMinNameSimilarity) ||
    evidence.phoneEqual === true;

  return { decision: worthReview ? 'REVIEW' : 'REJECT', composite, evidence, reasons };
}
