import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addBasisPoints, addMoney, basisPointsOf, compareMoney, convertMoney, formatMoney, money, parseMoney,
  subtractMoney, toDecimalString,
} from '../src/index';
import { SYNTHETIC_FX } from './fixtures';

test('parse and print round-trip without floats', () => {
  assert.deepEqual(parseMoney('610.50', 'SAR'), { amountMinor: 61050, currency: 'SAR' });
  assert.equal(toDecimalString(parseMoney('0.05', 'SAR')), '0.05');
  assert.equal(toDecimalString(parseMoney('-12', 'SAR')), '-12.00');
  assert.equal(toDecimalString(parseMoney('1.250', 'KWD')), '1.250');
  assert.equal(toDecimalString(money(500, 'JPY')), '500');
});

test('rejects silent rounding, floats and unknown currencies', () => {
  assert.throws(() => parseMoney('1.005', 'SAR'), /Too many fraction digits/);
  assert.throws(() => parseMoney('1e3', 'SAR'), /Invalid decimal/);
  assert.throws(() => money(10.5, 'SAR'), /safe integer/);
  assert.throws(() => money(100, 'XXX'), /Unsupported currency/);
});

test('arithmetic refuses mixed currencies', () => {
  assert.equal(addMoney(money(100, 'SAR'), money(250, 'SAR')).amountMinor, 350);
  assert.equal(subtractMoney(money(100, 'SAR'), money(250, 'SAR')).amountMinor, -150);
  assert.throws(() => addMoney(money(1, 'SAR'), money(1, 'USD')), /Currency mismatch/);
  assert.throws(() => compareMoney(money(1, 'SAR'), money(1, 'USD')), /Currency mismatch/);
});

test('basis points round half away from zero', () => {
  assert.equal(basisPointsOf(money(10000, 'SAR'), 850).amountMinor, 850);
  assert.equal(basisPointsOf(money(333, 'SAR'), 150).amountMinor, 5); // 4.995 -> 5
  assert.equal(basisPointsOf(money(-333, 'SAR'), 150).amountMinor, -5);
  assert.equal(addBasisPoints(money(60000, 'SAR'), 1000).amountMinor, 66000);
});

test('conversion uses the supplied rate and returns its provenance', () => {
  const out = convertMoney(money(16000, 'USD'), SYNTHETIC_FX);
  assert.deepEqual(out.money, { amountMinor: 60000, currency: 'SAR' });
  assert.equal(out.fx, SYNTHETIC_FX);
  assert.deepEqual(out.original, { amountMinor: 16000, currency: 'USD' });
  assert.throws(() => convertMoney(money(1, 'EUR'), SYNTHETIC_FX), /does not match/);
  assert.throws(() => convertMoney(money(1, 'USD'), { ...SYNTHETIC_FX, source: '' }), /source/);
  assert.throws(() => convertMoney(money(1, 'USD'), { ...SYNTHETIC_FX, asOf: 'yesterday' }), /asOf/);
});

test('conversion handles different minor-unit exponents', () => {
  const kwd = { base: 'KWD', quote: 'SAR', rate: '12.2', asOf: '2026-01-01T00:00:00Z', source: 'synthetic-fixture' };
  assert.equal(convertMoney(money(1000, 'KWD'), kwd).money.amountMinor, 1220); // 1.000 KWD -> 12.20 SAR
  const jpy = { base: 'SAR', quote: 'JPY', rate: '40.005', asOf: '2026-01-01T00:00:00Z', source: 'synthetic-fixture' };
  assert.equal(convertMoney(money(10000, 'SAR'), jpy).money.amountMinor, 4001); // 4000.5 -> 4001
});

test('display string supports both numeral systems', () => {
  assert.match(formatMoney(money(61050, 'SAR'), 'ar'), /610\.50/);
  assert.match(formatMoney(money(61050, 'SAR'), 'en'), /610\.50/);
  assert.match(formatMoney(money(61050, 'SAR'), 'ar', 'arab'), /٦١٠/);
});
