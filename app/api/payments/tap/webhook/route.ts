import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyWebhookSignature } from '@/lib/providers/tap-payment';
import { sendBookingConfirmation } from '@/lib/providers/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('tap-signature') || '';

    const isValid = await verifyWebhookSignature(body, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const paymentIntentId = event.id;
    const status = event.status;

    const payment = await prisma.payment.findFirst({
      where: { providerIntentId: paymentIntentId },
      include: {
        booking: {
          include: {
            city: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (status === 'CAPTURED' || status === 'succeeded') {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'SUCCEEDED',
            rawJson: event,
          },
        }),
        prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            status: 'PAID',
            paidAt: new Date(),
          },
        }),
      ]);

      const booking = payment.booking;
      const guestInfo = booking.guestJson as any;

      await sendBookingConfirmation({
        to: guestInfo.email,
        bookingReference: booking.reference,
        guestName: guestInfo.name || guestInfo.firstName,
        hotelName: 'Hotel Name',
        checkIn: booking.checkIn.toISOString().split('T')[0],
        checkOut: booking.checkOut.toISOString().split('T')[0],
        roomName: 'Room Type',
        total: booking.total.toString(),
        currency: booking.currency,
      });
    } else if (status === 'FAILED' || status === 'failed') {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED',
            rawJson: event,
          },
        }),
        prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            status: 'FAILED',
          },
        }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
