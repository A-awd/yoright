import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Language, Booking } from '../types';
import { api } from '../services/api';
import { Button, Card } from '../components/ui';

interface ConfirmationProps {
  lang: Language;
}

const SuccessCheckmark = () => (
  <div className="relative">
    <div className="w-24 h-24 mx-auto bg-success-500/10 rounded-full flex items-center justify-center animate-scale-in">
      <div className="w-16 h-16 bg-success-500/20 rounded-full flex items-center justify-center">
        <svg 
          className="w-10 h-10 text-success-600 animate-fade-in" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          style={{ animationDelay: '0.3s' }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={3} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      </div>
    </div>
    <div className="absolute inset-0 w-24 h-24 mx-auto">
      <div className="absolute inset-0 rounded-full border-4 border-success-500/30 animate-ping" style={{ animationDuration: '1.5s' }} />
    </div>
  </div>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const HotelIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Confirmation: React.FC<ConfirmationProps> = ({ lang }) => {
  const { ref } = useParams<{ ref: string }>();
  const isArabic = lang === Language.AR;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const handleCopyReference = async () => {
    if (booking?.reference) {
      try {
        await navigator.clipboard.writeText(booking.reference);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const checkInDate = booking ? new Date(booking.checkIn) : new Date();
  const checkOutDate = booking ? new Date(booking.checkOut) : new Date();
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-charcoal-600 font-medium">
            {isArabic ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <Card padding="lg" className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto bg-error-500/10 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900 mb-2">
            {isArabic ? 'الحجز غير موجود' : 'Booking Not Found'}
          </h1>
          <p className="text-charcoal-600 mb-6">
            {isArabic
              ? 'عذراً، لم نتمكن من العثور على تفاصيل الحجز. يرجى التحقق من رقم الحجز والمحاولة مرة أخرى.'
              : 'Sorry, we couldn\'t find the booking details. Please check the reference number and try again.'}
          </p>
          <Link to="/">
            <Button variant="primary" fullWidth>
              {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-2xl mx-auto">
          <Card padding="lg" className="text-center mb-6">
            <SuccessCheckmark />
            
            <h1 className="font-display text-3xl font-semibold text-charcoal-900 mt-6 mb-2">
              {isArabic ? 'تم تأكيد الحجز!' : 'Booking Confirmed!'}
            </h1>
            <p className="text-charcoal-600 mb-8">
              {isArabic
                ? 'شكراً لك! تم إرسال تفاصيل الحجز إلى بريدك الإلكتروني'
                : 'Thank you! Booking details have been sent to your email'}
            </p>

            <div className="bg-cream-100 rounded-2xl p-6 mb-8">
              <p className="text-sm text-charcoal-500 mb-2">
                {isArabic ? 'رقم الحجز' : 'Booking Reference'}
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-display text-3xl font-bold text-gold-600 tracking-wider">
                  {booking.reference}
                </span>
                <button
                  onClick={handleCopyReference}
                  className={`
                    p-2 rounded-xl transition-all duration-200
                    ${copied 
                      ? 'bg-success-500 text-white' 
                      : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'
                    }
                  `}
                  title={isArabic ? 'نسخ' : 'Copy'}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              {copied && (
                <p className="text-sm text-success-600 mt-2 animate-fade-in">
                  {isArabic ? 'تم النسخ!' : 'Copied!'}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 justify-center p-3 bg-gold-50 rounded-xl text-gold-700 text-sm">
              <EmailIcon />
              <span>
                {isArabic
                  ? 'تم إرسال تأكيد إلى بريدك الإلكتروني'
                  : 'A confirmation email has been sent to your inbox'}
              </span>
            </div>
          </Card>

          <Card padding="lg" className="mb-6">
            <h2 className="font-display text-lg font-semibold text-charcoal-900 mb-6">
              {isArabic ? 'تفاصيل الحجز' : 'Booking Details'}
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-cream-50 rounded-2xl">
                <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <HotelIcon />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-charcoal-500">
                    {isArabic ? 'الفندق' : 'Hotel'}
                  </p>
                  <p className="font-semibold text-charcoal-900">{booking.hotelName}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-cream-50 rounded-2xl">
                <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CalendarIcon />
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-charcoal-500">
                        {isArabic ? 'تسجيل الوصول' : 'Check-in'}
                      </p>
                      <p className="font-semibold text-charcoal-900">
                        {checkInDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-charcoal-500">{isArabic ? 'من 3:00 مساءً' : 'From 3:00 PM'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-charcoal-500">
                        {isArabic ? 'تسجيل المغادرة' : 'Check-out'}
                      </p>
                      <p className="font-semibold text-charcoal-900">
                        {checkOutDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-charcoal-500">{isArabic ? 'حتى 12:00 ظهراً' : 'Until 12:00 PM'}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gold-600 font-medium mt-2">
                    {nights} {isArabic ? 'ليالي' : 'nights'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-cream-50 rounded-2xl">
                <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <UserIcon />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-charcoal-500">
                    {isArabic ? 'اسم الضيف' : 'Guest Name'}
                  </p>
                  <p className="font-semibold text-charcoal-900">{booking.guestName}</p>
                  <p className="text-sm text-charcoal-500 mt-1">{booking.roomName}</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-gold-50 rounded-2xl">
                <span className="font-semibold text-charcoal-900">
                  {isArabic ? 'المبلغ الإجمالي' : 'Total Amount'}
                </span>
                <span className="text-2xl font-bold text-gold-600">
                  {booking.totalPrice.toLocaleString()} {booking.currency}
                </span>
              </div>

              <div className="flex items-center gap-2 p-3 bg-success-500/10 rounded-xl">
                <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-success-600 font-medium">
                  {isArabic ? 'الحالة: ' : 'Status: '}{booking.status}
                </span>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="mb-6">
            <h2 className="font-display text-lg font-semibold text-charcoal-900 mb-4">
              {isArabic ? 'معلومات الاتصال بالفندق' : 'Hotel Contact Information'}
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-charcoal-700">
                <div className="w-8 h-8 bg-charcoal-100 rounded-lg flex items-center justify-center">
                  <PhoneIcon />
                </div>
                <span>+966 11 XXX XXXX</span>
              </div>
              <div className="flex items-center gap-3 text-charcoal-700">
                <div className="w-8 h-8 bg-charcoal-100 rounded-lg flex items-center justify-center">
                  <EmailIcon />
                </div>
                <span>reservations@hotel.com</span>
              </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/my-trips" className="flex-1">
              <Button variant="primary" fullWidth size="lg">
                {isArabic ? 'عرض تفاصيل الحجز' : 'View Booking Details'}
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="secondary" fullWidth size="lg">
                {isArabic ? 'متابعة التصفح' : 'Continue Browsing'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
