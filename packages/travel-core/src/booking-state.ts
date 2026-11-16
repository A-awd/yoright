/**
 * Booking lifecycle (plan 2026-11-03 section 5). Pure transition table; the
 * service that owns persistence must write an audit event for every transition.
 * The MANUAL_REVIEW release targets are provisional pending operations design.
 */
export const BOOKING_STATES = [
  'DRAFT', 'QUOTED', 'EXPIRED', 'PAYMENT_PENDING', 'PAYMENT_FAILED', 'PAYMENT_AUTHORIZED',
  'SUPPLIER_PENDING', 'SUPPLIER_FAILED', 'CONFIRMED', 'CANCELLATION_REQUESTED', 'CANCELLED',
  'REFUND_PENDING', 'REFUNDED', 'REFUND_PARTIAL', 'MANUAL_REVIEW',
] as const;

export type BookingState = (typeof BOOKING_STATES)[number];

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
  MANUAL_REVIEW: ['SUPPLIER_PENDING', 'CONFIRMED', 'SUPPLIER_FAILED', 'CANCELLED', 'REFUND_PENDING'],
};

/** States with no way out except an operator hold on money-bearing ones. */
const NO_HOLD: ReadonlySet<BookingState> = new Set(['DRAFT', 'EXPIRED', 'PAYMENT_FAILED', 'REFUNDED', 'REFUND_PARTIAL', 'MANUAL_REVIEW']);

export function canTransition(from: BookingState, to: BookingState): boolean {
  if (to === 'MANUAL_REVIEW') return !NO_HOLD.has(from);
  return TRANSITIONS[from].includes(to);
}

export function assertTransition(from: BookingState, to: BookingState): void {
  if (!canTransition(from, to)) throw new Error(`Illegal booking transition: ${from} -> ${to}`);
}

export function nextStates(from: BookingState): BookingState[] {
  return BOOKING_STATES.filter((to) => canTransition(from, to));
}
