/**
 * Pricing and like-for-like comparison shared by every product type.
 * Totals are only ever compared inside one comparable set.
 */
import { addBasisPoints, compareMoney, convertMoney, type FxRate, type Money } from './money';

export type DataMode = 'synthetic' | 'live';

/** A response is "live" only if every contributing part is live. */
export function combineDataModes(modes: readonly DataMode[]): DataMode {
  return modes.length > 0 && modes.every((m) => m === 'live') ? 'live' : 'synthetic';
}

export interface CustomerPrice {
  /** Null when no documented FX rate exists: the offer is then "not comparable". */
  readonly customerTotalSar: Money | null;
  readonly netSar: Money | null;
  readonly fx: FxRate | null;
  readonly marginBps: number;
}

/**
 * Supplier total -> SAR customer total. `fxRates` must contain a rate whose
 * base is the supplier currency and quote is SAR; nothing is assumed otherwise.
 * VAT is deliberately absent: its treatment is an open accounting decision.
 */
export function priceInSar(supplierTotal: Money, fxRates: readonly FxRate[], marginBps: number): CustomerPrice {
  if (!Number.isInteger(marginBps) || marginBps < 0) throw new Error(`Invalid marginBps: ${marginBps}`);
  let netSar: Money;
  let fx: FxRate | null = null;
  if (supplierTotal.currency === 'SAR') {
    netSar = supplierTotal;
  } else {
    fx = fxRates.find((r) => r.base === supplierTotal.currency && r.quote === 'SAR') ?? null;
    if (!fx) return { customerTotalSar: null, netSar: null, fx: null, marginBps };
    netSar = convertMoney(supplierTotal, fx).money;
  }
  return { customerTotalSar: addBasisPoints(netSar, marginBps), netSar, fx, marginBps };
}

export interface ComparableOffer {
  readonly offerId: string;
  readonly customerTotalSar: Money | null;
}

export interface ComparableSet<T extends ComparableOffer> {
  readonly key: string;
  /** Sorted by customer total ascending; ties keep input order. */
  readonly offers: readonly T[];
  readonly cheapest: T;
}

export interface ComparisonResult<T extends ComparableOffer> {
  readonly sets: readonly ComparableSet<T>[];
  /** Offers without a SAR total or without a comparable key. Shown, never ranked. */
  readonly notComparable: readonly T[];
}

export function buildComparableSets<T extends ComparableOffer>(
  offers: readonly T[],
  keyOf: (offer: T) => string | null,
): ComparisonResult<T> {
  const groups = new Map<string, T[]>();
  const notComparable: T[] = [];
  for (const offer of offers) {
    const key = offer.customerTotalSar === null ? null : keyOf(offer);
    if (key === null) {
      notComparable.push(offer);
      continue;
    }
    const list = groups.get(key);
    if (list) list.push(offer);
    else groups.set(key, [offer]);
  }
  const sets = [...groups.entries()].map(([key, list]) => {
    const sorted = list
      .map((o, i) => ({ o, i }))
      .sort((x, y) => compareMoney(x.o.customerTotalSar as Money, y.o.customerTotalSar as Money) || x.i - y.i)
      .map((x) => x.o);
    return { key, offers: sorted, cheapest: sorted[0] as T };
  });
  return { sets, notComparable };
}
