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
  return out;
}

export interface RoomEquivalence {
  readonly equivalent: boolean;
  readonly reasons: readonly string[];
}

export function roomsEquivalent(a: RoomSignature, b: RoomSignature): RoomEquivalence {
  const reasons = [...new Set([...unverifiedReasons(a), ...unverifiedReasons(b)])];
  if (reasons.length) return { equivalent: false, reasons };

  if (a.bed !== b.bed) reasons.push('BED_DIFFERS');
  if (a.view !== b.view) reasons.push('VIEW_DIFFERS');
  else if (a.viewPartial !== b.viewPartial) reasons.push('VIEW_PARTIAL_DIFFERS');
  if (a.maxOccupancy !== b.maxOccupancy) reasons.push('MAX_OCCUPANCY_DIFFERS');
  if (a.roomClass !== null && b.roomClass !== null && a.roomClass !== b.roomClass) reasons.push('CLASS_DIFFERS');
  if (a.smoking !== null && b.smoking !== null && a.smoking !== b.smoking) reasons.push('SMOKING_DIFFERS');
  if (a.sizeSqm !== null && b.sizeSqm !== null) {
    const big = Math.max(a.sizeSqm, b.sizeSqm);
    if (big > 0 && Math.abs(a.sizeSqm - b.sizeSqm) / big > 0.1) reasons.push('SIZE_DIFFERS');
  }
  return { equivalent: reasons.length === 0, reasons };
}

/**
 * Stable grouping key for verified rooms, or null when the room must stay
 * "unverified" and separate. Class is part of the key, so an unknown class
 * groups only with other unknown-class rooms of identical critical attributes.
 */
export function roomGroupKey(sig: RoomSignature): string | null {
  if (unverifiedReasons(sig).length) return null;
  return [
    `class=${sig.roomClass ?? '?'}`,
    `bed=${sig.bed}`,
    `view=${sig.view}${sig.viewPartial ? ':partial' : ''}`,
    `occ=${sig.maxOccupancy}`,
    `smoking=${sig.smoking ?? '?'}`,
  ].join(';');
}
