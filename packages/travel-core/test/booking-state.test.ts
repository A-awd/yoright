import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BOOKING_STATES, applyTransition, canTransition, checkTransition, newBooking, nextStates, recordIssues,
  type BookingRecord, type BookingState, type TransitionEvidence,
} from '../src/index';

type Step = [BookingState, TransitionEvidence?];

function walk(steps: readonly Step[], from: BookingRecord = newBooking()): BookingRecord {
  return steps.reduce((b, [to, ev]) => applyTransition(b, to, ev), from);
}

function reason(b: BookingRecord, to: BookingState, ev?: TransitionEvidence): string {
  const r = checkTransition(b, to, ev);
  return r.ok ? 'OK' : r.reason;
}

const PAY = { paymentRef: 'synthetic-pay-1' };
const SUP = { supplierConfirmationRef: 'synthetic-sup-1' };
const REF = { refundRef: 'synthetic-refund-1' };

const toQuoted: Step[] = [['QUOTED']];
const toSupplierPending: Step[] = [...toQuoted, ['PAYMENT_PENDING'], ['PAYMENT_AUTHORIZED', PAY], ['SUPPLIER_PENDING']];
const toConfirmed: Step[] = [...toSupplierPending, ['CONFIRMED', SUP]];

test('normal path: quote, pay, confirm, cancel, partial refund', () => {
  const end = walk([...toConfirmed, ['CANCELLATION_REQUESTED'], ['CANCELLED'], ['REFUND_PENDING'], ['REFUND_PARTIAL', REF]]);
  assert.deepEqual(end, {
    state: 'REFUND_PARTIAL', heldFrom: null,
    paymentRef: 'synthetic-pay-1', supplierConfirmationRef: 'synthetic-sup-1', refundRef: 'synthetic-refund-1',
  });
  assert.deepEqual(nextStates(end), []);
});

test('normal path: supplier failure after payment leads to a full refund', () => {
  const end = walk([...toSupplierPending, ['SUPPLIER_FAILED'], ['REFUND_PENDING'], ['REFUNDED', REF]]);
  assert.equal(end.state, 'REFUNDED');
  assert.equal(end.supplierConfirmationRef, null);
});

test('normal path: withdrawn cancellation returns to CONFIRMED, quote can expire', () => {
  assert.equal(walk([...toConfirmed, ['CANCELLATION_REQUESTED'], ['CONFIRMED']]).state, 'CONFIRMED');
  assert.equal(walk([...toQuoted, ['EXPIRED']]).state, 'EXPIRED');
});

test('YR-02: QUOTED -> MANUAL_REVIEW -> CONFIRMED is refused, with or without claimed evidence', () => {
  const held = walk([...toQuoted, ['MANUAL_REVIEW']]);
  assert.deepEqual([held.state, held.heldFrom], ['MANUAL_REVIEW', 'QUOTED']);
  assert.equal(reason(held, 'CONFIRMED'), 'ILLEGAL_TRANSITION:MANUAL_REVIEW->CONFIRMED');
  assert.equal(reason(held, 'CONFIRMED', { ...PAY, ...SUP }), 'ILLEGAL_TRANSITION:MANUAL_REVIEW->CONFIRMED');
  assert.throws(() => applyTransition(held, 'CONFIRMED', { ...PAY, ...SUP }), /refused/);
  // The hold only offers what QUOTED itself offered.
  assert.deepEqual(nextStates(held).sort(), ['EXPIRED', 'PAYMENT_PENDING', 'QUOTED']);
});

test('YR-02: no hold placed at any state opens a path that state did not already have', () => {
  const routes: Step[][] = [
    toQuoted,
    [...toQuoted, ['PAYMENT_PENDING']],
    [...toQuoted, ['PAYMENT_PENDING'], ['PAYMENT_AUTHORIZED', PAY]],
    toSupplierPending,
    [...toSupplierPending, ['SUPPLIER_FAILED']],
    toConfirmed,
    [...toConfirmed, ['CANCELLATION_REQUESTED']],
    [...toConfirmed, ['CANCELLATION_REQUESTED'], ['CANCELLED']],
    [...toConfirmed, ['CANCELLATION_REQUESTED'], ['CANCELLED'], ['REFUND_PENDING']],
  ];
  const everything = { ...PAY, ...SUP, ...REF };
  for (const route of routes) {
    const before = walk(route);
    const held = applyTransition(before, 'MANUAL_REVIEW');
    for (const to of BOOKING_STATES) {
      if (to === before.state || to === 'MANUAL_REVIEW') continue;
      assert.equal(
        canTransition(held, to, everything), canTransition(before, to, everything),
        `hold at ${before.state} changed access to ${to}`,
      );
    }
    assert.deepEqual(applyTransition(held, before.state), before); // release restores the record exactly
    assert.equal(canTransition(held, 'MANUAL_REVIEW'), false); // no nested holds
  }
});

