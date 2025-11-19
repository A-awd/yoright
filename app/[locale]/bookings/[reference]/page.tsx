import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { CheckCircle2, Calendar, MapPin, User, Mail, CreditCard, Download, Printer, Clock, Building } from 'lucide-react';

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
  
  const isConfirmed = booking.status === 'PAID' || booking.status === 'CONFIRMED';
  const statusDisplay = isConfirmed
    ? (locale === 'ar' ? 'مؤكد' : 'Confirmed')
    : booking.status === 'PENDING'
    ? (locale === 'ar' ? 'قيد الانتظار' : 'Pending')
    : (locale === 'ar' ? 'ملغي' : 'Cancelled');

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50/30 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className={`w-24 h-24 ${isConfirmed ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-yellow-400 to-orange-500'} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce`}>
              {isConfirmed ? (
                <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={3} />
              ) : (
                <Clock className="w-14 h-14 text-white" strokeWidth={3} />
              )}
            </div>
            
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {isConfirmed 
                ? (locale === 'ar' ? '🎉 تم تأكيد حجزك!' : '🎉 Booking Confirmed!')
                : (locale === 'ar' ? 'حجزك قيد المعالجة' : 'Booking Processing')}
            </h1>
            
            <p className="text-gray-600 text-lg mb-4">
              {isConfirmed 
                ? (locale === 'ar' ? 'تم إرسال تفاصيل الحجز إلى بريدك الإلكتروني' : "We've sent the booking details to your email")
                : (locale === 'ar' ? 'سنرسل تأكيد الحجز قريباً' : "We'll send confirmation shortly")}
            </p>
            
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border-2 border-purple-200">
              <span className="text-sm font-medium text-gray-600">{locale === 'ar' ? 'رقم المرجع:' : 'Reference:'}</span>
              <span className="font-mono font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{booking.reference}</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
              <span className="text-sm font-semibold text-gray-500">{locale === 'ar' ? 'تفاصيل الحجز' : 'Booking Details'}</span>
              <div className="flex-1 h-1 bg-gradient-to-r from-pink-600 to-orange-400 rounded-full"></div>
            </div>
          </div>

          <Card className="mb-8 rounded-xl shadow-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Building className="w-6 h-6" />
                {locale === 'ar' ? 'معلومات الحجز' : 'Booking Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Building className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{locale === 'ar' ? 'الفندق' : 'Hotel'}</p>
                    <p className="font-bold text-lg">Hotel #{booking.hotelId}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{locale === 'ar' ? 'المدينة' : 'City'}</p>
                    <p className="font-bold">{locale === 'ar' ? booking.city.nameAr : booking.city.nameEn}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{locale === 'ar' ? 'تاريخ الوصول' : 'Check-in'}</p>
                    <p className="font-bold">{booking.checkIn.toISOString().split('T')[0]}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{locale === 'ar' ? 'تاريخ المغادرة' : 'Check-out'}</p>
                    <p className="font-bold">{booking.checkOut.toISOString().split('T')[0]}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{locale === 'ar' ? 'اسم الضيف' : 'Guest Name'}</p>
                    <p className="font-bold">{guestInfo?.firstName} {guestInfo?.lastName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                    <p className="font-bold text-sm">{guestInfo?.email}</p>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-dashed pt-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-lg">{locale === 'ar' ? 'ملخص الفاتورة' : 'Payment Summary'}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-gray-700">
                      <span>{locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                      <span className="font-semibold">{(booking.total - booking.vat).toFixed(2)} {booking.currency}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                      <span>{locale === 'ar' ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)'}</span>
                      <span className="font-semibold">{booking.vat.toFixed(2)} {booking.currency}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t-2 border-white">
                      <span className="text-xl font-bold">{locale === 'ar' ? 'المجموع الكلي' : 'Total Paid'}</span>
                      <div className="text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {booking.total.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">{booking.currency}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="rounded-lg border-2 hover:bg-purple-50 hover:border-purple-600 transition-all shadow-lg" size="lg">
              <Calendar className="w-5 h-5 mr-2" />
              {locale === 'ar' ? 'إضافة للتقويم' : 'Add to Calendar'}
            </Button>
            <Button variant="outline" className="rounded-lg border-2 hover:bg-purple-50 hover:border-purple-600 transition-all shadow-lg" size="lg">
              <Download className="w-5 h-5 mr-2" />
              {locale === 'ar' ? 'تحميل التأكيد' : 'Download Confirmation'}
            </Button>
            <Button variant="outline" className="rounded-lg border-2 hover:bg-purple-50 hover:border-purple-600 transition-all shadow-lg" size="lg">
              <Printer className="w-5 h-5 mr-2" />
              {locale === 'ar' ? 'طباعة' : 'Print'}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
