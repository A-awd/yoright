import type { ComparableOffer, DataMode } from './comparison';
import type { FxRate, Money } from './money';
import { roomGroupKey, type RoomSignature } from './room-matching';

export type Board = 'ROOM_ONLY' | 'BREAKFAST' | 'HALF_BOARD' | 'FULL_BOARD' | 'ALL_INCLUSIVE' | 'UNKNOWN';
export type Refundability = 'FREE' | 'PARTIAL' | 'NON_REFUNDABLE' | 'UNKNOWN';
export type PaymentTiming = 'PREPAID' | 'AT_PROPERTY' | 'DEPOSIT';

export interface HotelOffer extends ComparableOffer {
  readonly supplierCode: string;
  /** Opaque supplier identifiers. Carried byte-for-byte from search to booking; never parsed or rewritten. */
  readonly rateKey: string;
  readonly supplierHotelId: string;
  readonly canonicalHotelId: string;
  readonly supplierRoomLabel: string;
  readonly roomSignature: RoomSignature;
  readonly board: Board;
  readonly refundability: Refundability;
  readonly paymentTiming: PaymentTiming;
  readonly occupancy: { readonly adults: number; readonly childrenAges: readonly number[] };
  readonly supplierTotal: Money;
  /** Paid at the property and therefore outside the customer total; always displayed beside it. */
  readonly mandatoryFeesAtProperty: readonly Money[];
  readonly fx: FxRate | null;
  readonly dataMode: DataMode;
}

/**
 * Like-for-like key. Returns null when any term that defines the product is
 * unknown, which keeps the offer visible but out of every price ranking.
 */
export function hotelComparableKey(o: HotelOffer): string | null {
  const room = roomGroupKey(o.roomSignature);
  if (room === null || o.board === 'UNKNOWN' || o.refundability === 'UNKNOWN') return null;
  const fees = o.mandatoryFeesAtProperty
    .map((f) => `${f.currency}:${f.amountMinor}`)
    .sort()
    .join(',');
  return [
    `hotel=${o.canonicalHotelId}`,
    `room=[${room}]`,
    `board=${o.board}`,
    `refund=${o.refundability}`,
    `pay=${o.paymentTiming}`,
    `occ=${o.occupancy.adults}+[${[...o.occupancy.childrenAges].sort((a, b) => a - b).join(',')}]`,
    `fees=[${fees}]`,
  ].join('|');
}
