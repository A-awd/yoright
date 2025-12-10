import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Language, Hotel } from '../types';
import { api } from '../services/api';
import { Button, Input, Select, Card } from '../components/ui';

interface CheckoutProps {
  lang: Language;
}

type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'pay_at_hotel';

const steps = [
  { id: 1, en: 'Room Selection', ar: 'اختيار الغرفة' },
  { id: 2, en: 'Guest Details', ar: 'بيانات الضيف' },
  { id: 3, en: 'Payment', ar: 'الدفع' },
  { id: 4, en: 'Confirmation', ar: 'التأكيد' },
];

const titleOptions = [
  { value: 'mr', label: 'Mr.' },
  { value: 'mrs', label: 'Mrs.' },
  { value: 'ms', label: 'Ms.' },
  { value: 'dr', label: 'Dr.' },
];

const arrivalTimeOptions = [
  { value: '14:00', label: '2:00 PM - 3:00 PM' },
  { value: '15:00', label: '3:00 PM - 4:00 PM' },
  { value: '16:00', label: '4:00 PM - 5:00 PM' },
  { value: '17:00', label: '5:00 PM - 6:00 PM' },
  { value: '18:00', label: '6:00 PM - 7:00 PM' },
  { value: '19:00', label: '7:00 PM - 8:00 PM' },
  { value: '20:00', label: 'After 8:00 PM' },
];

