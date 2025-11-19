import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { api } from '../services/api';

interface CheckoutProps {
  lang: Language;
}

const Checkout: React.FC<CheckoutProps> = ({ lang }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const hotelId = searchParams.get('hotelId');
  const roomId = searchParams.get('roomId');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelId || !roomId) return;

    try {
      setLoading(true);
      const booking = await api.bookings.create({
        hotelId,
        roomId,
        checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        guests: [
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          },
        ],
        totals: {
          subtotal: 1500,
          vat: 225,
          total: 1725,
        },
      });

      navigate(`/confirmation/${booking.reference}`);
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert(isArabic ? 'فشل إنشاء الحجز' : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">
        {isArabic ? 'إتمام الحجز' : 'Complete Booking'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-primary-600 mb-4">
            {isArabic ? 'معلومات الضيف' : 'Guest Information'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                {isArabic ? 'الاسم الأول' : 'First Name'}
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {isArabic ? 'اسم العائلة' : 'Last Name'}
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {isArabic ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {isArabic ? 'رقم الهاتف' : 'Phone'}
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-bold text-primary-600 mb-4">
            {isArabic ? 'ملخص الحجز' : 'Booking Summary'}
          </h2>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>{isArabic ? 'المجموع الفرعي' : 'Subtotal'}</span>
              <span>1,500 {isArabic ? 'ر.س' : 'SAR'}</span>
            </div>
            <div className="flex justify-between">
              <span>{isArabic ? 'ضريبة القيمة المضافة' : 'VAT'}</span>
              <span>225 {isArabic ? 'ر.س' : 'SAR'}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>{isArabic ? 'المجموع' : 'Total'}</span>
              <span>1,725 {isArabic ? 'ر.س' : 'SAR'}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin mr-2"></i>
          ) : (
            <i className="fas fa-check mr-2"></i>
          )}
          {isArabic ? 'تأكيد الحجز' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
