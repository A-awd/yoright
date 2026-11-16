import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildComparableSets, combineDataModes, extractRoomSignature, hotelComparableKey, money, priceInSar,
  roomGroupKey, roomsEquivalent, ticketComparableKey, type EventTicketOffer,
} from '../src/index';
import { SYNTHETIC_FX, kingCity, offer } from './fixtures';

test('room signature is parsed from English and Arabic names', () => {
  const en = extractRoomSignature({ name: 'Deluxe King Room, Partial Sea View' });
  assert.deepEqual([en.roomClass, en.bed, en.view, en.viewPartial], ['deluxe', 'king', 'sea', true]);
  const ar = extractRoomSignature({ name: 'غرفة ديلوكس كينج بإطلالة على الحرم' });
  assert.deepEqual([ar.roomClass, ar.bed, ar.view, ar.viewPartial], ['deluxe', 'king', 'haram', false]);
  assert.equal(extractRoomSignature({ name: 'Junior Suite' }).roomClass, 'junior_suite');
  assert.equal(extractRoomSignature({ name: 'King or Twin Room' }).bed, null);
});

test('acceptance 4: unknown bed type never joins a group', () => {
  const a = extractRoomSignature({ name: 'Standard Room City View', attributes: { maxOccupancy: 2 } });
  const b = extractRoomSignature({ name: 'Standard Room City View', attributes: { maxOccupancy: 2 } });
  assert.equal(a.bed, null);
  assert.equal(roomGroupKey(a), null);
  const eq = roomsEquivalent(a, b);
  assert.equal(eq.equivalent, false);
  assert.ok(eq.reasons.includes('UNKNOWN_BED'));
});

test('a name with no view statement is unknown, not "no view"', () => {
  const sig = extractRoomSignature({ name: 'Deluxe King Room', attributes: { maxOccupancy: 2 } });
  assert.equal(sig.view, null);
  assert.equal(roomsEquivalent(sig, kingCity).equivalent, false);
  const explicit = extractRoomSignature({ name: 'Deluxe King Room', attributes: { maxOccupancy: 2, view: 'none' } });
  assert.equal(roomsEquivalent(explicit, explicit).equivalent, true);
});

test('acceptance 5: king vs queen and full vs partial view are distinct rooms', () => {
  assert.ok(roomsEquivalent(kingCity, { ...kingCity }).equivalent);
  assert.ok(roomsEquivalent(kingCity, { ...kingCity, bed: 'queen' }).reasons.includes('BED_DIFFERS'));
  assert.ok(roomsEquivalent(kingCity, { ...kingCity, viewPartial: true }).reasons.includes('VIEW_PARTIAL_DIFFERS'));
  assert.notEqual(roomGroupKey(kingCity), roomGroupKey({ ...kingCity, viewPartial: true }));
  assert.notEqual(roomGroupKey(kingCity), roomGroupKey({ ...kingCity, bed: 'queen' }));
});

test('acceptance 6: board, refundability, payment timing and fees split comparable sets', () => {
  const offers = [
    offer({ offerId: 'a', customerTotalSar: money(65000, 'SAR') }),
    offer({ offerId: 'b', supplierCode: 'SYN-B', customerTotalSar: money(61000, 'SAR') }),
    offer({ offerId: 'c', board: 'ROOM_ONLY', customerTotalSar: money(54000, 'SAR') }),
    offer({ offerId: 'd', refundability: 'NON_REFUNDABLE', customerTotalSar: money(50000, 'SAR') }),
    offer({ offerId: 'e', paymentTiming: 'AT_PROPERTY', customerTotalSar: money(60000, 'SAR') }),
    offer({ offerId: 'f', mandatoryFeesAtProperty: [money(5000, 'SAR')], customerTotalSar: money(58000, 'SAR') }),
  ];
  const { sets, notComparable } = buildComparableSets(offers, hotelComparableKey);
  assert.equal(notComparable.length, 0);
  assert.equal(sets.length, 5);
  const main = sets.find((s) => s.offers.length === 2);
  assert.ok(main);
  // B at 610 wins its like-for-like set; cheaper room-only C is a different product.
  assert.equal(main.cheapest.offerId, 'b');
  assert.deepEqual(main.offers.map((o) => o.offerId), ['b', 'a']);
});

