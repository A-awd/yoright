import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateReference } from '@/lib/utils';
import { createPaymentIntent } from '@/lib/providers/tap-payment';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hotelId, roomId, checkIn, checkOut, guestInfo, currency, total } = body;
    const session = await getServerSession(authOptions);

    let userId: string | null = null;
    
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      userId = user?.id || null;
    }

    const vat = total * 0.15;
    const reference = generateReference();

    const riyadhCity = await prisma.city.findUnique({
      where: { slug: 'riyadh' },
    });

    if (!riyadhCity) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        reference,
        status: 'PENDING',
        supplier: 'RATEHAWK',
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        cityId: riyadhCity.id,
        hotelId,
        roomJson: { roomId },
        guestJson: guestInfo,
        currency,
        total: total + vat,
        vat,
        userId,
      },
    });

    const paymentIntent = await createPaymentIntent(
      total + vat,
      currency,
      {
        bookingReference: reference,
        bookingId: booking.id,
      }
    );

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: 'TAP',
        providerIntentId: paymentIntent.id,
        status: 'PENDING',
        amount: total + vat,
        currency,
        rawJson: paymentIntent,
      },
    });

    return NextResponse.json({
      bookingId: booking.id,
      reference: booking.reference,
      paymentIntent: {
        id: paymentIntent.id,
        clientSecret: paymentIntent.clientSecret,
      },
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (reference) {
      const booking = await prisma.booking.findUnique({
        where: { reference },
        include: {
          city: true,
          payments: true,
          user: true,
        },
      });

      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ booking });
    }

    const bookings = await prisma.booking.findMany({
      include: {
        city: true,
        payments: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Booking fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
