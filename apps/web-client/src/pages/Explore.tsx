import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { Button } from '../components/ui';

interface ExploreProps {
  lang: Language;
}

type Region = 'all' | 'gulf' | 'europe' | 'asia' | 'americas';

interface Destination {
  id: string;
  nameAr: string;
  nameEn: string;
  countryAr: string;
  countryEn: string;
  hotelCount: number;
  image: string;
  region: Region;
}

const Explore: React.FC<ExploreProps> = ({ lang }) => {
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;
  const [activeRegion, setActiveRegion] = useState<Region>('all');

  const regions: { id: Region; labelEn: string; labelAr: string }[] = [
    { id: 'all', labelEn: 'All', labelAr: 'الكل' },
    { id: 'gulf', labelEn: 'Gulf', labelAr: 'الخليج' },
    { id: 'europe', labelEn: 'Europe', labelAr: 'أوروبا' },
    { id: 'asia', labelEn: 'Asia', labelAr: 'آسيا' },
    { id: 'americas', labelEn: 'Americas', labelAr: 'الأمريكتين' },
  ];

  const destinations: Destination[] = [
    // Gulf
    { id: 'dubai', nameAr: 'دبي', nameEn: 'Dubai', countryAr: 'الإمارات', countryEn: 'UAE', hotelCount: 1250, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=500&fit=crop', region: 'gulf' },
    { id: 'riyadh', nameAr: 'الرياض', nameEn: 'Riyadh', countryAr: 'السعودية', countryEn: 'Saudi Arabia', hotelCount: 890, image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=500&fit=crop', region: 'gulf' },
    { id: 'makkah', nameAr: 'مكة المكرمة', nameEn: 'Makkah', countryAr: 'السعودية', countryEn: 'Saudi Arabia', hotelCount: 650, image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&h=500&fit=crop', region: 'gulf' },
    { id: 'madinah', nameAr: 'المدينة المنورة', nameEn: 'Madinah', countryAr: 'السعودية', countryEn: 'Saudi Arabia', hotelCount: 480, image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=500&fit=crop', region: 'gulf' },
    { id: 'jeddah', nameAr: 'جدة', nameEn: 'Jeddah', countryAr: 'السعودية', countryEn: 'Saudi Arabia', hotelCount: 720, image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=400&h=500&fit=crop', region: 'gulf' },
    { id: 'doha', nameAr: 'الدوحة', nameEn: 'Doha', countryAr: 'قطر', countryEn: 'Qatar', hotelCount: 340, image: 'https://images.unsplash.com/photo-1549920867-0066d8c3e3e9?w=400&h=500&fit=crop', region: 'gulf' },
    { id: 'abu-dhabi', nameAr: 'أبوظبي', nameEn: 'Abu Dhabi', countryAr: 'الإمارات', countryEn: 'UAE', hotelCount: 560, image: 'https://images.unsplash.com/photo-1611605645802-c21be743c321?w=400&h=500&fit=crop', region: 'gulf' },
    { id: 'kuwait', nameAr: 'الكويت', nameEn: 'Kuwait City', countryAr: 'الكويت', countryEn: 'Kuwait', hotelCount: 280, image: 'https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=400&h=500&fit=crop', region: 'gulf' },
    { id: 'muscat', nameAr: 'مسقط', nameEn: 'Muscat', countryAr: 'عُمان', countryEn: 'Oman', hotelCount: 320, image: 'https://images.unsplash.com/photo-1560604155-98f00ebe0b00?w=400&h=500&fit=crop', region: 'gulf' },
    { id: 'bahrain', nameAr: 'المنامة', nameEn: 'Manama', countryAr: 'البحرين', countryEn: 'Bahrain', hotelCount: 190, image: 'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=400&h=500&fit=crop', region: 'gulf' },
    // Europe
    { id: 'paris', nameAr: 'باريس', nameEn: 'Paris', countryAr: 'فرنسا', countryEn: 'France', hotelCount: 3200, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=500&fit=crop', region: 'europe' },
    { id: 'london', nameAr: 'لندن', nameEn: 'London', countryAr: 'بريطانيا', countryEn: 'United Kingdom', hotelCount: 4100, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=500&fit=crop', region: 'europe' },
    { id: 'istanbul', nameAr: 'إسطنبول', nameEn: 'Istanbul', countryAr: 'تركيا', countryEn: 'Turkey', hotelCount: 2100, image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&h=500&fit=crop', region: 'europe' },
    { id: 'rome', nameAr: 'روما', nameEn: 'Rome', countryAr: 'إيطاليا', countryEn: 'Italy', hotelCount: 2800, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=500&fit=crop', region: 'europe' },
    { id: 'barcelona', nameAr: 'برشلونة', nameEn: 'Barcelona', countryAr: 'إسبانيا', countryEn: 'Spain', hotelCount: 2400, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=500&fit=crop', region: 'europe' },
    { id: 'amsterdam', nameAr: 'أمستردام', nameEn: 'Amsterdam', countryAr: 'هولندا', countryEn: 'Netherlands', hotelCount: 1600, image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=500&fit=crop', region: 'europe' },
    // Asia
    { id: 'maldives', nameAr: 'المالديف', nameEn: 'Maldives', countryAr: 'المالديف', countryEn: 'Maldives', hotelCount: 420, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=500&fit=crop', region: 'asia' },
    { id: 'tokyo', nameAr: 'طوكيو', nameEn: 'Tokyo', countryAr: 'اليابان', countryEn: 'Japan', hotelCount: 3800, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=500&fit=crop', region: 'asia' },
    { id: 'singapore', nameAr: 'سنغافورة', nameEn: 'Singapore', countryAr: 'سنغافورة', countryEn: 'Singapore', hotelCount: 1200, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=500&fit=crop', region: 'asia' },
    { id: 'bali', nameAr: 'بالي', nameEn: 'Bali', countryAr: 'إندونيسيا', countryEn: 'Indonesia', hotelCount: 1800, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=500&fit=crop', region: 'asia' },
    { id: 'bangkok', nameAr: 'بانكوك', nameEn: 'Bangkok', countryAr: 'تايلاند', countryEn: 'Thailand', hotelCount: 2600, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=500&fit=crop', region: 'asia' },
    { id: 'hong-kong', nameAr: 'هونغ كونغ', nameEn: 'Hong Kong', countryAr: 'الصين', countryEn: 'China', hotelCount: 1400, image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=400&h=500&fit=crop', region: 'asia' },
    // Americas
    { id: 'new-york', nameAr: 'نيويورك', nameEn: 'New York', countryAr: 'أمريكا', countryEn: 'USA', hotelCount: 5200, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=500&fit=crop', region: 'americas' },
    { id: 'miami', nameAr: 'ميامي', nameEn: 'Miami', countryAr: 'أمريكا', countryEn: 'USA', hotelCount: 1900, image: 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=400&h=500&fit=crop', region: 'americas' },
    { id: 'cancun', nameAr: 'كانكون', nameEn: 'Cancun', countryAr: 'المكسيك', countryEn: 'Mexico', hotelCount: 850, image: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=400&h=500&fit=crop', region: 'americas' },
    { id: 'los-angeles', nameAr: 'لوس أنجلوس', nameEn: 'Los Angeles', countryAr: 'أمريكا', countryEn: 'USA', hotelCount: 3100, image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=400&h=500&fit=crop', region: 'americas' },
  ];

  const filteredDestinations = activeRegion === 'all'
    ? destinations
    : destinations.filter(d => d.region === activeRegion);

  const handleDestinationClick = (cityId: string) => {
    navigate(`/destination/${cityId}`);
  };

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      {/* Hero Banner */}
      <section className="relative h-48 md:h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&h=600&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/70 to-charcoal-950/50" />
        
        <div className="relative h-full flex flex-col items-center justify-center px-4">
          <h1 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center">
            {isArabic ? 'استكشف الوجهات' : 'Explore Destinations'}
          </h1>
          <p className="text-cream-200 mt-2 md:mt-3 text-sm md:text-lg text-center max-w-xl">
            {isArabic
              ? 'اكتشف أفضل الوجهات السياحية حول العالم'
              : 'Discover the best travel destinations around the world'}
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            {regions.map((region) => (
              <Button
                key={region.id}
                variant={activeRegion === region.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveRegion(region.id)}
                className={`flex-shrink-0 rounded-full px-5 ${
                  activeRegion === region.id
                    ? 'bg-brand-800 text-white'
                    : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
                }`}
              >
                {isArabic ? region.labelAr : region.labelEn}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-6 md:py-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-4 md:mb-6">
            <p className="text-charcoal-500 text-sm">
              {isArabic
                ? `${filteredDestinations.length} وجهة متاحة`
                : `${filteredDestinations.length} destinations available`}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {filteredDestinations.map((destination) => (
              <div
                key={destination.id}
                onClick={() => handleDestinationClick(destination.id)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
                  <img
                    src={destination.image}
                    alt={isArabic ? destination.nameAr : destination.nameEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/30 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <h3 className="font-display text-base md:text-lg font-semibold text-white mb-0.5">
                      {isArabic ? destination.nameAr : destination.nameEn}
                    </h3>
                    <p className="text-cream-300 text-xs md:text-sm mb-1">
                      {isArabic ? destination.countryAr : destination.countryEn}
                    </p>
                    <p className="text-cream-200 text-xs">
                      {destination.hotelCount.toLocaleString()} {isArabic ? 'فندق' : 'hotels'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Explore;
