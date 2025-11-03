import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function MyTripsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect(`/${locale}/auth/signin`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect(`/${locale}/auth/signin`);
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: user.id,
    },
    include: {
      city: true,
      payments: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });

  const upcomingBookings = bookings.filter(b => new Date(b.checkIn) >= new Date());
  const pastBookings = bookings.filter(b => new Date(b.checkIn) < new Date());

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {locale === 'ar' ? 'رحلاتي' : 'My Trips'}
      </h1>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">
              {locale === 'ar' ? 'لا توجد حجوزات' : 'No bookings yet'}
            </p>
            <Link href={`/${locale}`}>
              <Button>
                {locale === 'ar' ? 'ابدأ البحث' : 'Start Searching'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {upcomingBookings.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {locale === 'ar' ? 'الحجوزات القادمة' : 'Upcoming Trips'}
              </h2>
              <div className="space-y-4">
                {upcomingBookings.map((booking) => {
                  const statusBgColor = booking.status === 'PAID' || booking.status === 'CONFIRMED' 
                    ? 'bg-green-100 text-green-700' 
                    : booking.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700';

                  return (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">Hotel #{booking.hotelId}</h3>
                              <span className={`px-3 py-1 ${statusBgColor} text-sm rounded-full`}>
                                {booking.status === 'PAID' || booking.status === 'CONFIRMED' 
                                  ? (locale === 'ar' ? 'مؤكد' : 'Confirmed') 
                                  : booking.status === 'PENDING'
                                  ? (locale === 'ar' ? 'قيد الانتظار' : 'Pending')
                                  : (locale === 'ar' ? 'ملغي' : 'Cancelled')}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4">{locale === 'ar' ? booking.city.nameAr : booking.city.nameEn}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">{locale === 'ar' ? 'تاريخ الوصول' : 'Check-in'}</p>
                                <p className="font-medium">{booking.checkIn.toISOString().split('T')[0]}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">{locale === 'ar' ? 'تاريخ المغادرة' : 'Check-out'}</p>
                                <p className="font-medium">{booking.checkOut.toISOString().split('T')[0]}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">{locale === 'ar' ? 'رقم المرجع' : 'Reference'}</p>
                                <p className="font-medium">{booking.reference}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">{locale === 'ar' ? 'المجموع' : 'Total'}</p>
                                <p className="font-medium">{booking.total.toFixed(2)} {booking.currency}</p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-6">
                            <Link href={`/${locale}/bookings/${booking.reference}`}>
                              <Button variant="outline">
                                {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {locale === 'ar' ? 'الحجوزات السابقة' : 'Past Trips'}
              </h2>
              <div className="space-y-4">
                {pastBookings.map((booking) => {
                  const statusBgColor = booking.status === 'PAID' || booking.status === 'CONFIRMED' 
                    ? 'bg-green-100 text-green-700' 
                    : booking.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700';

                  return (
                    <Card key={booking.id} className="opacity-75">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">Hotel #{booking.hotelId}</h3>
                              <span className={`px-3 py-1 ${statusBgColor} text-sm rounded-full`}>
                                {booking.status === 'PAID' || booking.status === 'CONFIRMED' 
                                  ? (locale === 'ar' ? 'مكتمل' : 'Completed') 
                                  : booking.status}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4">{locale === 'ar' ? booking.city.nameAr : booking.city.nameEn}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">{locale === 'ar' ? 'تاريخ الوصول' : 'Check-in'}</p>
                                <p className="font-medium">{booking.checkIn.toISOString().split('T')[0]}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">{locale === 'ar' ? 'تاريخ المغادرة' : 'Check-out'}</p>
                                <p className="font-medium">{booking.checkOut.toISOString().split('T')[0]}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">{locale === 'ar' ? 'رقم المرجع' : 'Reference'}</p>
                                <p className="font-medium">{booking.reference}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">{locale === 'ar' ? 'المجموع' : 'Total'}</p>
                                <p className="font-medium">{booking.total.toFixed(2)} {booking.currency}</p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-6">
                            <Link href={`/${locale}/bookings/${booking.reference}`}>
                              <Button variant="outline">
                                {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
