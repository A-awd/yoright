'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

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
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {locale === 'ar' ? 'إتمام الحجز' : 'Complete Booking'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{locale === 'ar' ? 'بيانات الضيف' : 'Guest Details'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {locale === 'ar' ? 'الاسم الأول' : 'First Name'}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {locale === 'ar' ? 'اسم العائلة' : 'Last Name'}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {locale === 'ar' ? 'الرقم الضريبي (اختياري)' : 'VAT Number (Optional)'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.vatNumber}
                    onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading 
                    ? (locale === 'ar' ? 'جاري المعالجة...' : 'Processing...') 
                    : (locale === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>{locale === 'ar' ? 'ملخص الحجز' : 'Booking Summary'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {locale === 'ar' ? 'الفندق' : 'Hotel'}
                  </p>
                  <p className="font-semibold">Luxury Palace Hotel</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">{locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                    <span>1,500 {locale === 'ar' ? 'ر.س' : 'SAR'}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">{locale === 'ar' ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)'}</span>
                    <span>225 {locale === 'ar' ? 'ر.س' : 'SAR'}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>{locale === 'ar' ? 'المجموع' : 'Total'}</span>
                    <span>1,725 {locale === 'ar' ? 'ر.س' : 'SAR'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
