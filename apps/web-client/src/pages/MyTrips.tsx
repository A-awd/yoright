import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language, BookingStatus } from '../types';
import { Button, Card, Badge } from '../components/ui';
import { api } from '../services/api';

interface MyTripsProps {
  lang: Language;
}

type TabType = 'upcoming' | 'past' | 'cancelled';

interface Trip {
  id: string;
  reference: string;
  hotelName: string;
  hotelNameAr: string;
  hotelImage: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  roomType: string;
  roomTypeAr: string;
  guests: number;
  totalPrice: number;
  hasReview?: boolean;
  hotelId?: string;
}

const MyTrips: React.FC<MyTripsProps> = ({ lang }) => {
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [bookings, setBookings] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await api.bookings.getMyBookings();
        
        const mappedTrips: Trip[] = response.map((booking: any) => {
          const roomData = booking.roomJson ? (typeof booking.roomJson === 'string' ? JSON.parse(booking.roomJson) : booking.roomJson) : {};
          const guestData = booking.guestJson ? (typeof booking.guestJson === 'string' ? JSON.parse(booking.guestJson) : booking.guestJson) : {};
          
          return {
            id: booking.id || booking.reference,
            reference: booking.reference,
            hotelName: roomData.hotelName || roomData.hotelNameEn || booking.hotelName || 'Hotel',
            hotelNameAr: roomData.hotelNameAr || roomData.hotelName || booking.hotelName || 'فندق',
            hotelImage: roomData.image || roomData.hotelImage || `https://picsum.photos/400/250?random=${booking.reference}`,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            status: booking.status as BookingStatus,
            roomType: roomData.roomName || roomData.roomType || roomData.nameEn || 'Standard Room',
            roomTypeAr: roomData.roomNameAr || roomData.nameAr || roomData.roomName || 'غرفة قياسية',
            guests: guestData.adults || guestData.guests || 2,
            totalPrice: booking.total || booking.totalPrice || 0,
            hasReview: false,
            hotelId: booking.hotelId,
          };
        });
        
        setBookings(mappedTrips);
      } catch (err: any) {
        console.error('Failed to fetch bookings:', err);
        if (err.message?.includes('unauthorized') || err.message?.includes('401')) {
          setIsLoggedIn(false);
        } else {
          setError(err.message || 'Failed to load bookings');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTrips = bookings.filter(trip => {
    if (trip.status === BookingStatus.CANCELLED) return false;
    const checkInDate = new Date(trip.checkIn);
    return checkInDate >= today;
  });

  const pastTrips = bookings.filter(trip => {
    if (trip.status === BookingStatus.CANCELLED) return false;
    const checkOutDate = new Date(trip.checkOut);
    return checkOutDate < today;
  });

  const cancelledTrips = bookings.filter(trip => trip.status === BookingStatus.CANCELLED);

  const getDaysUntilTrip = (checkIn: string): number => {
    const tripDate = new Date(checkIn);
    const diffTime = tripDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', options);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return <Badge variant="success">{isArabic ? 'مؤكد' : 'Confirmed'}</Badge>;
      case BookingStatus.PENDING:
        return <Badge variant="warning">{isArabic ? 'قيد الانتظار' : 'Pending'}</Badge>;
      case BookingStatus.CANCELLED:
        return <Badge variant="error">{isArabic ? 'ملغي' : 'Cancelled'}</Badge>;
    }
  };

  const getCurrentTrips = (): Trip[] => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingTrips;
      case 'past':
        return pastTrips;
      case 'cancelled':
        return cancelledTrips;
    }
  };

  const tabs: { id: TabType; labelEn: string; labelAr: string; count: number }[] = [
    { id: 'upcoming', labelEn: 'Upcoming', labelAr: 'القادمة', count: upcomingTrips.length },
    { id: 'past', labelEn: 'Past', labelAr: 'السابقة', count: pastTrips.length },
    { id: 'cancelled', labelEn: 'Cancelled', labelAr: 'الملغاة', count: cancelledTrips.length },
  ];

  const TripCard: React.FC<{ trip: Trip }> = ({ trip }) => {
    const daysUntil = getDaysUntilTrip(trip.checkIn);
    const isUpcoming = activeTab === 'upcoming';
    const isPast = activeTab === 'past';
    const isCancellable = isUpcoming && daysUntil > 2;

    return (
      <Card padding="none" className="overflow-hidden">
        <div className="relative h-48">
          <img
            src={trip.hotelImage}
            alt={isArabic ? trip.hotelNameAr : trip.hotelName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent"></div>
          <div className="absolute top-3 left-3">
            {getStatusBadge(trip.status)}
          </div>
          {isUpcoming && daysUntil > 0 && (
            <div className="absolute top-3 right-3 bg-brand-800 text-charcoal-900 px-3 py-1.5 rounded-xl font-semibold text-sm">
              {isArabic ? `${daysUntil} يوم` : `${daysUntil} days`}
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-display font-bold text-white mb-1">
              {isArabic ? trip.hotelNameAr : trip.hotelName}
            </h3>
            <p className="text-cream-200 text-sm">
              {isArabic ? trip.roomTypeAr : trip.roomType}
            </p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-charcoal-500 mb-0.5">{isArabic ? 'تسجيل الوصول' : 'Check-in'}</p>
                <p className="font-semibold text-charcoal-800">{formatDate(trip.checkIn)}</p>
              </div>
              <div className="text-charcoal-300">
                <i className="fas fa-arrow-right"></i>
              </div>
              <div>
                <p className="text-xs text-charcoal-500 mb-0.5">{isArabic ? 'المغادرة' : 'Check-out'}</p>
                <p className="font-semibold text-charcoal-800">{formatDate(trip.checkOut)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-charcoal-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-charcoal-600">
                <i className="fas fa-user-friends text-sm"></i>
                <span className="text-sm">{trip.guests} {isArabic ? 'ضيف' : 'Guests'}</span>
              </div>
              <div className="text-charcoal-300">•</div>
              <div className="text-sm text-charcoal-500">
                {isArabic ? 'الرقم المرجعي:' : 'Ref:'} <span className="font-mono">{trip.reference}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-brand-900">SAR {trip.totalPrice.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              variant="primary" 
              size="sm" 
              fullWidth
              onClick={() => navigate(`/booking/${trip.reference}`)}
            >
              {isArabic ? 'عرض التفاصيل' : 'View Details'}
            </Button>
            
            {isPast && (
              <>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  fullWidth
                  onClick={() => navigate(`/hotel/${trip.hotelId || trip.id}`)}
                >
                  {isArabic ? 'احجز مرة أخرى' : 'Book Again'}
                </Button>
                {!trip.hasReview && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="border border-brand-600 text-brand-900"
                  >
                    <i className="fas fa-star mr-1.5"></i>
                    {isArabic ? 'تقييم' : 'Review'}
                  </Button>
                )}
              </>
            )}
            
            {isCancellable && (
              <button className="text-sm text-error-500 hover:text-error-600 transition-colors">
                {isArabic ? 'إلغاء الحجز' : 'Cancel'}
              </button>
            )}
          </div>

          {isPast && trip.hasReview && (
            <div className="flex items-center gap-2 pt-2 text-sm text-charcoal-500">
              <i className="fas fa-check-circle text-success-500"></i>
              {isArabic ? 'تم إضافة تقييمك' : 'Review submitted'}
            </div>
          )}
        </div>
      </Card>
    );
  };

  const EmptyState: React.FC<{ type: TabType }> = ({ type }) => {
    const content = {
      upcoming: {
        icon: 'fa-plane-departure',
        titleEn: 'No upcoming trips',
        titleAr: 'لا توجد رحلات قادمة',
        descEn: 'Your next adventure awaits! Start exploring luxury hotels.',
        descAr: 'مغامرتك القادمة في انتظارك! ابدأ باستكشاف الفنادق الفاخرة.',
        buttonEn: 'Start Exploring',
        buttonAr: 'ابدأ الاستكشاف',
        showButton: true,
      },
      past: {
        icon: 'fa-history',
        titleEn: 'No past trips yet',
        titleAr: 'لا توجد رحلات سابقة',
        descEn: 'Your travel history will appear here after your first trip.',
        descAr: 'سيظهر سجل سفرك هنا بعد رحلتك الأولى.',
        buttonEn: '',
        buttonAr: '',
        showButton: false,
      },
      cancelled: {
        icon: 'fa-ban',
        titleEn: 'No cancelled bookings',
        titleAr: 'لا توجد حجوزات ملغاة',
        descEn: 'You haven\'t cancelled any bookings.',
        descAr: 'لم تقم بإلغاء أي حجوزات.',
        buttonEn: '',
        buttonAr: '',
        showButton: false,
      },
    };

    const c = content[type];

    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 bg-cream-200 rounded-full flex items-center justify-center mb-6">
          <i className={`fas ${c.icon} text-4xl text-charcoal-400`}></i>
        </div>
        <h3 className="text-xl font-display font-semibold text-charcoal-800 mb-2">
          {isArabic ? c.titleAr : c.titleEn}
        </h3>
        <p className="text-charcoal-500 text-center max-w-sm mb-6">
          {isArabic ? c.descAr : c.descEn}
        </p>
        {c.showButton && (
          <Button onClick={() => navigate('/search')}>
            {isArabic ? c.buttonAr : c.buttonEn}
          </Button>
        )}
      </div>
    );
  };

  const LoginPrompt: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-cream-200 rounded-full flex items-center justify-center mb-6">
        <i className="fas fa-user-lock text-4xl text-charcoal-400"></i>
      </div>
      <h3 className="text-xl font-display font-semibold text-charcoal-800 mb-2">
        {isArabic ? 'يرجى تسجيل الدخول' : 'Please Sign In'}
      </h3>
      <p className="text-charcoal-500 text-center max-w-sm mb-6">
        {isArabic 
          ? 'يجب تسجيل الدخول لعرض حجوزاتك ورحلاتك'
          : 'You need to sign in to view your bookings and trips'}
      </p>
      <div className="flex gap-3">
        <Button onClick={() => navigate('/login')}>
          {isArabic ? 'تسجيل الدخول' : 'Sign In'}
        </Button>
        <Button variant="secondary" onClick={() => navigate('/signup')}>
          {isArabic ? 'إنشاء حساب' : 'Create Account'}
        </Button>
      </div>
    </div>
  );

  const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-12 h-12 border-4 border-charcoal-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
      <p className="text-charcoal-500">
        {isArabic ? 'جاري تحميل رحلاتك...' : 'Loading your trips...'}
      </p>
    </div>
  );

  const ErrorState: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-error-100 rounded-full flex items-center justify-center mb-6">
        <i className="fas fa-exclamation-triangle text-4xl text-error-500"></i>
      </div>
      <h3 className="text-xl font-display font-semibold text-charcoal-800 mb-2">
        {isArabic ? 'حدث خطأ' : 'Something went wrong'}
      </h3>
      <p className="text-charcoal-500 text-center max-w-sm mb-6">
        {error || (isArabic ? 'تعذر تحميل رحلاتك. يرجى المحاولة مرة أخرى.' : 'Failed to load your trips. Please try again.')}
      </p>
      <Button onClick={() => window.location.reload()}>
        {isArabic ? 'إعادة المحاولة' : 'Try Again'}
      </Button>
    </div>
  );

  const currentTrips = getCurrentTrips();

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen bg-cream-100 pb-24 ${isArabic ? 'rtl' : 'ltr'}`}>
        <div className="bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 pt-12 pb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              {isArabic ? 'رحلاتي' : 'My Trips'}
            </h1>
            <p className="text-charcoal-300">
              {isArabic ? 'إدارة حجوزاتك ورحلاتك' : 'Manage your bookings and travel history'}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-6">
          <Card>
            <LoginPrompt />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-100 pb-24 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {isArabic ? 'رحلاتي' : 'My Trips'}
          </h1>
          <p className="text-charcoal-300">
            {isArabic ? 'إدارة حجوزاتك ورحلاتك' : 'Manage your bookings and travel history'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {loading ? (
          <Card className="mt-6">
            <LoadingSpinner />
          </Card>
        ) : error ? (
          <Card className="mt-6">
            <ErrorState />
          </Card>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-1.5 shadow-card -mt-4 relative z-20 mb-6">
              <div className="flex">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200
                      flex items-center justify-center gap-2
                      ${activeTab === tab.id 
                        ? 'bg-charcoal-900 text-white shadow-luxury' 
                        : 'text-charcoal-600 hover:bg-cream-50'
                      }
                    `}
                  >
                    {isArabic ? tab.labelAr : tab.labelEn}
                    {tab.count > 0 && (
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-semibold
                        ${activeTab === tab.id 
                          ? 'bg-brand-800 text-charcoal-900' 
                          : 'bg-charcoal-100 text-charcoal-600'
                        }
                      `}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {currentTrips.length > 0 ? (
              <div className="space-y-4">
                {currentTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <Card>
                <EmptyState type={activeTab} />
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyTrips;
