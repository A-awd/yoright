import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildComparableSets, combineDataModes, extractRoomSignature, hotelComparabilityIssues, hotelComparableKey, money,
  priceInSar, roomGroupKey, roomsEquivalent, ticketComparableKey, type EventTicketOffer, type RoomSignature,
} from '../src/index';
import { SYNTHETIC_FX, freeUntil48h, kingCity, offer, stay } from './fixtures';

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
    offer({ offerId: 'd', refundability: 'NON_REFUNDABLE', cancellationPolicy: null, customerTotalSar: money(50000, 'SAR') }),
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

// ---- Review 2026-11-16 regressions -------------------------------------------------

test('YR-01: 20 m2 and 60 m2 rooms are neither equivalent nor grouped nor ranked together', () => {
  const small: RoomSignature = { ...kingCity, sizeSqm: 20 };
  const large: RoomSignature = { ...kingCity, sizeSqm: 60 };
  assert.deepEqual(roomsEquivalent(small, large), { equivalent: false, reasons: ['SIZE_DIFFERS'] });
  assert.notEqual(roomGroupKey(small), roomGroupKey(large));
  const { sets } = buildComparableSets(
    [
      offer({ offerId: 'small', roomSignature: small, customerTotalSar: money(40000, 'SAR') }),
      offer({ offerId: 'large', roomSignature: large, customerTotalSar: money(90000, 'SAR') }),
    ],
    hotelComparableKey,
  );
  assert.equal(sets.length, 2);
});

test('YR-01: no tolerance chain can bridge sizes (20, 22, 24 stay three groups)', () => {
  const keys = [20, 22, 24].map((sizeSqm) => roomGroupKey({ ...kingCity, sizeSqm }));
  assert.equal(new Set(keys).size, 3);
});

