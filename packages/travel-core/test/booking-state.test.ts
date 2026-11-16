import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BOOKING_STATES, assertTransition, canTransition, nextStates, type BookingState } from '../src/index';

const happyPath: BookingState[] = [
  'DRAFT', 'QUOTED', 'PAYMENT_PENDING', 'PAYMENT_AUTHORIZED', 'SUPPLIER_PENDING', 'CONFIRMED',
  'CANCELLATION_REQUESTED', 'CANCELLED', 'REFUND_PENDING', 'REFUND_PARTIAL',
];

test('the documented lifecycle is legal step by step', () => {
  for (let i = 0; i < happyPath.length - 1; i++) {
    assertTransition(happyPath[i] as BookingState, happyPath[i + 1] as BookingState);
  }
  assert.ok(canTransition('SUPPLIER_PENDING', 'SUPPLIER_FAILED'));
  assert.ok(canTransition('SUPPLIER_FAILED', 'REFUND_PENDING'));
  assert.ok(canTransition('QUOTED', 'EXPIRED'));
});

test('shortcuts that skip payment, supplier confirmation or quoting are illegal', () => {
  assert.throws(() => assertTransition('DRAFT', 'CONFIRMED'), /Illegal booking transition/);
  assert.equal(canTransition('QUOTED', 'CONFIRMED'), false);
  assert.equal(canTransition('PAYMENT_PENDING', 'CONFIRMED'), false);
  assert.equal(canTransition('EXPIRED', 'PAYMENT_PENDING'), false);
  assert.equal(canTransition('CONFIRMED', 'REFUNDED'), false);
  assert.equal(canTransition('PAYMENT_FAILED', 'SUPPLIER_PENDING'), false);
});

test('terminal states have no exits and operator hold is limited to live bookings', () => {
  for (const s of ['EXPIRED', 'PAYMENT_FAILED', 'REFUNDED', 'REFUND_PARTIAL'] as BookingState[]) {
    assert.deepEqual(nextStates(s), []);
  }
  assert.ok(canTransition('SUPPLIER_PENDING', 'MANUAL_REVIEW'));
  assert.equal(canTransition('MANUAL_REVIEW', 'MANUAL_REVIEW'), false);
  assert.equal(canTransition('MANUAL_REVIEW', 'DRAFT'), false);
});

test('every state is reachable from DRAFT', () => {
  const seen = new Set<BookingState>(['DRAFT']);
  const queue: BookingState[] = ['DRAFT'];
  while (queue.length) for (const n of nextStates(queue.pop() as BookingState)) if (!seen.has(n)) { seen.add(n); queue.push(n); }
  assert.equal(seen.size, BOOKING_STATES.length);
});
