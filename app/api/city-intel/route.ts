import { NextRequest, NextResponse } from 'next/server';
import { getCityIntelligence } from '@/lib/providers/city-intelligence';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cityId = searchParams.get('cityId');
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));

    if (!cityId) {
      return NextResponse.json(
        { error: 'cityId is required' },
        { status: 400 }
      );
    }

    const intelligence = await getCityIntelligence(cityId, month);

    return NextResponse.json({ intelligence });
  } catch (error) {
    console.error('City intelligence error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch city intelligence' },
      { status: 500 }
    );
  }
}