test('unverified rooms and unknown terms are shown but never ranked', () => {
  const offers = [
    offer({ offerId: 'ok' }),
    offer({ offerId: 'unknown-bed', roomSignature: { ...kingCity, bed: null }, customerTotalSar: money(100, 'SAR') }),
    offer({ offerId: 'unknown-board', board: 'UNKNOWN', customerTotalSar: money(100, 'SAR') }),
  ];
  const { sets, notComparable } = buildComparableSets(offers, hotelComparableKey);
  assert.equal(sets.length, 1);
  assert.equal(sets[0]?.cheapest.offerId, 'ok');
  assert.deepEqual(notComparable.map((o) => o.offerId), ['unknown-bed', 'unknown-board']);
});

test('acceptance 7: foreign-currency offer needs a stored FX rate to be comparable', () => {
  const usd = money(16000, 'USD');
  const priced = priceInSar(usd, [SYNTHETIC_FX], 1000);
  assert.equal(priced.netSar?.amountMinor, 60000);
  assert.equal(priced.customerTotalSar?.amountMinor, 66000);
  assert.equal(priced.fx, SYNTHETIC_FX);

  const missing = priceInSar(usd, [], 1000);
  assert.equal(missing.customerTotalSar, null);
  const { sets, notComparable } = buildComparableSets(
    [offer({ offerId: 'usd', supplierTotal: usd, customerTotalSar: missing.customerTotalSar })],
    hotelComparableKey,
  );
  assert.equal(sets.length, 0);
  assert.equal(notComparable.length, 1);

  const sar = priceInSar(money(60000, 'SAR'), [], 0);
  assert.equal(sar.fx, null);
  assert.equal(sar.customerTotalSar?.amountMinor, 60000);
});

test('acceptance 8: supplier rate keys pass through comparison untouched', () => {
  const key = 'A|rk/0001==?x=1&y=٢ ';
  const { sets } = buildComparableSets([offer({ offerId: 'k', rateKey: key })], hotelComparableKey);
  assert.equal(sets[0]?.cheapest.rateKey, key);
});

test('acceptance 10: any synthetic part makes the whole response synthetic', () => {
  assert.equal(combineDataModes(['live', 'synthetic']), 'synthetic');
  assert.equal(combineDataModes([]), 'synthetic');
  assert.equal(combineDataModes(['live', 'live']), 'live');
});

test('future scope: ticket offers compare only within verified like-for-like terms', () => {
  const t = (over: Partial<EventTicketOffer> & { offerId: string }): EventTicketOffer => ({
    supplierCode: 'SYN-T', supplierListingKey: `l:${over.offerId}`, canonicalEventId: 'ev_synthetic_1',
    verifiedCategory: 'CAT2', quantity: 2, seatedTogether: true, delivery: 'MOBILE_TRANSFER',
    sourceClass: 'OFFICIAL_PRIMARY', refundability: 'NON_REFUNDABLE', restrictions: [],
    supplierTotal: money(90000, 'SAR'), customerTotalSar: money(90000, 'SAR'), dataMode: 'synthetic', ...over,
  });
  const { sets, notComparable } = buildComparableSets(
    [
      t({ offerId: 'official' }),
      t({ offerId: 'official-2', customerTotalSar: money(88000, 'SAR') }),
      t({ offerId: 'secondary', sourceClass: 'SECONDARY_MARKET', customerTotalSar: money(70000, 'SAR') }),
      t({ offerId: 'away', restrictions: ['AWAY_SECTION'], customerTotalSar: money(60000, 'SAR') }),
      t({ offerId: 'unverified-cat', verifiedCategory: null, customerTotalSar: money(10000, 'SAR') }),
      t({ offerId: 'split-unknown', seatedTogether: null, customerTotalSar: money(10000, 'SAR') }),
    ],
    ticketComparableKey,
  );
  assert.equal(sets.length, 3);
  assert.equal(sets.find((s) => s.offers.length === 2)?.cheapest.offerId, 'official-2');
  assert.deepEqual(notComparable.map((o) => o.offerId), ['unverified-cat', 'split-unknown']);
});
