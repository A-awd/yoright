import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function BookingDetailsPage({ 
  params 
}: { 
  params: { locale: string; reference: string };
}) {
  const locale = params.locale;
  const reference = params.reference;
  const session = await getServerSession(authOptions);

  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: {
      city: true,
      payments: true,
      user: true,
    },
  });

  if (!booking) {
    notFound();
  }

  if (!booking.userId) {
    notFound();
  }

  if (!session?.user?.email) {
    redirect(`/${locale}/auth/signin`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect(`/${locale}/auth/signin`);
  }

  if (booking.userId !== user.id && user.role !== 'ADMIN') {
    notFound();
  }

  const guestInfo = booking.guestJson as any;
  const roomInfo = booking.roomJson as any;
  
  const statusDisplay = booking.status === 'PAID' || booking.status === 'CONFIRMED'
    ? (locale === 'ar' ? 'مؤكد' : 'Confirmed')
    : booking.status === 'PENDING'
    ? (locale === 'ar' ? 'قيد الانتظار' : 'Pending')
    : (locale === 'ar' ? 'ملغي' : 'Cancelled');

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 ${booking.status === 'PAID' || booking.status === 'CONFIRMED' ? 'bg-green-100' : 'bg-yellow-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <span className={`text-4xl ${booking.status === 'PAID' || booking.status === 'CONFIRMED' ? 'text-green-600' : 'text-yellow-600'}`}>
              {booking.status === 'PAID' || booking.status === 'CONFIRMED' ? '✓' : '⏱'}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {booking.status === 'PAID' || booking.status === 'CONFIRMED' 
              ? (locale === 'ar' ? 'تم تأكيد حجزك!' : 'Your Booking is Confirmed!')
              : (locale === 'ar' ? 'حجزك قيد المعالجة' : 'Your Booking is Processing')}
          </h1>
          <p className="text-gray-600">
            {locale === 'ar' ? 'رقم المرجع:' : 'Reference Number:'} <span className="font-mono font-bold">{booking.reference}</span>
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{locale === 'ar' ? 'تفاصيل الحجز' : 'Booking Details'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">{locale === 'ar' ? 'الفندق' : 'Hotel'}</p>
                <p className="font-semibold text-lg">Hotel #{booking.hotelId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{locale === 'ar' ? 'المدينة' : 'City'}</p>
                <p className="font-semibold">{locale === 'ar' ? booking.city.nameAr : booking.city.nameEn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{locale === 'ar' ? 'الغرفة' : 'Room'}</p>
                <p className="font-semibold">Room #{roomInfo?.roomId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{locale === 'ar' ? 'الحالة' : 'Status'}</p>
                <span className={`px-3 py-1 ${booking.status === 'PAID' || booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-sm rounded-full`}>
                  {statusDisplay}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{locale === 'ar' ? 'تاريخ الوصول' : 'Check-in'}</p>
                <p className="font-semibold">{booking.checkIn.toISOString().split('T')[0]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{locale === 'ar' ? 'تاريخ المغادرة' : 'Check-out'}</p>
                <p className="font-semibold">{booking.checkOut.toISOString().split('T')[0]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{locale === 'ar' ? 'اسم الضيف' : 'Guest Name'}</p>
                <p className="font-semibold">{guestInfo?.firstName} {guestInfo?.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                <p className="font-semibold">{guestInfo?.email}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">{locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{(booking.total - booking.vat).toFixed(2)} {booking.currency}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">{locale === 'ar' ? 'ضريبة القيمة المضافة' : 'VAT'}</span>
                <span>{booking.vat.toFixed(2)} {booking.currency}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-lg font-semibold">{locale === 'ar' ? 'المجموع' : 'Total'}</span>
                <span className="text-2xl font-bold text-purple-600">
                  {booking.total.toFixed(2)} {booking.currency}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button variant="outline">
            {locale === 'ar' ? 'إضافة للتقويم' : 'Add to Calendar'}
          </Button>
          <Button variant="outline">
            {locale === 'ar' ? 'طباعة' : 'Print'}
          </Button>
        </div>
      </div>
    </main>
  );
}