test('YR-02: exhaustive search finds no confirmed booking without payment and supplier evidence', () => {
  // Explore every record reachable from DRAFT when the caller supplies evidence
  // only where a legitimate provider or supplier would (never for CONFIRMED via a hold from QUOTED etc.).
  const evidenceChoices: TransitionEvidence[] = [{}, PAY, SUP, REF, { ...PAY, ...SUP }, { ...PAY, ...SUP, ...REF }];
  const seen = new Map<string, BookingRecord>();
  const queue: BookingRecord[] = [newBooking()];
  while (queue.length) {
    const b = queue.pop() as BookingRecord;
    const id = JSON.stringify(b);
    if (seen.has(id)) continue;
    seen.set(id, b);
    for (const to of BOOKING_STATES) for (const ev of evidenceChoices) {
      const r = checkTransition(b, to, ev);
      if (r.ok) queue.push(r.next);
    }
  }
  const reached = new Set<BookingState>();
  for (const b of seen.values()) {
    reached.add(b.state);
    assert.deepEqual(recordIssues(b), []);
    const effective = b.state === 'MANUAL_REVIEW' ? b.heldFrom : b.state;
    if (effective === 'CONFIRMED' || effective === 'CANCELLATION_REQUESTED' || effective === 'CANCELLED') {
      assert.ok(b.paymentRef && b.supplierConfirmationRef, JSON.stringify(b));
    }
    if (effective === 'SUPPLIER_PENDING' || effective === 'PAYMENT_AUTHORIZED') assert.ok(b.paymentRef);
    if (effective === 'REFUNDED' || effective === 'REFUND_PARTIAL') assert.ok(b.paymentRef && b.refundRef);
  }
  assert.equal(reached.size, BOOKING_STATES.length); // every state is still reachable legitimately
});

test('evidence is required at the step that claims it', () => {
  const pending = walk([...toQuoted, ['PAYMENT_PENDING']]);
  assert.equal(reason(pending, 'PAYMENT_AUTHORIZED'), 'PAYMENT_EVIDENCE_REQUIRED');
  assert.equal(reason(pending, 'PAYMENT_AUTHORIZED', { paymentRef: '  ' }), 'EMPTY_PAYMENTREF');
  const supplierPending = walk(toSupplierPending);
  assert.equal(reason(supplierPending, 'CONFIRMED'), 'SUPPLIER_CONFIRMATION_REQUIRED');
  const refundPending = walk([...toSupplierPending, ['SUPPLIER_FAILED'], ['REFUND_PENDING']]);
  assert.equal(reason(refundPending, 'REFUNDED'), 'REFUND_EVIDENCE_REQUIRED');
  // A hold does not waive it either.
  const held = applyTransition(supplierPending, 'MANUAL_REVIEW');
  assert.equal(reason(held, 'CONFIRMED'), 'SUPPLIER_CONFIRMATION_REQUIRED');
  assert.equal(applyTransition(held, 'CONFIRMED', SUP).state, 'CONFIRMED');
});

test('evidence cannot be replaced, and hand-built records are rejected', () => {
  const confirmed = walk(toConfirmed);
  assert.equal(reason(confirmed, 'CANCELLATION_REQUESTED', { paymentRef: 'other' }), 'CONFLICTING_PAYMENTREF');
  assert.equal(reason(confirmed, 'CANCELLATION_REQUESTED', PAY), 'OK'); // same reference is idempotent

  const forgedConfirmed: BookingRecord = { ...newBooking(), state: 'CONFIRMED' };
  assert.match(reason(forgedConfirmed, 'CANCELLATION_REQUESTED'), /^INVALID_RECORD:.*PAYMENT_EVIDENCE_REQUIRED/);
  const forgedHold: BookingRecord = { ...newBooking(), state: 'MANUAL_REVIEW', heldFrom: 'CONFIRMED' };
  assert.match(reason(forgedHold, 'CONFIRMED'), /^INVALID_RECORD/);
  const holdWithoutOrigin: BookingRecord = { ...newBooking(), state: 'MANUAL_REVIEW' };
  assert.match(reason(holdWithoutOrigin, 'CONFIRMED', { ...PAY, ...SUP }), /HOLD_WITHOUT_ORIGIN/);
  assert.deepEqual(nextStates(holdWithoutOrigin), []);
});

test('direct shortcuts stay illegal and terminal states have no exits', () => {
  assert.throws(() => applyTransition(newBooking(), 'CONFIRMED', { ...PAY, ...SUP }), /ILLEGAL_TRANSITION/);
  assert.equal(canTransition(walk(toQuoted), 'CONFIRMED', { ...PAY, ...SUP }), false);
  assert.equal(canTransition(walk(toConfirmed), 'REFUNDED', REF), false);
  assert.equal(canTransition(newBooking(), 'MANUAL_REVIEW'), false);
  for (const end of [
    walk([...toQuoted, ['EXPIRED']]),
    walk([...toQuoted, ['PAYMENT_PENDING'], ['PAYMENT_FAILED']]),
    walk([...toSupplierPending, ['SUPPLIER_FAILED'], ['REFUND_PENDING'], ['REFUNDED', REF]]),
  ]) assert.deepEqual(nextStates(end), []);
});
