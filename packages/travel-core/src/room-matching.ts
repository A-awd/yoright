/**
 * Conservative room equivalence (plan 2026-11-03 section 7).
 * `null` means unknown. Unknown critical attributes never match anything.
 */
import { tokenize } from './text';

export type RoomClass =
  | 'standard' | 'superior' | 'deluxe' | 'executive' | 'junior_suite' | 'suite'
  | 'family' | 'studio' | 'apartment' | 'villa';
export type BedType = 'king' | 'queen' | 'twin' | 'double' | 'single';
/** 'none' is a positive statement by the supplier that the room has no notable view. */
export type RoomView = 'sea' | 'city' | 'haram' | 'kaaba' | 'garden' | 'pool' | 'none';

export interface RoomSignature {
  readonly roomClass: RoomClass | null;
  readonly bed: BedType | null;
  readonly view: RoomView | null;
  /** Only meaningful when `view` is known and not 'none'. */
  readonly viewPartial: boolean;
  readonly maxOccupancy: number | null;
  readonly sizeSqm: number | null;
  readonly smoking: boolean | null;
}

export interface SupplierRoomInput {
  readonly name: string;
  /** Structured supplier attributes; they override anything parsed from the name. */
  readonly attributes?: Partial<RoomSignature>;
}

const CLASS_WORDS: ReadonlyArray<[RoomClass, readonly string[]]> = [
  ['suite', ['suite', 'جناح']],
  ['villa', ['villa', 'فيلا']],
  ['apartment', ['apartment', 'شقه']],
  ['studio', ['studio', 'استوديو']],
  ['family', ['family', 'عائلي', 'عائليه']],
  ['executive', ['executive', 'تنفيذي', 'تنفيذيه']],
  ['deluxe', ['deluxe', 'ديلوكس']],
  ['superior', ['superior', 'سوبيريور']],
  ['standard', ['standard', 'ستاندرد', 'قياسي', 'قياسيه']],
];

const BED_WORDS: ReadonlyArray<[BedType, readonly string[]]> = [
  ['king', ['king', 'كينج', 'كينغ']],
  ['queen', ['queen', 'كوين']],
  ['twin', ['twin', 'twins', 'توين', 'سريرين', 'سريران']],
  ['double', ['double', 'دبل', 'مزدوج', 'مزدوجه']],
  ['single', ['single', 'مفرد', 'مفرده']],
];

const VIEW_WORDS: ReadonlyArray<[RoomView, readonly string[]]> = [
  ['kaaba', ['kaaba', 'كعبه']],
  ['haram', ['haram', 'حرم']],
  ['sea', ['sea', 'ocean', 'بحر', 'بحري', 'بحريه']],
  ['city', ['city', 'مدينه']],
  ['garden', ['garden', 'حديقه']],
  ['pool', ['pool', 'مسبح']],
];

const PARTIAL_WORDS = ['partial', 'side', 'limited', 'جزئي', 'جزئيه', 'جانبي', 'جانبيه'];

function firstMatch<T>(tokens: ReadonlySet<string>, table: ReadonlyArray<[T, readonly string[]]>): T | null {
  const hits = table.filter(([, words]) => words.some((w) => tokens.has(w))).map(([v]) => v);
  // Ambiguity (e.g. "king or twin", "deluxe suite") stays unknown.
  return hits.length === 1 ? (hits[0] as T) : null;
}

export function extractRoomSignature(input: SupplierRoomInput): RoomSignature {
  const tokens = new Set(tokenize(input.name));
  const view = firstMatch(tokens, VIEW_WORDS);
  const parsed: RoomSignature = {
    roomClass: tokens.has('junior') || tokens.has('جونيور') ? 'junior_suite' : firstMatch(tokens, CLASS_WORDS),
    bed: firstMatch(tokens, BED_WORDS),
    view,
    viewPartial: view !== null && PARTIAL_WORDS.some((w) => tokens.has(w)),
    maxOccupancy: null,
    sizeSqm: null,
    smoking: null,
  };
  const merged = { ...parsed, ...stripUndefined(input.attributes ?? {}) };
  return merged.view === null || merged.view === 'none' ? { ...merged, viewPartial: false } : merged;
}

