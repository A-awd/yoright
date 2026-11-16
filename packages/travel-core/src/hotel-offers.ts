import type { ComparableOffer, DataMode } from './comparison';
import { currencyExponent, type FxRate, type Money } from './money';
import { roomGroupKey, type RoomSignature } from './room-matching';

export type Board = 'ROOM_ONLY' | 'BREAKFAST' | 'HALF_BOARD' | 'FULL_BOARD' | 'ALL_INCLUSIVE' | 'UNKNOWN';
export type Refundability = 'FREE' | 'PARTIAL' | 'NON_REFUNDABLE' | 'UNKNOWN';
export type PaymentTiming = 'PREPAID' | 'AT_PROPERTY' | 'DEPOSIT';

/**
 * The immutable search the offer answers. Offers for different dates, room
 * counts or guest residency are different products and are never ranked together.
 */
export interface StayContext {
  /** Local calendar date at the property, `YYYY-MM-DD`. */
  readonly checkIn: string;
  readonly checkOut: string;
  readonly roomCount: number;
  /** ISO 3166-1 alpha-2 residency the rate was priced for; suppliers price by it. */
  readonly guestResidency: string;
}

/**
 * Penalty as the supplier states it. The two forms are never treated as equal
 * to each other, and amounts in different currencies are never treated as equal.
 */
export type CancellationPenalty =
  | { readonly type: 'PERCENT_OF_TOTAL'; readonly bps: number }
  | { readonly type: 'AMOUNT'; readonly amount: Money };

/** Cancelling at or after `fromUtc` costs `penalty`, until a later rule applies. */
export interface CancellationRule {
  /** ISO-8601 instant with an explicit offset or `Z`. */
  readonly fromUtc: string;
  readonly penalty: CancellationPenalty;
}

