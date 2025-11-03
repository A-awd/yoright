import { NextRequest, NextResponse } from 'next/server';
import { rateHawkAdapter } from '@/lib/adapters/ratehawk';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cityId = searchParams.get('cityId') || 'riyadh';
    const checkIn = searchParams.get('checkIn') || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const checkOut = searchParams.get('checkOut') || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const guests = parseInt(searchParams.get('guests') || '2');

    const hotels = await rateHawkAdapter.searchHotels({
      cityId,
      checkIn,
      checkOut,
      guests,
    });

    return NextResponse.json({ hotels });
  } catch (error) {
    console.error('Hotel search error:', error);
    return NextResponse.json(
      { error: 'Failed to search hotels' },
      { status: 500 }
    );
  }
}
