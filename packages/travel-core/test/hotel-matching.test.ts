import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateMatch, nameSimilarity, normalizeText, type PropertyRecord } from '../src/index';
import { base, north } from './fixtures';

test('Arabic normalisation unifies letter variants, diacritics, tatweel and digits', () => {
  assert.equal(normalizeText('فُنْدُق الأَمَـــل'), normalizeText('فندق الامل'));
  assert.equal(normalizeText('برج ٢'), 'برج 2');
  assert.equal(normalizeText('المدينة'), normalizeText('المدينه'));
  assert.ok(nameSimilarity('فندق الريتز', 'الريتز') === 1);
});

test('same property from a second supplier is auto-accepted only with full evidence', () => {
  const other: PropertyRecord = {
    ...north(base, 40),
    nameEn: 'Synthetic Palm Court Riyadh', // "Hotel" dropped
    phoneE164: '+966 11 000 0001',
    address: undefined,
  };
  const r = evaluateMatch(base, other);
  assert.equal(r.decision, 'AUTO_ACCEPT');
});

test('acceptance 1: same brand, two towers 120 m apart are never auto-merged', () => {
  const t1 = { ...base, nameEn: 'Synthetic Palm Court Tower 1', nameAr: 'نخيل كورت التجريبي برج 1' };
  const t2 = { ...north(base, 120), nameEn: 'Synthetic Palm Court Tower 2', nameAr: 'نخيل كورت التجريبي برج ٢' };
  const r = evaluateMatch(t1, t2);
  assert.notEqual(r.decision, 'AUTO_ACCEPT');
  assert.ok(r.reasons.includes('DISTINGUISHING_TOKEN_CONFLICT'));
});

test('direction words also block auto-accept', () => {
  const a = { ...base, nameEn: 'Synthetic Palm Court North', nameAr: undefined };
  const b = { ...north(base, 60), nameEn: 'Synthetic Palm Court South', nameAr: undefined };
  assert.notEqual(evaluateMatch(a, b).decision, 'AUTO_ACCEPT');
});

test('acceptance 3: name-only match 900 m apart with no phone goes to REVIEW', () => {
  const other: PropertyRecord = { ...north(base, 900), phoneE164: undefined, address: undefined };
  const r = evaluateMatch(base, other);
  assert.equal(r.decision, 'REVIEW');
  assert.ok(r.reasons.includes('DISTANCE_ABOVE_AUTO_THRESHOLD'));
});

test('proximity alone neither auto-accepts nor floods the review queue', () => {
  const neighbour: PropertyRecord = {
    nameEn: 'Fictional Dunes Lodge', countryCode: 'SA', cityCode: 'RUH',
    lat: north(base, 30).lat, lng: base.lng,
  };
  assert.equal(evaluateMatch(base, neighbour).decision, 'REJECT');
});

test('strong name and location with a conflicting phone is held for review', () => {
  const r = evaluateMatch(base, { ...north(base, 20), phoneE164: '+966110000999' });
  assert.equal(r.decision, 'REVIEW');
  assert.ok(r.reasons.includes('PHONE_CONFLICT'));
});

test('missing coordinates can never auto-accept', () => {
  const r = evaluateMatch(base, { ...base, lat: undefined, lng: undefined });
  assert.equal(r.decision, 'REVIEW');
  assert.ok(r.reasons.includes('DISTANCE_UNKNOWN'));
});

test('different city is rejected regardless of name', () => {
  assert.equal(evaluateMatch(base, { ...base, cityCode: 'JED' }).decision, 'REJECT');
});

test('fixture precision: zero false merges across distinct synthetic properties', () => {
  const distinct: PropertyRecord[] = [
    base,
    { ...north(base, 120), nameEn: 'Synthetic Palm Court Hotel Riyadh 2', nameAr: undefined, phoneE164: '+966110000002' },
    { ...north(base, 300), nameEn: 'Synthetic Palm Court Residences Annex', nameAr: undefined, phoneE164: '+966110000003' },
    { ...north(base, 80), nameEn: 'Imaginary Olaya Plaza', nameAr: undefined, phoneE164: '+966110000004' },
    { ...north(base, 5000), phoneE164: undefined, address: undefined },
  ];
  let falseMerges = 0;
  for (let i = 0; i < distinct.length; i++) {
    for (let j = i + 1; j < distinct.length; j++) {
      if (evaluateMatch(distinct[i] as PropertyRecord, distinct[j] as PropertyRecord).decision === 'AUTO_ACCEPT') falseMerges++;
    }
  }
  assert.equal(falseMerges, 0);
});