export interface HotelOffer extends ComparableOffer {
  readonly supplierCode: string;
  /** Opaque supplier identifiers. Carried byte-for-byte from search to booking; never parsed or rewritten. */
  readonly rateKey: string;
  readonly supplierHotelId: string;
  readonly canonicalHotelId: string;
  readonly stay: StayContext;
  readonly supplierRoomLabel: string;
  readonly roomSignature: RoomSignature;
  readonly board: Board;
  readonly refundability: Refundability;
  /**
   * Full penalty schedule, or null when the supplier did not provide one.
   * FREE and PARTIAL offers without a schedule are not comparable: the label
   * alone does not establish equal cancellation conditions.
   */
  readonly cancellationPolicy: readonly CancellationRule[] | null;
  readonly paymentTiming: PaymentTiming;
  /** Per-room occupancy. */
  readonly occupancy: { readonly adults: number; readonly childrenAges: readonly number[] };
  readonly supplierTotal: Money;
  /** Paid at the property and therefore outside the customer total; always displayed beside it. */
  readonly mandatoryFeesAtProperty: readonly Money[];
  readonly fx: FxRate | null;
  readonly dataMode: DataMode;
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const INSTANT_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

function validDate(s: string): boolean {
  const m = DATE_RE.exec(s);
  if (!m) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function stayIssues(stay: StayContext | undefined): string[] {
  if (!stay) return ['STAY_CONTEXT_MISSING'];
  const issues: string[] = [];
  const inOk = validDate(stay.checkIn);
  const outOk = validDate(stay.checkOut);
  if (!inOk) issues.push('CHECK_IN_INVALID');
  if (!outOk) issues.push('CHECK_OUT_INVALID');
  if (inOk && outOk && stay.checkOut <= stay.checkIn) issues.push('CHECK_OUT_NOT_AFTER_CHECK_IN');
  if (!Number.isInteger(stay.roomCount) || stay.roomCount <= 0) issues.push('ROOM_COUNT_INVALID');
  if (!/^[A-Z]{2}$/.test(stay.guestResidency ?? '')) issues.push('GUEST_RESIDENCY_INVALID');
  return issues;
}

function penaltyKey(p: CancellationPenalty): string | null {
  if (p.type === 'PERCENT_OF_TOTAL') {
    return Number.isInteger(p.bps) && p.bps >= 0 && p.bps <= 10000 ? `pct:${p.bps}` : null;
  }
  if (p.type === 'AMOUNT') {
    try {
      currencyExponent(p.amount.currency);
    } catch {
      return null;
    }
    return Number.isSafeInteger(p.amount.amountMinor) && p.amount.amountMinor >= 0
      ? `amt:${p.amount.currency}:${p.amount.amountMinor}`
      : null;
  }
  return null;
}

/** Canonical identity of a schedule, or the reasons it has none. */
function cancellationIdentity(o: HotelOffer): { key: string } | { issues: string[] } {
  const policy = o.cancellationPolicy ?? null;
  if (policy === null || policy.length === 0) {
    // Only a non-refundable offer is fully described by its label.
    return o.refundability === 'NON_REFUNDABLE' ? { key: 'none' } : { issues: ['CANCELLATION_POLICY_MISSING'] };
  }
  const parts: Array<{ at: number; text: string }> = [];
  for (const rule of policy) {
    const at = INSTANT_RE.test(rule.fromUtc) ? Date.parse(rule.fromUtc) : NaN;
    const pen = penaltyKey(rule.penalty);
    if (Number.isNaN(at)) return { issues: ['CANCELLATION_DEADLINE_INVALID'] };
    if (pen === null) return { issues: ['CANCELLATION_PENALTY_INVALID'] };
    parts.push({ at, text: `${new Date(at).toISOString()}=${pen}` });
  }
  parts.sort((a, b) => a.at - b.at || (a.text < b.text ? -1 : a.text > b.text ? 1 : 0));
  if (parts.some((p, i) => i > 0 && p.at === (parts[i - 1] as { at: number }).at)) {
    return { issues: ['CANCELLATION_DEADLINE_DUPLICATED'] };
  }
  return { key: parts.map((p) => p.text).join(',') };
}

/** Why an offer cannot be ranked against others. Empty means it has a comparable key. */
export function hotelComparabilityIssues(o: HotelOffer): string[] {
  const issues = stayIssues(o.stay);
  if (roomGroupKey(o.roomSignature) === null) issues.push('ROOM_UNVERIFIED');
  if (o.board === 'UNKNOWN') issues.push('BOARD_UNKNOWN');
  if (o.refundability === 'UNKNOWN') issues.push('REFUNDABILITY_UNKNOWN');
  else {
    const c = cancellationIdentity(o);
    if ('issues' in c) issues.push(...c.issues);
  }
  if (!Number.isInteger(o.occupancy.adults) || o.occupancy.adults <= 0) issues.push('OCCUPANCY_INVALID');
  return issues;
}

/**
 * Like-for-like key. Returns null when any term that defines the product is
 * unknown or invalid, which keeps the offer visible but out of every price ranking.
 */
export function hotelComparableKey(o: HotelOffer): string | null {
  if (hotelComparabilityIssues(o).length) return null;
  const cancellation = cancellationIdentity(o) as { key: string };
  const fees = o.mandatoryFeesAtProperty
    .map((f) => `${f.currency}:${f.amountMinor}`)
    .sort()
    .join(',');
  return [
    `hotel=${o.canonicalHotelId}`,
    `stay=${o.stay.checkIn}/${o.stay.checkOut}x${o.stay.roomCount}@${o.stay.guestResidency}`,
    `room=[${roomGroupKey(o.roomSignature)}]`,
    `board=${o.board}`,
    `refund=${o.refundability}`,
    `cancel=[${cancellation.key}]`,
    `pay=${o.paymentTiming}`,
    `occ=${o.occupancy.adults}+[${[...o.occupancy.childrenAges].sort((a, b) => a - b).join(',')}]`,
    `fees=[${fees}]`,
  ].join('|');
}
