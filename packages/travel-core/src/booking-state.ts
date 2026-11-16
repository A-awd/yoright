/**
 * Booking lifecycle (plan 2026-11-03 section 5) as a pure, evidence-carrying
 * transition contract.
 *
 * A transition is decided from the whole booking record, never from a pair of
 * state names alone:
 * - MANUAL_REVIEW remembers the state it was entered from. An operator can only
 *   resume that state or take a step that was already legal from it, under the
 *   same evidence rules. Review can pause a booking; it cannot manufacture a
 *   confirmation, a payment or a refund.
 * - Money- and supplier-bearing states require evidence references. This layer
 *   checks that a reference is present and consistent; the owning service must
 *   verify it is genuine (provider webhook signature, supplier response) and
 *   must write an audit event for every applied transition.
 */
export const BOOKING_STATES = [
  'DRAFT', 'QUOTED', 'EXPIRED', 'PAYMENT_PENDING', 'PAYMENT_FAILED', 'PAYMENT_AUTHORIZED',
  'SUPPLIER_PENDING', 'SUPPLIER_FAILED', 'CONFIRMED', 'CANCELLATION_REQUESTED', 'CANCELLED',
  'REFUND_PENDING', 'REFUNDED', 'REFUND_PARTIAL', 'MANUAL_REVIEW',
] as const;

export type BookingState = (typeof BOOKING_STATES)[number];

/** Steps legal from each state without an operator hold. */
const TRANSITIONS: Readonly<Record<BookingState, readonly BookingState[]>> = {
  DRAFT: ['QUOTED'],
  QUOTED: ['PAYMENT_PENDING', 'EXPIRED'],
  EXPIRED: [],
  PAYMENT_PENDING: ['PAYMENT_AUTHORIZED', 'PAYMENT_FAILED'],
  PAYMENT_FAILED: [],
  PAYMENT_AUTHORIZED: ['SUPPLIER_PENDING'],
  SUPPLIER_PENDING: ['CONFIRMED', 'SUPPLIER_FAILED'],
  SUPPLIER_FAILED: ['REFUND_PENDING'],
  CONFIRMED: ['CANCELLATION_REQUESTED'],
  CANCELLATION_REQUESTED: ['CANCELLED', 'CONFIRMED'],
  CANCELLED: ['REFUND_PENDING'],
  REFUND_PENDING: ['REFUNDED', 'REFUND_PARTIAL'],
  REFUNDED: [],
  REFUND_PARTIAL: [],
  MANUAL_REVIEW: [], // resolved through `heldFrom`, see allowedTargets
};

/** States that cannot be put on operator hold: nothing to hold, or already final. */
const NO_HOLD: ReadonlySet<BookingState> = new Set([
  'DRAFT', 'EXPIRED', 'PAYMENT_FAILED', 'REFUNDED', 'REFUND_PARTIAL', 'MANUAL_REVIEW',
]);

export interface BookingRecord {
  readonly state: BookingState;
  /** Set exactly while `state` is MANUAL_REVIEW: the state the hold was placed on. */
  readonly heldFrom: BookingState | null;
  /** Payment provider reference proving authorization/capture. */
  readonly paymentRef: string | null;
  /** Supplier reference proving the supplier confirmed the booking. */
  readonly supplierConfirmationRef: string | null;
  /** Payment provider reference proving a refund was executed. */
  readonly refundRef: string | null;
}

/** New evidence supplied with a transition. Existing evidence can never be replaced or cleared. */
export interface TransitionEvidence {
  readonly paymentRef?: string;
  readonly supplierConfirmationRef?: string;
  readonly refundRef?: string;
}

export type TransitionCheck =
  | { readonly ok: true; readonly next: BookingRecord }
  | { readonly ok: false; readonly reason: string };

export function newBooking(): BookingRecord {
  return { state: 'DRAFT', heldFrom: null, paymentRef: null, supplierConfirmationRef: null, refundRef: null };
}

function validRef(ref: string | null | undefined): ref is string {
  return typeof ref === 'string' && ref.trim().length > 0;
}

/** Structural invariants of a record; a record that violates them accepts no transition. */
export function recordIssues(b: BookingRecord): string[] {
  const issues: string[] = [];
  if (!BOOKING_STATES.includes(b.state)) issues.push('UNKNOWN_STATE');
  if (b.state === 'MANUAL_REVIEW') {
    if (b.heldFrom === null) issues.push('HOLD_WITHOUT_ORIGIN');
    else if (NO_HOLD.has(b.heldFrom) || !BOOKING_STATES.includes(b.heldFrom)) issues.push('HOLD_ORIGIN_NOT_HOLDABLE');
  } else if (b.heldFrom !== null) {
    issues.push('ORIGIN_SET_OUTSIDE_HOLD');
  }
  const effective = b.state === 'MANUAL_REVIEW' ? b.heldFrom : b.state;
  if (effective !== null) issues.push(...evidenceIssues(effective, b));
  return issues;
}

