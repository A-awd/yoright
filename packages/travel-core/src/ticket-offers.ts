/**
 * FUTURE SCOPE (decision 0003): event and match tickets. These are provisional
 * comparison types only. Nothing here sells, sources or lists a ticket, and no
 * supplier, category taxonomy or resale permission is assumed.
 */
import type { ComparableOffer, DataMode } from './comparison';
import type { Refundability } from './hotel-offers';
import type { Money } from './money';

export type TicketSourceClass =
  | 'OFFICIAL_PRIMARY' | 'OFFICIAL_HOSPITALITY' | 'AUTHORIZED_RESALE' | 'SECONDARY_MARKET' | 'UNKNOWN';
export type TicketDelivery = 'MOBILE_TRANSFER' | 'E_TICKET' | 'PHYSICAL' | 'VENUE_COLLECTION' | 'UNKNOWN';

export interface EventTicketOffer extends ComparableOffer {
  readonly supplierCode: string;
  /** Opaque supplier listing identifier, carried unchanged. */
  readonly supplierListingKey: string;
  readonly canonicalEventId: string;
  /** Seating category exactly as verified against the organiser's map; null when not verified. */
  readonly verifiedCategory: string | null;
  readonly quantity: number;
  /** Null when the supplier does not state whether seats are adjacent. */
  readonly seatedTogether: boolean | null;
  readonly delivery: TicketDelivery;
  readonly sourceClass: TicketSourceClass;
  readonly refundability: Refundability;
  /** e.g. "AWAY_SECTION", "RESTRICTED_VIEW", "ID_REQUIRED". Part of the product. */
  readonly restrictions: readonly string[];
  readonly supplierTotal: Money;
  readonly dataMode: DataMode;
}

/** Official and secondary supply are different products and are never ranked together. */
export function ticketComparableKey(o: EventTicketOffer): string | null {
  if (
    o.verifiedCategory === null ||
    o.sourceClass === 'UNKNOWN' ||
    o.delivery === 'UNKNOWN' ||
    o.refundability === 'UNKNOWN' ||
    (o.quantity > 1 && o.seatedTogether === null)
  ) {
    return null;
  }
  return [
    `event=${o.canonicalEventId}`,
    `category=${o.verifiedCategory}`,
    `qty=${o.quantity}`,
    `together=${o.quantity > 1 ? o.seatedTogether : 'n/a'}`,
    `delivery=${o.delivery}`,
    `source=${o.sourceClass}`,
    `refund=${o.refundability}`,
    `restrictions=[${[...o.restrictions].sort().join(',')}]`,
  ].join('|');
}
