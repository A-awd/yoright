'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, FileText, CreditCard, Calendar, Building, ShieldCheck, Loader2 } from 'lucide-react';

export default function CheckoutPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    vatNumber: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: 'hotel-1',
          roomId: 'room-1',
          checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          guestInfo: {
            ...formData,
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
          },
          currency: 'SAR',
          total: 1500,
        }),
      });

      const data = await response.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      router.push(`/${locale}/bookings/${data.reference}`);
    } catch (error) {
      console.error('Booking error:', error);
      alert(locale === 'ar' ? 'حدث خطأ في الحجز' : 'Booking error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-primary/5 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-brand-primary to-brand-primary-light bg-clip-text text-transparent">
            {locale === 'ar' ? 'إتمام الحجز' : 'Complete Your Booking'}
          </h1>
          <p className="text-gray-600">
            {locale === 'ar' ? 'نحن على بعد خطوة واحدة من تأكيد حجزك' : "We're just one step away from confirming your reservation"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="rounded-xl shadow-lg border-0">
              <CardHeader className="border-b bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="w-6 h-6 text-brand-primary" />
                  {locale === 'ar' ? 'بيانات الضيف' : 'Guest Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-brand-primary" />
                        {locale === 'ar' ? 'الاسم الأول' : 'First Name'}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition outline-none"
                        placeholder={locale === 'ar' ? 'أدخل الاسم الأول' : 'Enter first name'}
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-brand-primary" />
                        {locale === 'ar' ? 'اسم العائلة' : 'Last Name'}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition outline-none"
                        placeholder={locale === 'ar' ? 'أدخل اسم العائلة' : 'Enter last name'}
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-brand-primary" />
                      {locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition outline-none"
                      placeholder={locale === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter email address'}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-brand-primary" />
                      {locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition outline-none"
                      placeholder={locale === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-primary" />
                      {locale === 'ar' ? 'الرقم الضريبي (اختياري)' : 'VAT Number (Optional)'}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition outline-none"
                      placeholder={locale === 'ar' ? 'أدخل الرقم الضريبي' : 'Enter VAT number'}
                      value={formData.vatNumber}
                      onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                    />
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">{locale === 'ar' ? 'معلوماتك آمنة' : 'Your information is secure'}</p>
                      <p className="text-blue-600">{locale === 'ar' ? 'نستخدم تشفير SSL لحماية بياناتك الشخصية والمالية' : 'We use SSL encryption to protect your personal and financial data'}</p>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg bg-gradient-to-r from-brand-primary to-brand-primary-light hover:from-purple-700 hover:to-pink-700 rounded-lg shadow-lg hover:shadow-xl transition-all" 
                    size="lg" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {locale === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        {locale === 'ar' ? 'تأكيد الحجز والدفع' : 'Confirm Booking & Pay'}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24 rounded-xl shadow-lg border-0">
              <CardHeader className="border-b bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10">
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-brand-primary" />
                  {locale === 'ar' ? 'ملخص الحجز' : 'Booking Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  <div className="pb-4 border-b">
                    <p className="text-sm text-gray-500 mb-1.5">
                      {locale === 'ar' ? 'الفندق' : 'Hotel'}
                    </p>
                    <p className="font-bold text-lg">Luxury Palace Hotel</p>
                  </div>

                  <div className="space-y-3 pb-4 border-b">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-brand-primary" />
                      <div>
                        <p className="text-gray-500">{locale === 'ar' ? 'تاريخ الوصول' : 'Check-in'}</p>
                        <p className="font-semibold">{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-brand-primary" />
                      <div>
                        <p className="text-gray-500">{locale === 'ar' ? 'تاريخ المغادرة' : 'Check-out'}</p>
                        <p className="font-semibold">{new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pb-4 border-b">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                      <span className="font-semibold">1,500 {locale === 'ar' ? 'ر.س' : 'SAR'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{locale === 'ar' ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)'}</span>
                      <span className="font-semibold">225 {locale === 'ar' ? 'ر.س' : 'SAR'}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-bold">{locale === 'ar' ? 'المجموع الكلي' : 'Total Amount'}</span>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-brand-primary to-brand-primary-light bg-clip-text text-transparent">
                        1,725
                      </div>
                      <div className="text-sm text-gray-500">{locale === 'ar' ? 'ر.س' : 'SAR'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