test('YR-01: pairwise equivalence and group key agree for every pair in a mixed matrix', () => {
  const variants: RoomSignature[] = [];
  for (const sizeSqm of [null, 20, 20.4, 22, 60, 0, -5, Number.NaN])
    for (const roomClass of [null, 'deluxe', 'superior'] as const)
      for (const smoking of [null, true, false])
        for (const bed of [null, 'king', 'queen'] as const)
          for (const viewPartial of [false, true])
            variants.push({ ...kingCity, sizeSqm, roomClass, smoking, bed, viewPartial });
  let pairs = 0;
  let equivalentPairs = 0;
  for (const a of variants) {
    for (const b of variants) {
      const ka = roomGroupKey(a);
      const sameGroup = ka !== null && ka === roomGroupKey(b);
      const eq = roomsEquivalent(a, b);
      assert.equal(eq.equivalent, sameGroup, `${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
      assert.equal(eq.reasons.length === 0, eq.equivalent);
      pairs++;
      if (sameGroup) equivalentPairs++;
    }
  }
  assert.equal(pairs, variants.length ** 2);
  assert.ok(equivalentPairs > 0 && equivalentPairs < pairs);
});

test('YR-01: unknown size, class or smoking never joins a known value; identical data still groups', () => {
  const sized: RoomSignature = { ...kingCity, sizeSqm: 32 };
  assert.deepEqual(roomsEquivalent(sized, kingCity).reasons, ['SIZE_KNOWN_ON_ONE_SIDE_ONLY']);
  assert.deepEqual(roomsEquivalent(kingCity, { ...kingCity, roomClass: null }).reasons, ['CLASS_KNOWN_ON_ONE_SIDE_ONLY']);
  assert.deepEqual(roomsEquivalent(kingCity, { ...kingCity, smoking: false }).reasons, ['SMOKING_KNOWN_ON_ONE_SIDE_ONLY']);
  // Normal success: two suppliers describing the same room identically.
  assert.ok(roomsEquivalent(sized, { ...sized }).equivalent);
  assert.ok(roomsEquivalent({ ...sized, sizeSqm: 32.2 }, sized).equivalent); // same whole square metre
  assert.equal(roomGroupKey({ ...kingCity, maxOccupancy: 0 }), null);
  assert.ok(roomsEquivalent({ ...kingCity, maxOccupancy: 2.5 }, kingCity).reasons.includes('INVALID_MAX_OCCUPANCY'));
});

test('YR-03: different stay dates, room counts or residency are never ranked together', () => {
  const offers = [
    offer({ offerId: 'base' }),
    offer({ offerId: 'same-context', supplierCode: 'SYN-B', customerTotalSar: money(60000, 'SAR') }),
    offer({ offerId: 'other-dates', stay: { ...stay, checkOut: '2027-03-14' }, customerTotalSar: money(100, 'SAR') }),
    offer({ offerId: 'shifted', stay: { ...stay, checkIn: '2027-03-11', checkOut: '2027-03-14' }, customerTotalSar: money(100, 'SAR') }),
    offer({ offerId: 'two-rooms', stay: { ...stay, roomCount: 2 }, customerTotalSar: money(100, 'SAR') }),
    offer({ offerId: 'other-residency', stay: { ...stay, guestResidency: 'AE' }, customerTotalSar: money(100, 'SAR') }),
  ];
  const { sets, notComparable } = buildComparableSets(offers, hotelComparableKey);
  assert.equal(notComparable.length, 0);
  assert.equal(sets.length, 5);
  const main = sets.find((s) => s.offers.length === 2);
  assert.deepEqual(main?.offers.map((o) => o.offerId), ['same-context', 'base']);
});

test('YR-03: equal labels with different deadlines or penalties are different products', () => {
  const laterDeadline = [{ ...freeUntil48h[0]!, fromUtc: '2027-03-09T12:00:00Z' }];
  const halfPenalty = [{ ...freeUntil48h[0]!, penalty: { type: 'PERCENT_OF_TOTAL' as const, bps: 5000 } }];
  const amountPenalty = [{ ...freeUntil48h[0]!, penalty: { type: 'AMOUNT' as const, amount: money(61000, 'SAR') } }];
  const twoStep = [
    { fromUtc: '2027-03-05T12:00:00Z', penalty: { type: 'PERCENT_OF_TOTAL' as const, bps: 5000 } },
    ...freeUntil48h,
  ];
  const offers = [
    offer({ offerId: 'base' }),
    offer({ offerId: 'later', cancellationPolicy: laterDeadline, customerTotalSar: money(100, 'SAR') }),
    offer({ offerId: 'half', cancellationPolicy: halfPenalty, customerTotalSar: money(100, 'SAR') }),
    offer({ offerId: 'amount', cancellationPolicy: amountPenalty, customerTotalSar: money(100, 'SAR') }),
    offer({ offerId: 'two-step', cancellationPolicy: twoStep, customerTotalSar: money(100, 'SAR') }),
  ];
  const { sets } = buildComparableSets(offers, hotelComparableKey);
  assert.equal(sets.length, 5);
  assert.ok(sets.every((s) => s.offers.length === 1));
});

test('YR-03: the same schedule written differently still matches', () => {
  const sameInstantOtherOffset = [{ ...freeUntil48h[0]!, fromUtc: '2027-03-08T15:00:00+03:00' }];
  const twoStep = [
    { fromUtc: '2027-03-05T12:00:00Z', penalty: { type: 'PERCENT_OF_TOTAL' as const, bps: 5000 } },
    ...freeUntil48h,
  ];
  assert.equal(hotelComparableKey(offer({ offerId: 'a' })), hotelComparableKey(offer({ offerId: 'b', cancellationPolicy: sameInstantOtherOffset })));
  assert.equal(
    hotelComparableKey(offer({ offerId: 'a', cancellationPolicy: twoStep })),
    hotelComparableKey(offer({ offerId: 'b', cancellationPolicy: [...twoStep].reverse() })),
  );
});

test('YR-03: missing or malformed context fails closed with a stated reason', () => {
  const cases: Array<[string, Parameters<typeof offer>[0]]> = [
    ['CANCELLATION_POLICY_MISSING', { offerId: 'x', cancellationPolicy: null }],
    ['CANCELLATION_POLICY_MISSING', { offerId: 'x', refundability: 'PARTIAL', cancellationPolicy: [] }],
    ['CANCELLATION_DEADLINE_INVALID', { offerId: 'x', cancellationPolicy: [{ ...freeUntil48h[0]!, fromUtc: '2027-03-08 12:00' }] }],
    ['CANCELLATION_DEADLINE_INVALID', { offerId: 'x', cancellationPolicy: [{ ...freeUntil48h[0]!, fromUtc: '2027-03-08T12:00:00' }] }],
    ['CANCELLATION_PENALTY_INVALID', { offerId: 'x', cancellationPolicy: [{ ...freeUntil48h[0]!, penalty: { type: 'PERCENT_OF_TOTAL', bps: 10001 } }] }],
    ['CANCELLATION_DEADLINE_DUPLICATED', { offerId: 'x', cancellationPolicy: [...freeUntil48h, { ...freeUntil48h[0]!, penalty: { type: 'PERCENT_OF_TOTAL', bps: 5000 } }] }],
    ['CHECK_IN_INVALID', { offerId: 'x', stay: { ...stay, checkIn: '2027-02-30' } }],
    ['CHECK_OUT_NOT_AFTER_CHECK_IN', { offerId: 'x', stay: { ...stay, checkOut: stay.checkIn } }],
    ['ROOM_COUNT_INVALID', { offerId: 'x', stay: { ...stay, roomCount: 0 } }],
    ['GUEST_RESIDENCY_INVALID', { offerId: 'x', stay: { ...stay, guestResidency: 'sa' } }],
    ['STAY_CONTEXT_MISSING', { offerId: 'x', stay: undefined as never }],
  ];
  for (const [reason, over] of cases) {
    const o = offer(over);
    assert.ok(hotelComparabilityIssues(o).includes(reason), reason);
    assert.equal(hotelComparableKey(o), null, reason);
  }
  const { sets, notComparable } = buildComparableSets(cases.map(([, over]) => offer(over)), hotelComparableKey);
  assert.equal(sets.length, 0);
  assert.equal(notComparable.length, cases.length);
  // Normal success: a non-refundable offer needs no schedule, a refundable one needs a valid one.
  assert.deepEqual(hotelComparabilityIssues(offer({ offerId: 'nr', refundability: 'NON_REFUNDABLE', cancellationPolicy: null })), []);
  assert.deepEqual(hotelComparabilityIssues(offer({ offerId: 'ok' })), []);
});
