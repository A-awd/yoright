import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { Button, DatePicker, GuestSelector, Input } from '../components/ui';
import HotelCard from '../components/HotelCard';

interface HomeProps {
  lang: Language;
}

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const SupportIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CancelIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const Home: React.FC<HomeProps> = ({ lang }) => {
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;

  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [destination, setDestination] = useState('');

  const destinations = [
    { id: 'dubai', nameAr: 'دبي', nameEn: 'Dubai', country: 'UAE', hotelCount: 1250, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=500&fit=crop' },
    { id: 'riyadh', nameAr: 'الرياض', nameEn: 'Riyadh', country: 'KSA', hotelCount: 890, image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=500&fit=crop' },
    { id: 'makkah', nameAr: 'مكة المكرمة', nameEn: 'Makkah', country: 'KSA', hotelCount: 650, image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&h=500&fit=crop' },
    { id: 'istanbul', nameAr: 'إسطنبول', nameEn: 'Istanbul', country: 'Turkey', hotelCount: 2100, image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&h=500&fit=crop' },
    { id: 'paris', nameAr: 'باريس', nameEn: 'Paris', country: 'France', hotelCount: 3200, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=500&fit=crop' },
    { id: 'maldives', nameAr: 'المالديف', nameEn: 'Maldives', country: 'Maldives', hotelCount: 420, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=500&fit=crop' },
  ];

  const featuredHotels = [
    {
      id: '1',
      nameAr: 'فندق أتلانتس النخلة',
      nameEn: 'Atlantis The Palm',
      cityAr: 'دبي',
      cityEn: 'Dubai',
      countryAr: 'الإمارات',
      countryEn: 'UAE',
      taglineAr: 'شاطئ خاص · منتجع عائلي',
      taglineEn: 'Private Beach · Family Resort',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
      stars: 5,
      rating: 4.8,
      reviewCount: 2847,
      pricePerNight: 1850,
      badge: 'featured' as const,
    },
    {
      id: '2',
      nameAr: 'فندق الريتز كارلتون',
      nameEn: 'The Ritz-Carlton',
      cityAr: 'الرياض',
      cityEn: 'Riyadh',
      countryAr: 'السعودية',
      countryEn: 'Saudi Arabia',
      taglineAr: 'فخامة · سبا فاخر',
      taglineEn: 'Luxury · Premium Spa',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      stars: 5,
      rating: 4.9,
      reviewCount: 1523,
      pricePerNight: 2200,
      badge: 'new' as const,
    },
    {
      id: '3',
      nameAr: 'منتجع سونيفا فوشي',
      nameEn: 'Soneva Fushi Resort',
      cityAr: 'با أتول',
      cityEn: 'Baa Atoll',
      countryAr: 'المالديف',
      countryEn: 'Maldives',
      taglineAr: 'فيلات فوق الماء · للبالغين فقط',
      taglineEn: 'Overwater Villas · Adults Only',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
      stars: 5,
      rating: 4.95,
      reviewCount: 892,
      pricePerNight: 4500,
    },
    {
      id: '4',
      nameAr: 'فندق برج العرب',
      nameEn: 'Burj Al Arab',
      cityAr: 'دبي',
      cityEn: 'Dubai',
      countryAr: 'الإمارات',
      countryEn: 'UAE',
      taglineAr: 'أيقونة · 7 نجوم',
      taglineEn: 'Iconic · 7-Star Luxury',
      image: 'https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=800&h=600&fit=crop',
      stars: 5,
      rating: 4.85,
      reviewCount: 3156,
      pricePerNight: 5500,
      badge: 'featured' as const,
    },
    {
      id: '5',
      nameAr: 'فندق فور سيزونز',
      nameEn: 'Four Seasons Hotel',
      cityAr: 'إسطنبول',
      cityEn: 'Istanbul',
      countryAr: 'تركيا',
      countryEn: 'Turkey',
      taglineAr: 'إطلالة على البوسفور',
      taglineEn: 'Bosphorus Views',
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
      stars: 5,
      rating: 4.7,
      reviewCount: 1890,
      pricePerNight: 1650,
    },
    {
      id: '6',
      nameAr: 'فندق لو بريستول',
      nameEn: 'Le Bristol Paris',
      cityAr: 'باريس',
      cityEn: 'Paris',
      countryAr: 'فرنسا',
      countryEn: 'France',
      taglineAr: 'قصر باريسي · ميشلان',
      taglineEn: 'Parisian Palace · Michelin Star',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
      stars: 5,
      rating: 4.88,
      reviewCount: 2234,
      pricePerNight: 3200,
      badge: 'new' as const,
    },
  ];

  const features = [
    {
      icon: <ShieldIcon />,
      titleAr: 'ضمان أفضل سعر',
      titleEn: 'Best Price Guarantee',
      descAr: 'نضمن لك الحصول على أفضل الأسعار المتاحة',
      descEn: 'We guarantee the best available rates for your stay',
    },
    {
      icon: <SupportIcon />,
      titleAr: 'دعم على مدار الساعة',
      titleEn: '24/7 Support',
      descAr: 'فريق دعم متاح في أي وقت لمساعدتك',
      descEn: 'Our support team is available anytime to help you',
    },
    {
      icon: <CancelIcon />,
      titleAr: 'إلغاء مجاني',
      titleEn: 'Free Cancellation',
      descAr: 'إلغاء مجاني على معظم الحجوزات',
      descEn: 'Free cancellation on most bookings',
    },
    {
      icon: <StarIcon />,
      titleAr: 'تقييمات موثوقة',
      titleEn: 'Verified Reviews',
      descAr: 'تقييمات حقيقية من نزلاء فعليين',
      descEn: 'Authentic reviews from real guests',
    },
  ];

  const handleSearch = () => {
    navigate('/search');
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&h=1080&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/60 via-charcoal-950/40 to-charcoal-950/70" />
        
        <div className="relative h-full flex flex-col items-center justify-center px-4 pt-16">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {isArabic ? 'اكتشف إقامات استثنائية' : 'Discover Extraordinary Stays'}
            </h1>
            <p className="text-lg md:text-xl text-cream-200 max-w-2xl mx-auto">
              {isArabic
                ? 'احجز فنادق فاخرة في أفضل الوجهات حول العالم'
                : 'Book luxury hotels in the world\'s most prestigious destinations'}
            </p>
          </div>

          <div className="w-full max-w-5xl bg-white/95 backdrop-blur-lg rounded-3xl shadow-luxury-xl p-6 md:p-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-charcoal-500 mb-2">
                  {isArabic ? 'الوجهة' : 'Destination'}
                </label>
                <Input
                  placeholder={isArabic ? 'إلى أين تريد الذهاب؟' : 'Where do you want to go?'}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-charcoal-500 mb-2">
                  {isArabic ? 'التواريخ' : 'Dates'}
                </label>
                <DatePicker
                  checkInDate={checkInDate}
                  checkOutDate={checkOutDate}
                  onCheckInChange={setCheckInDate}
                  onCheckOutChange={setCheckOutDate}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-charcoal-500 mb-2">
                  {isArabic ? 'الضيوف' : 'Guests'}
                </label>
                <GuestSelector
                  adults={adults}
                  children={children}
                  rooms={rooms}
                  onAdultsChange={setAdults}
                  onChildrenChange={setChildren}
                  onRoomsChange={setRooms}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                onClick={handleSearch}
                leftIcon={<SearchIcon />}
                className="px-12"
              >
                {isArabic ? 'بحث' : 'Search Hotels'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal-900">
                {isArabic ? 'وجهات شائعة' : 'Popular Destinations'}
              </h2>
              <p className="text-charcoal-500 mt-2">
                {isArabic ? 'استكشف أفضل المدن للإقامة' : 'Explore the best cities for your stay'}
              </p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/search')}>
              {isArabic ? 'عرض الكل' : 'View All'}
            </Button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => navigate(`/search?city=${dest.id}`)}
                className="flex-shrink-0 w-48 md:w-56 snap-start cursor-pointer group"
              >
                <div className="relative h-64 md:h-72 rounded-2xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-all duration-300">
                  <img
                    src={dest.image}
                    alt={isArabic ? dest.nameAr : dest.nameEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-xl font-semibold text-white mb-1">
                      {isArabic ? dest.nameAr : dest.nameEn}
                    </h3>
                    <p className="text-cream-200 text-sm">
                      {dest.hotelCount.toLocaleString()} {isArabic ? 'فندق' : 'hotels'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 bg-cream-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal-900 mb-3">
              {isArabic ? 'فنادق مميزة' : 'Featured Hotels'}
            </h2>
            <p className="text-charcoal-500 max-w-xl mx-auto">
              {isArabic
                ? 'اكتشف مجموعتنا المختارة من أفخم الفنادق'
                : 'Discover our curated selection of the finest luxury hotels'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                {...hotel}
                lang={lang}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal-950 mb-2">
                {isArabic ? 'أسعار حصرية للأعضاء' : 'Exclusive Member Rates'}
              </h2>
              <p className="text-charcoal-800 max-w-lg">
                {isArabic
                  ? 'انضم إلى برنامج العضوية واحصل على خصومات تصل إلى 25%'
                  : 'Join our membership program and save up to 25% on every booking'}
              </p>
            </div>
            <Button
              size="lg"
              className="bg-charcoal-950 hover:bg-charcoal-900 text-white shadow-luxury-lg"
              onClick={() => navigate('/signup')}
            >
              {isArabic ? 'انضم الآن مجاناً' : 'Join Free Today'}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal-900 mb-3">
              {isArabic ? 'لماذا YoRight؟' : 'Why Choose YoRight?'}
            </h2>
            <p className="text-charcoal-500 max-w-xl mx-auto">
              {isArabic
                ? 'نقدم لك تجربة حجز لا مثيل لها'
                : 'We provide an unmatched booking experience'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-cream-50 rounded-2xl p-6 text-center hover:shadow-card transition-all duration-300"
              >
                <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-900">
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-charcoal-900 mb-2">
                  {isArabic ? feature.titleAr : feature.titleEn}
                </h3>
                <p className="text-charcoal-500 text-sm">
                  {isArabic ? feature.descAr : feature.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-20" />
    </div>
  );
};

export default Home;