const NEEDS_PAYMENT: ReadonlySet<BookingState> = new Set([
  'PAYMENT_AUTHORIZED', 'SUPPLIER_PENDING', 'SUPPLIER_FAILED', 'CONFIRMED', 'CANCELLATION_REQUESTED',
  'CANCELLED', 'REFUND_PENDING', 'REFUNDED', 'REFUND_PARTIAL',
]);
const NEEDS_SUPPLIER: ReadonlySet<BookingState> = new Set(['CONFIRMED', 'CANCELLATION_REQUESTED', 'CANCELLED']);
const NEEDS_REFUND: ReadonlySet<BookingState> = new Set(['REFUNDED', 'REFUND_PARTIAL']);

/** Evidence a record must hold to be in `state`. */
function evidenceIssues(state: BookingState, b: BookingRecord): string[] {
  const issues: string[] = [];
  if (NEEDS_PAYMENT.has(state) && !validRef(b.paymentRef)) issues.push('PAYMENT_EVIDENCE_REQUIRED');
  if (NEEDS_SUPPLIER.has(state) && !validRef(b.supplierConfirmationRef)) issues.push('SUPPLIER_CONFIRMATION_REQUIRED');
  if (NEEDS_REFUND.has(state) && !validRef(b.refundRef)) issues.push('REFUND_EVIDENCE_REQUIRED');
  return issues;
}

function mergeEvidence(b: BookingRecord, e: TransitionEvidence): BookingRecord | string {
  let next = b;
  for (const key of ['paymentRef', 'supplierConfirmationRef', 'refundRef'] as const) {
    const incoming = e[key];
    if (incoming === undefined) continue;
    if (!validRef(incoming)) return `EMPTY_${key.toUpperCase()}`;
    const existing = b[key];
    if (existing !== null && existing !== incoming) return `CONFLICTING_${key.toUpperCase()}`;
    next = { ...next, [key]: incoming };
  }
  return next;
}

/** Targets that are structurally reachable from this record (before evidence checks). */
function allowedTargets(b: BookingRecord): readonly BookingState[] {
  if (b.state === 'MANUAL_REVIEW') {
    // Release back to the held state, or take a step that state already allowed.
    return b.heldFrom === null ? [] : [b.heldFrom, ...TRANSITIONS[b.heldFrom]];
  }
  return NO_HOLD.has(b.state) ? TRANSITIONS[b.state] : [...TRANSITIONS[b.state], 'MANUAL_REVIEW'];
}

export function checkTransition(b: BookingRecord, to: BookingState, evidence: TransitionEvidence = {}): TransitionCheck {
  const broken = recordIssues(b);
  if (broken.length) return { ok: false, reason: `INVALID_RECORD:${broken.join(',')}` };
  if (!allowedTargets(b).includes(to)) return { ok: false, reason: `ILLEGAL_TRANSITION:${b.state}->${to}` };

  const merged = mergeEvidence(b, evidence);
  if (typeof merged === 'string') return { ok: false, reason: merged };

  const next: BookingRecord =
    to === 'MANUAL_REVIEW'
      ? { ...merged, state: 'MANUAL_REVIEW', heldFrom: b.state }
      : { ...merged, state: to, heldFrom: null };

  const missing = evidenceIssues(to === 'MANUAL_REVIEW' ? b.state : to, next);
  if (missing.length) return { ok: false, reason: missing.join(',') };
  return { ok: true, next };
}

export function canTransition(b: BookingRecord, to: BookingState, evidence: TransitionEvidence = {}): boolean {
  return checkTransition(b, to, evidence).ok;
}

/** Returns the next record or throws with the refusal reason. */
export function applyTransition(b: BookingRecord, to: BookingState, evidence: TransitionEvidence = {}): BookingRecord {
  const result = checkTransition(b, to, evidence);
  if (!result.ok) throw new Error(`Booking transition refused: ${result.reason}`);
  return result.next;
}

/** States structurally reachable in one step; evidence may still be required to take the step. */
export function nextStates(b: BookingRecord): BookingState[] {
  return recordIssues(b).length ? [] : BOOKING_STATES.filter((s) => allowedTargets(b).includes(s));
}
