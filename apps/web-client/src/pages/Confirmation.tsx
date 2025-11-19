import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Language, Booking } from '../types';
import { api } from '../services/api';

interface ConfirmationProps {
  lang: Language;
}

const Confirmation: React.FC<ConfirmationProps> = ({ lang }) => {
  const { ref } = useParams<{ ref: string }>();
  const isArabic = lang === Language.AR;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!ref) return;
      try {
        setLoading(true);
        const data = await api.bookings.getByReference(ref);
        setBooking(data);
      } catch (error) {
        console.error('Failed to fetch booking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [ref]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary-600"></i>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <i className="fas fa-times-circle text-6xl text-red-500 mb-4"></i>
        <p className="text-xl text-gray-600">
          {isArabic ? 'الحجز غير موجود' : 'Booking not found'}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
        <h1 className="text-3xl font-bold text-primary-600 mb-2">
          {isArabic ? 'تم الحجز بنجاح!' : 'Booking Confirmed!'}
        </h1>
        <p className="text-gray-600 mb-6">
          {isArabic
            ? 'شكراً لك! تم إرسال تفاصيل الحجز إلى بريدك الإلكتروني'
            : 'Thank you! Booking details have been sent to your email'}
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">
                {isArabic ? 'رقم الحجز' : 'Reference'}
              </span>
              <p className="font-bold text-primary-600">{booking.reference}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {isArabic ? 'الحالة' : 'Status'}
              </span>
              <p className="font-bold text-green-600">{booking.status}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {isArabic ? 'الفندق' : 'Hotel'}
              </span>
              <p className="font-bold">{booking.hotelName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {isArabic ? 'الغرفة' : 'Room'}
              </span>
              <p className="font-bold">{booking.roomName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {isArabic ? 'تسجيل الوصول' : 'Check-in'}
              </span>
              <p className="font-bold">{new Date(booking.checkIn).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {isArabic ? 'تسجيل المغادرة' : 'Check-out'}
              </span>
              <p className="font-bold">{new Date(booking.checkOut).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {isArabic ? 'اسم الضيف' : 'Guest Name'}
              </span>
              <p className="font-bold">{booking.guestName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {isArabic ? 'المبلغ الإجمالي' : 'Total Amount'}
              </span>
              <p className="font-bold text-accent-500">
                {booking.totalPrice} {booking.currency}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            to="/my-trips"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition font-semibold"
          >
            <i className="fas fa-suitcase mr-2"></i>
            {isArabic ? 'رحلاتي' : 'My Trips'}
          </Link>
          <Link
            to="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition font-semibold"
          >
            <i className="fas fa-home mr-2"></i>
            {isArabic ? 'الصفحة الرئيسية' : 'Home'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