function stripUndefined<T extends object>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;
}

/** Reasons a signature cannot be grouped at all. Empty means verified. */
export function unverifiedReasons(sig: RoomSignature): string[] {
  const out: string[] = [];
  if (sig.bed === null) out.push('UNKNOWN_BED');
  if (sig.view === null) out.push('UNKNOWN_VIEW');
  if (sig.maxOccupancy === null) out.push('UNKNOWN_MAX_OCCUPANCY');
  else if (!Number.isInteger(sig.maxOccupancy) || sig.maxOccupancy <= 0) out.push('INVALID_MAX_OCCUPANCY');
  return out;
}

export interface RoomEquivalence {
  readonly equivalent: boolean;
  readonly reasons: readonly string[];
}

/**
 * Normalised identity of a room. This is the ONLY definition of equivalence:
 * `roomGroupKey` serialises it and `roomsEquivalent` compares it field by
 * field, so the pairwise answer and the grouping answer cannot disagree.
 *
 * Fail-closed rules:
 * - every field must be identical, including "unknown": a room whose class,
 *   size or smoking status is unknown never joins one where it is known;
 * - size is compared as whole square metres with no tolerance. A relative
 *   tolerance is not transitive (20~22, 22~24, but 20!~24) and therefore
 *   cannot define groups; a human reviewer may merge near-equal sizes later.
 */
interface RoomIdentity {
  readonly class: RoomClass | '?';
  readonly bed: BedType;
  readonly view: string;
  readonly occ: number;
  readonly size: number | '?';
  readonly smoking: boolean | '?';
}

function normalizedSize(sizeSqm: number | null): number | '?' {
  if (sizeSqm === null || !Number.isFinite(sizeSqm) || sizeSqm <= 0) return '?';
  return Math.round(sizeSqm);
}

function roomIdentity(sig: RoomSignature): RoomIdentity | null {
  if (sig.bed === null || sig.view === null || sig.maxOccupancy === null) return null;
  if (!Number.isInteger(sig.maxOccupancy) || sig.maxOccupancy <= 0) return null;
  return {
    class: sig.roomClass ?? '?',
    bed: sig.bed,
    view: sig.view === 'none' ? 'none' : `${sig.view}${sig.viewPartial ? ':partial' : ''}`,
    occ: sig.maxOccupancy,
    size: normalizedSize(sig.sizeSqm),
    smoking: sig.smoking ?? '?',
  };
}

const IDENTITY_FIELDS: ReadonlyArray<[keyof RoomIdentity, string]> = [
  ['class', 'CLASS'], ['bed', 'BED'], ['view', 'VIEW'], ['occ', 'MAX_OCCUPANCY'], ['size', 'SIZE'], ['smoking', 'SMOKING'],
];

export function roomsEquivalent(a: RoomSignature, b: RoomSignature): RoomEquivalence {
  const ia = roomIdentity(a);
  const ib = roomIdentity(b);
  if (ia === null || ib === null) {
    const reasons = [...new Set([...unverifiedReasons(a), ...unverifiedReasons(b)])];
    return { equivalent: false, reasons: reasons.length ? reasons : ['INVALID_MAX_OCCUPANCY'] };
  }
  const reasons: string[] = [];
  for (const [field, label] of IDENTITY_FIELDS) {
    if (ia[field] === ib[field]) continue;
    const oneUnknown = ia[field] === '?' || ib[field] === '?';
    if (field === 'view' && a.view === b.view) reasons.push('VIEW_PARTIAL_DIFFERS');
    else reasons.push(oneUnknown ? `${label}_KNOWN_ON_ONE_SIDE_ONLY` : `${label}_DIFFERS`);
  }
  return { equivalent: reasons.length === 0, reasons };
}

/**
 * Stable grouping key for verified rooms, or null when the room must stay
 * "unverified" and separate. Two signatures share a key exactly when
 * `roomsEquivalent` says they are equivalent.
 */
export function roomGroupKey(sig: RoomSignature): string | null {
  const id = roomIdentity(sig);
  if (id === null) return null;
  return IDENTITY_FIELDS.map(([field]) => `${field}=${id[field]}`).join(';');
}
