import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Calendar, MapPin, CreditCard, Plane, Clock, CheckCircle, Luggage, Home } from 'lucide-react';

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

  const renderBookingCard = (booking: any, isPast = false) => {
    const isConfirmed = booking.status === 'PAID' || booking.status === 'CONFIRMED';
    const StatusIcon = isConfirmed ? CheckCircle : Clock;
    const statusBg = isConfirmed ? 'bg-green-50' : 'bg-yellow-50';
    const statusText = isConfirmed ? 'text-green-700' : 'text-yellow-700';
    const statusBorder = isConfirmed ? 'border-green-200' : 'border-yellow-200';
    const statusLabel = isConfirmed 
      ? (isPast ? (locale === 'ar' ? 'مكتمل' : 'Completed') : (locale === 'ar' ? 'مؤكد' : 'Confirmed'))
      : (locale === 'ar' ? 'قيد الانتظار' : 'Pending');

    return (
      <Card key={booking.id} className={`group rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0 ${isPast ? 'opacity-80' : ''}`}>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold group-hover:text-purple-600 transition">Hotel #{booking.hotelId}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${statusBg} ${statusText} text-sm font-medium rounded-full border ${statusBorder}`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusLabel}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">{locale === 'ar' ? booking.city.nameAr : booking.city.nameEn}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">{locale === 'ar' ? 'تاريخ الوصول' : 'Check-in'}</p>
                    <p className="font-bold">{booking.checkIn.toISOString().split('T')[0]}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">{locale === 'ar' ? 'تاريخ المغادرة' : 'Check-out'}</p>
                    <p className="font-bold">{booking.checkOut.toISOString().split('T')[0]}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">{locale === 'ar' ? 'رقم المرجع' : 'Reference'}</p>
                    <p className="font-bold font-mono text-sm">{booking.reference}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">{locale === 'ar' ? 'المجموع' : 'Total'}</p>
                    <p className="font-bold">{booking.total.toFixed(2)} {booking.currency}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-48 flex lg:flex-col gap-3 justify-end lg:justify-start">
              <Link href={`/${locale}/bookings/${booking.reference}`} className="flex-1 lg:flex-initial">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg shadow-lg hover:shadow-xl transition-all">
                  {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50/30 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <Luggage className="w-10 h-10 text-purple-600" />
            {locale === 'ar' ? 'رحلاتي' : 'My Trips'}
          </h1>
          <p className="text-gray-600">
            {locale === 'ar' ? 'إدارة جميع حجوزاتك في مكان واحد' : 'Manage all your bookings in one place'}
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card className="rounded-xl shadow-lg border-0">
            <CardContent className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 mb-6">
                <Plane className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{locale === 'ar' ? 'لا توجد حجوزات بعد' : 'No Bookings Yet'}</h3>
              <p className="text-gray-500 text-lg mb-6">
                {locale === 'ar' ? 'ابدأ رحلتك القادمة معنا!' : 'Start your next adventure with us!'}
              </p>
              <Link href={`/${locale}`}>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg shadow-lg hover:shadow-xl transition-all" size="lg">
                  <Home className="w-5 h-5 mr-2" />
                  {locale === 'ar' ? 'ابدأ البحث' : 'Start Searching'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {upcomingBookings.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg">
                    <Plane className="w-5 h-5" />
                    <span className="font-bold">{locale === 'ar' ? 'الحجوزات القادمة' : 'Upcoming Trips'}</span>
                    <span className="bg-white/30 px-2 py-0.5 rounded-full text-sm">{upcomingBookings.length}</span>
                  </div>
                </div>
                <div className="space-y-6">
                  {upcomingBookings.map((booking) => renderBookingCard(booking, false))}
                </div>
              </div>
            )}

            {pastBookings.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-full shadow-lg">
                    <Clock className="w-5 h-5" />
                    <span className="font-bold">{locale === 'ar' ? 'الحجوزات السابقة' : 'Past Trips'}</span>
                    <span className="bg-white/30 px-2 py-0.5 rounded-full text-sm">{pastBookings.length}</span>
                  </div>
                </div>
                <div className="space-y-6">
                  {pastBookings.map((booking) => renderBookingCard(booking, true))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
