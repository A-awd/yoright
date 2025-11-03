import { prisma } from '../db';

interface FxRateMap {
  [key: string]: number;
}

const STATIC_RATES: FxRateMap = {
  SAR_USD: 0.27,
  SAR_EUR: 0.24,
  USD_SAR: 3.75,
  USD_EUR: 0.92,
  EUR_SAR: 4.16,
  EUR_USD: 1.09,
};

export async function getFxRates(): Promise<Map<string, number>> {
  try {
    const rates = await prisma.fxRate.findMany({
      where: {
        asOf: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    const rateMap = new Map<string, number>();
    
    rates.forEach(rate => {
      rateMap.set(`${rate.base}_${rate.quote}`, rate.rate);
    });

    if (rateMap.size === 0) {
      Object.entries(STATIC_RATES).forEach(([key, value]) => {
        rateMap.set(key, value);
      });
    }

    return rateMap;
  } catch (error) {
    console.error('Error fetching FX rates:', error);
    const fallbackMap = new Map<string, number>();
    Object.entries(STATIC_RATES).forEach(([key, value]) => {
      fallbackMap.set(key, value);
    });
    return fallbackMap;
  }
}

export async function updateFxRates(): Promise<void> {
  try {
    for (const [key, rate] of Object.entries(STATIC_RATES)) {
      const [base, quote] = key.split('_');
      
      await prisma.fxRate.upsert({
        where: {
          base_quote: { base, quote },
        },
        update: {
          rate,
          asOf: new Date(),
        },
        create: {
          base,
          quote,
          rate,
          asOf: new Date(),
        },
      });
    }
  } catch (error) {
    console.error('Error updating FX rates:', error);
  }
}

export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: Map<string, number>
): number {
  if (from === to) return amount;

  const key = `${from}_${to}`;
  const rate = rates.get(key);

  if (rate) {
    return amount * rate;
  }

  const toSAR = rates.get(`${from}_SAR`);
  const fromSAR = rates.get(`SAR_${to}`);

  if (toSAR && fromSAR) {
    return amount * toSAR * fromSAR;
  }

  return amount;
}