const countryCodeOptions = [
  { value: '+966', label: '+966 (SA)' },
  { value: '+971', label: '+971 (UAE)' },
  { value: '+1', label: '+1 (US)' },
  { value: '+44', label: '+44 (UK)' },
  { value: '+91', label: '+91 (IN)' },
];

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4 text-brand-800" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const Checkout: React.FC<CheckoutProps> = ({ lang }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;
  const [currentStep, setCurrentStep] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [saveCard, setSaveCard] = useState(false);

  const [formData, setFormData] = useState({
    title: 'mr',
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+966',
    phone: '',
    specialRequests: '',
    arrivalTime: '14:00',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const hotelId = searchParams.get('hotelId');
  const roomId = searchParams.get('roomId');
  const checkIn = searchParams.get('checkIn') || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const checkOut = searchParams.get('checkOut') || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const guests = parseInt(searchParams.get('guests') || '2');

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  const selectedRoom = hotel?.rooms?.find(r => r.id === roomId) || hotel?.rooms?.[0];
  const roomRate = selectedRoom?.price || 500;
  const subtotal = roomRate * nights;
  const taxRate = 0.15;
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes;

  useEffect(() => {
    const fetchHotel = async () => {
      if (!hotelId) return;
      try {
        const data = await api.hotels.getById(hotelId);
        setHotel(data);
      } catch (error) {
        console.error('Failed to fetch hotel:', error);
      }
    };
    fetchHotel();
  }, [hotelId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelId || !termsAccepted) return;

    try {
      setLoading(true);
      setCurrentStep(3);

      const booking = await api.bookings.create({
        hotelId,
        cityId: hotel?.cityId || 'unknown',
        roomData: { 
          roomId: roomId || 'room-1', 
          roomName: selectedRoom?.nameEn || 'Standard Room',
          price: roomRate,
        },
        guestInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: `${formData.countryCode}${formData.phone}`,
        },
        checkIn,
        checkOut,
        total,
        vat: taxes,
        currency: 'SAR',
      });

      setCurrentStep(4);
      navigate(`/confirmation/${booking.reference}`);
    } catch (error) {
      console.error('Failed to create booking:', error);
      setCurrentStep(2);
      alert(isArabic ? 'فشل إنشاء الحجز' : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const ProgressStepper = () => (
    <div className="mb-8 lg:mb-12">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-300
                  ${step.id < currentStep
                    ? 'bg-brand-800 text-charcoal-950'
                    : step.id === currentStep
                    ? 'bg-brand-800 text-charcoal-950 ring-4 ring-gold-200'
                    : 'bg-charcoal-100 text-charcoal-400'
                  }
                `}
              >
                {step.id < currentStep ? <CheckIcon /> : step.id}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium hidden sm:block
                  ${step.id <= currentStep ? 'text-charcoal-800' : 'text-charcoal-400'}
                `}
              >
                {isArabic ? step.ar : step.en}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-2 sm:mx-4 transition-colors duration-300
                  ${step.id < currentStep ? 'bg-brand-800' : 'bg-charcoal-200'}
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const BookingSummary = () => (
    <Card padding="none" className="sticky top-4 overflow-hidden">
      {hotel?.thumbnail && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={hotel.thumbnail}
            alt={isArabic ? hotel.nameAr : hotel.nameEn}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-charcoal-900">
              {hotel ? (isArabic ? hotel.nameAr : hotel.nameEn) : (isArabic ? 'الفندق' : 'Hotel')}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(hotel?.stars || 5)].map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 py-4 border-y border-charcoal-100">
          <div className="flex items-center gap-3 text-charcoal-700">
            <CalendarIcon />
            <div className="flex-1">
              <div className="flex justify-between text-sm">
                <span>{isArabic ? 'تسجيل الوصول' : 'Check-in'}</span>
                <span className="font-medium">{checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>{isArabic ? 'تسجيل المغادرة' : 'Check-out'}</span>
                <span className="font-medium">{checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-charcoal-700">
            <UsersIcon />
            <span className="text-sm">{guests} {isArabic ? 'ضيوف' : 'Guests'} · {nights} {isArabic ? 'ليالي' : 'Nights'}</span>
          </div>

          {selectedRoom && (
            <div className="bg-cream-50 rounded-xl p-3">
              <p className="text-sm font-medium text-charcoal-800">
                {isArabic ? selectedRoom.nameAr : selectedRoom.nameEn}
              </p>
              <p className="text-xs text-charcoal-500 mt-1">
                {selectedRoom.bedType} · {isArabic ? 'حتى' : 'Up to'} {selectedRoom.capacity} {isArabic ? 'ضيوف' : 'guests'}
              </p>
            </div>
          )}
        </div>

        <div className="pt-4 space-y-2">
          <div className="flex justify-between text-sm text-charcoal-600">
            <span>{roomRate.toLocaleString()} SAR × {nights} {isArabic ? 'ليالي' : 'nights'}</span>
            <span>{subtotal.toLocaleString()} SAR</span>
          </div>
          <div className="flex justify-between text-sm text-charcoal-600">
            <span>{isArabic ? 'الضرائب والرسوم' : 'Taxes & fees'} (15%)</span>
            <span>{taxes.toLocaleString()} SAR</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-charcoal-100">
            <span className="text-lg font-semibold text-charcoal-900">{isArabic ? 'المجموع' : 'Total'}</span>
            <span className="text-xl font-bold text-brand-900">{total.toLocaleString()} SAR</span>
          </div>
        </div>

        {selectedRoom?.freeCancellation && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-success-500/10 rounded-xl">
            <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-success-600 font-medium">
              {isArabic ? 'إلغاء مجاني متاح' : 'Free cancellation available'}
            </span>
          </div>
        )}
      </div>
    </Card>
  );

  const PaymentMethodCard = ({ method, icon, label, disabled = false }: { method: PaymentMethod; icon: React.ReactNode; label: string; disabled?: boolean }) => (
    <button
      type="button"
      onClick={() => !disabled && setPaymentMethod(method)}
      disabled={disabled}
      className={`
        relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all
        ${paymentMethod === method
          ? 'border-brand-800 bg-gold-50'
          : disabled
          ? 'border-charcoal-100 bg-charcoal-50 opacity-50 cursor-not-allowed'
          : 'border-charcoal-200 hover:border-charcoal-300 bg-white'
        }
      `}
    >
      <div className={`${paymentMethod === method ? 'text-brand-900' : 'text-charcoal-500'}`}>
        {icon}
      </div>
      <span className={`font-medium ${paymentMethod === method ? 'text-charcoal-900' : 'text-charcoal-700'}`}>
        {label}
      </span>
      {paymentMethod === method && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-brand-800 rounded-full flex items-center justify-center">
          <CheckIcon />
        </div>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container mx-auto px-4 py-6 lg:py-10">
        <ProgressStepper />

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card padding="lg">
                <h2 className="font-display text-xl font-semibold text-charcoal-900 mb-6">
                  {isArabic ? 'بيانات الضيف الرئيسي' : 'Primary Guest Details'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label={isArabic ? 'اللقب' : 'Title'}
                    options={titleOptions}
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                  <div className="hidden sm:block" />

                  <Input
                    label={isArabic ? 'الاسم الأول' : 'First Name'}
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />

                  <Input
                    label={isArabic ? 'اسم العائلة' : 'Last Name'}
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />

                  <Input
                    label={isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="sm:col-span-2"
                  />

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                      {isArabic ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <div className="flex gap-2">
                      <div className="w-32">
                        <Select
                          options={countryCodeOptions}
                          value={formData.countryCode}
                          onChange={(e) => handleInputChange('countryCode', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="5XX XXX XXXX"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Select
                    label={isArabic ? 'الوقت المتوقع للوصول' : 'Expected Arrival Time'}
                    options={arrivalTimeOptions}
                    value={formData.arrivalTime}
                    onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                    className="sm:col-span-2"
                  />

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                      {isArabic ? 'طلبات خاصة' : 'Special Requests'}
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      placeholder={isArabic ? 'أي طلبات خاصة للفندق...' : 'Any special requests for the hotel...'}
                      rows={3}
                      className="w-full px-4 py-3.5 rounded-2xl bg-white border-2 border-charcoal-200 
                        focus:border-brand-800 focus:outline-none focus:ring-0 transition-all duration-200
                        text-charcoal-900 placeholder:text-charcoal-400 resize-none"
                    />
                    <p className="mt-1 text-xs text-charcoal-500">
                      {isArabic ? 'الطلبات الخاصة لا يمكن ضمانها' : 'Special requests cannot be guaranteed'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <h2 className="font-display text-xl font-semibold text-charcoal-900 mb-6">
                  {isArabic ? 'طريقة الدفع' : 'Payment Method'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <PaymentMethodCard
                    method="card"
                    icon={<CreditCardIcon />}
                    label={isArabic ? 'بطاقة ائتمان/خصم' : 'Credit/Debit Card'}
                  />
                  <PaymentMethodCard
                    method="apple_pay"
                    icon={
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                    }
                    label="Apple Pay"
                    disabled
                  />
                  <PaymentMethodCard
                    method="google_pay"
                    icon={
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                      </svg>
                    }
                    label="Google Pay"
                    disabled
                  />
                  <PaymentMethodCard
                    method="pay_at_hotel"
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    }
                    label={isArabic ? 'الدفع في الفندق' : 'Pay at Hotel'}
                  />
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4 p-4 bg-charcoal-50 rounded-2xl">
                    <Input
                      label={isArabic ? 'رقم البطاقة' : 'Card Number'}
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      leftIcon={<CreditCardIcon />}
                      maxLength={19}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label={isArabic ? 'تاريخ الانتهاء' : 'Expiry Date'}
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      <Input
                        label="CVV"
                        type="password"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="•••"
                        maxLength={4}
                      />
                    </div>

                    <Input
                      label={isArabic ? 'اسم حامل البطاقة' : 'Cardholder Name'}
                      value={formData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      placeholder="JOHN DOE"
                    />

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="w-5 h-5 rounded-lg border-2 border-charcoal-300 text-brand-800 
                          focus:ring-brand-600 focus:ring-offset-0"
                      />
                      <span className="text-sm text-charcoal-700">
                        {isArabic ? 'حفظ البطاقة للحجوزات المستقبلية' : 'Save card for future bookings'}
                      </span>
                    </label>

                    <div className="flex items-center gap-2 pt-2 text-charcoal-500">
                      <LockIcon />
                      <span className="text-xs">
                        {isArabic ? 'معاملتك مشفرة وآمنة' : 'Your transaction is encrypted and secure'}
                      </span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'pay_at_hotel' && (
                  <div className="p-4 bg-cream-100 rounded-2xl">
                    <p className="text-sm text-charcoal-700">
                      {isArabic
                        ? 'ستدفع عند الوصول إلى الفندق. يلزم تقديم بطاقة ائتمان صالحة كضمان.'
                        : 'You will pay upon arrival at the hotel. A valid credit card is required as a guarantee.'}
                    </p>
                  </div>
                )}
              </Card>

              <Card padding="lg">
                <h2 className="font-display text-xl font-semibold text-charcoal-900 mb-4">
                  {isArabic ? 'الشروط والأحكام' : 'Terms & Conditions'}
                </h2>

                <div className="space-y-4">
                  <div className="p-4 bg-cream-50 rounded-2xl text-sm text-charcoal-600">
                    <p className="font-medium text-charcoal-800 mb-2">
                      {isArabic ? 'سياسة الإلغاء' : 'Cancellation Policy'}
                    </p>
                    <p>
                      {selectedRoom?.freeCancellation
                        ? (isArabic
                          ? 'إلغاء مجاني حتى 24 ساعة قبل تسجيل الوصول. بعد ذلك، سيتم تحصيل رسوم ليلة واحدة.'
                          : 'Free cancellation up to 24 hours before check-in. After that, one night will be charged.')
                        : (isArabic
                          ? 'هذا الحجز غير قابل للاسترداد.'
                          : 'This booking is non-refundable.')}
                    </p>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      required
                      className="w-5 h-5 mt-0.5 rounded-lg border-2 border-charcoal-300 text-brand-800 
                        focus:ring-brand-600 focus:ring-offset-0"
                    />
                    <span className="text-sm text-charcoal-700">
                      {isArabic
                        ? 'أوافق على الشروط والأحكام وسياسة الخصوصية وسياسة الإلغاء'
                        : 'I agree to the '}
                      {!isArabic && (
                        <>
                          <a href="/terms" className="text-brand-900 hover:underline">Terms & Conditions</a>
                          {', '}
                          <a href="/privacy" className="text-brand-900 hover:underline">Privacy Policy</a>
                          {', and Cancellation Policy'}
                        </>
                      )}
                    </span>
                  </label>
                </div>
              </Card>

              <div className="lg:hidden">
                <BookingSummary />
              </div>

              <div className="sticky bottom-0 bg-cream-50 pt-4 pb-6 -mx-4 px-4 lg:static lg:bg-transparent lg:p-0">
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={loading}
                  disabled={!termsAccepted}
                  leftIcon={!loading && <LockIcon />}
                >
                  {loading
                    ? (isArabic ? 'جاري المعالجة...' : 'Processing...')
                    : (isArabic ? 'إتمام الحجز' : 'Complete Booking')}
                </Button>
                <p className="mt-3 text-center text-xs text-charcoal-500">
                  {isArabic
                    ? 'بالضغط على "إتمام الحجز"، فإنك توافق على شروطنا'
                    : 'By clicking "Complete Booking", you agree to our terms'}
                </p>
              </div>
            </form>
          </div>

          <div className="hidden lg:block">
            <BookingSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
