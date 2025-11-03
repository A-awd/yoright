import { NextResponse } from 'next/server';
import { getFxRates } from '@/lib/providers/fx-rates';

export async function GET() {
  try {
    const rates = await getFxRates();
    const ratesObject = Object.fromEntries(rates);

    return NextResponse.json({ rates: ratesObject });
  } catch (error) {
    console.error('FX rates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FX rates' },
      { status: 500 }
    );
  }
}
