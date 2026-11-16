/**
 * Money in integer minor units. No floating point anywhere in price paths.
 * Unknown currencies are rejected instead of guessing an exponent.
 */

export type CurrencyCode = string;

/** ISO 4217 minor-unit exponents for currencies the product may meet. Extend deliberately. */
const CURRENCY_EXPONENT: Readonly<Record<string, number>> = {
  SAR: 2, AED: 2, QAR: 2, EGP: 2, USD: 2, EUR: 2, GBP: 2, TRY: 2,
  KWD: 3, BHD: 3, OMR: 3, JOD: 3,
  JPY: 0,
};

export interface Money {
  readonly amountMinor: number;
  readonly currency: CurrencyCode;
}

/** Exchange rate with provenance: 1 `base` = `rate` `quote`. `rate` is a decimal string, never a float. */
export interface FxRate {
  readonly base: CurrencyCode;
  readonly quote: CurrencyCode;
  readonly rate: string;
  /** ISO-8601 instant the rate was observed. */
  readonly asOf: string;
  /** Where the rate came from (e.g. "synthetic-fixture"). */
  readonly source: string;
}

export interface ConvertedMoney {
  readonly money: Money;
  readonly original: Money;
  readonly fx: FxRate;
}

export function currencyExponent(currency: CurrencyCode): number {
  const exp = CURRENCY_EXPONENT[currency];
  if (exp === undefined) throw new Error(`Unsupported currency: ${currency}`);
  return exp;
}

export function money(amountMinor: number, currency: CurrencyCode): Money {
  currencyExponent(currency);
  if (!Number.isSafeInteger(amountMinor)) {
    throw new Error(`amountMinor must be a safe integer, got ${amountMinor}`);
  }
  return { amountMinor, currency };
}

const DECIMAL_RE = /^(-?)(\d+)(?:\.(\d+))?$/;

/** Parse "610.50" into minor units. Rejects more fraction digits than the currency allows (no silent rounding). */
export function parseMoney(decimal: string, currency: CurrencyCode): Money {
  const exp = currencyExponent(currency);
  const m = DECIMAL_RE.exec(decimal.trim());
  if (!m) throw new Error(`Invalid decimal amount: ${decimal}`);
  const frac = m[3] ?? '';
  if (frac.length > exp) {
    throw new Error(`Too many fraction digits for ${currency}: ${decimal}`);
  }
  const minor = BigInt(m[2] + frac.padEnd(exp, '0')) * (m[1] === '-' ? -1n : 1n);
  return money(toSafeNumber(minor), currency);
}

export function toDecimalString(m: Money): string {
  const exp = currencyExponent(m.currency);
  const neg = m.amountMinor < 0;
  const digits = String(Math.abs(m.amountMinor)).padStart(exp + 1, '0');
  const whole = exp === 0 ? digits : digits.slice(0, -exp);
  const frac = exp === 0 ? '' : '.' + digits.slice(-exp);
  return (neg ? '-' : '') + whole + frac;
}

function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency !== b.currency) {
    throw new Error(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  }
}

export function addMoney(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.amountMinor + b.amountMinor, a.currency);
}

export function subtractMoney(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.amountMinor - b.amountMinor, a.currency);
}

/** Negative when a < b, 0 when equal, positive when a > b. Throws across currencies. */
export function compareMoney(a: Money, b: Money): number {
  assertSameCurrency(a, b);
  return a.amountMinor - b.amountMinor;
}

/** `bps` basis points of `m` (100 bps = 1%), rounded half away from zero. */
export function basisPointsOf(m: Money, bps: number): Money {
  if (!Number.isInteger(bps)) throw new Error(`bps must be an integer, got ${bps}`);
  return money(toSafeNumber(divRound(BigInt(m.amountMinor) * BigInt(bps), 10000n)), m.currency);
}

export function addBasisPoints(m: Money, bps: number): Money {
  return addMoney(m, basisPointsOf(m, bps));
}

/** Convert using an explicit rate record; the record is returned so the caller can persist provenance. */
export function convertMoney(m: Money, fx: FxRate): ConvertedMoney {
  if (m.currency !== fx.base) {
    throw new Error(`FX rate base ${fx.base} does not match ${m.currency}`);
  }
  const rm = DECIMAL_RE.exec(fx.rate.trim());
  if (!rm || rm[1] === '-') throw new Error(`Invalid FX rate: ${fx.rate}`);
  const rateFrac = rm[3] ?? '';
  const rateScaled = BigInt(rm[2] + rateFrac);
  if (rateScaled === 0n) throw new Error('FX rate must be positive');
  if (Number.isNaN(Date.parse(fx.asOf))) throw new Error(`Invalid FX asOf: ${fx.asOf}`);
  if (!fx.source) throw new Error('FX rate needs a source');

  const expShift = currencyExponent(fx.quote) - currencyExponent(fx.base);
  let numerator = BigInt(m.amountMinor) * rateScaled;
  let denominator = 10n ** BigInt(rateFrac.length);
  if (expShift >= 0) numerator *= 10n ** BigInt(expShift);
  else denominator *= 10n ** BigInt(-expShift);

  return {
    money: money(toSafeNumber(divRound(numerator, denominator)), fx.quote),
    original: m,
    fx,
  };
}

export type NumeralSystem = 'latn' | 'arab';

/**
 * Locale display string. Numeral system is a parameter because the owner has not
 * yet decided the default (plan decision D4); 'latn' is only the provisional default.
 */
export function formatMoney(m: Money, locale: 'ar' | 'en', numerals: NumeralSystem = 'latn'): string {
  const exp = currencyExponent(m.currency);
  const tag = `${locale === 'ar' ? 'ar-SA' : 'en-SA'}-u-nu-${numerals}`;
  return new Intl.NumberFormat(tag, {
    style: 'currency',
    currency: m.currency,
    minimumFractionDigits: exp,
    maximumFractionDigits: exp,
  }).format(m.amountMinor / 10 ** exp);
}

function divRound(n: bigint, d: bigint): bigint {
  const neg = n < 0n !== d < 0n;
  const an = n < 0n ? -n : n;
  const ad = d < 0n ? -d : d;
  const q = (an * 2n + ad) / (ad * 2n);
  return neg ? -q : q;
}

function toSafeNumber(v: bigint): number {
  const n = Number(v);
  if (!Number.isSafeInteger(n)) throw new Error('Amount exceeds safe integer range');
  return n;
}
