/**
 * SYNTHETIC DATA ONLY. Every property, phone number, coordinate, price, rate
 * and identifier below is invented for tests. None describes a real hotel,
 * supplier response, event, exchange rate or customer.
 */
import type { FxRate, HotelOffer, PropertyRecord, RoomSignature } from '../src/index';
import { money } from '../src/index';

export const SYNTHETIC_FX: FxRate = {
  base: 'USD', quote: 'SAR', rate: '3.75', asOf: '2026-01-01T00:00:00Z', source: 'synthetic-fixture',
};

export const base: PropertyRecord = {
  nameEn: 'Synthetic Palm Court Hotel Riyadh',
  nameAr: 'فندق نخيل كورت التجريبي الرياض',
  countryCode: 'SA', cityCode: 'RUH',
  lat: 24.7, lng: 46.7,
  phoneE164: '+966110000001',
  address: '12 Example Road, Olaya District, Riyadh',
  brand: 'Synthetic Palm',
};

/** Roughly `meters` north of `p`. */
export function north(p: PropertyRecord, meters: number): PropertyRecord {
  return { ...p, lat: (p.lat as number) + meters / 111_320 };
}

export const kingCity: RoomSignature = {
  roomClass: 'deluxe', bed: 'king', view: 'city', viewPartial: false, maxOccupancy: 2, sizeSqm: null, smoking: null,
};

export function offer(over: Partial<HotelOffer> & Pick<HotelOffer, 'offerId'>): HotelOffer {
  return {
    supplierCode: 'SYN-A',
    rateKey: `rk:${over.offerId}`,
    supplierHotelId: 'A-H-0001',
    canonicalHotelId: 'ch_1',
    supplierRoomLabel: 'Deluxe King City View',
    roomSignature: kingCity,
    board: 'BREAKFAST',
    refundability: 'FREE',
    paymentTiming: 'PREPAID',
    occupancy: { adults: 2, childrenAges: [] },
    supplierTotal: money(61000, 'SAR'),
    mandatoryFeesAtProperty: [],
    customerTotalSar: money(61000, 'SAR'),
    fx: null,
    dataMode: 'synthetic',
    ...over,
  };
}
