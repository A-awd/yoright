import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateReference(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `YR-${timestamp.toUpperCase()}-${random.toUpperCase()}`;
}

export function formatCurrency(amount: number, currency: string, locale: string = 'ar-SA'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string, rates: Map<string, number>): number {
  if (fromCurrency === toCurrency) return amount;
  
  const rateKey = `${fromCurrency}_${toCurrency}`;
  const rate = rates.get(rateKey);
  
  if (!rate) {
    const fromToSAR = rates.get(`${fromCurrency}_SAR`) || 1;
    const SARToTarget = rates.get(`SAR_${toCurrency}`) || 1;
    return amount * fromToSAR * SARToTarget;
  }
  
  return amount * rate;
}

export function calculateVAT(amount: number, vatRate: number = 0.15): number {
  return amount * vatRate;
}

export function calculateTotal(subtotal: number, vatRate: number = 0.15): number {
  return subtotal + calculateVAT(subtotal, vatRate);
}

export function formatDate(date: Date | string, locale: string = 'ar-SA'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function getDaysBetween(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
