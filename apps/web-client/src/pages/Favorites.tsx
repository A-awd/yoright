import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { Card, Button, Badge } from '../components/ui';
import { Rating } from '../components/ui/Rating';

interface FavoritesProps {
  lang: Language;
}

interface FavoriteHotel {
  id: string;
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  countryAr: string;
  countryEn: string;
  image: string;
  stars: number;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
}

const HeartIcon: React.FC<{ filled: boolean; className?: string }> = ({ filled, className }) => (
  <svg className={className} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EmptyStateIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const mockFavorites: FavoriteHotel[] = [
  {
    id: '1',
    nameAr: 'فندق أتلانتس النخلة',
    nameEn: 'Atlantis The Palm',
    cityAr: 'دبي',
    cityEn: 'Dubai',
    countryAr: 'الإمارات',
    countryEn: 'UAE',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
    stars: 5,
    rating: 4.8,
    reviewCount: 2847,
    pricePerNight: 1850,
    currency: 'SAR',
  },
  {
    id: '2',
    nameAr: 'فندق الريتز كارلتون',
    nameEn: 'The Ritz-Carlton',
    cityAr: 'الرياض',
    cityEn: 'Riyadh',
    countryAr: 'السعودية',
    countryEn: 'Saudi Arabia',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    stars: 5,
    rating: 4.9,
    reviewCount: 1523,
    pricePerNight: 2200,
    currency: 'SAR',
  },
  {
    id: '3',
    nameAr: 'منتجع سونيفا فوشي',
    nameEn: 'Soneva Fushi Resort',
    cityAr: 'با أتول',
    cityEn: 'Baa Atoll',
    countryAr: 'المالديف',
    countryEn: 'Maldives',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
    stars: 5,
    rating: 4.95,
    reviewCount: 892,
    pricePerNight: 4500,
    currency: 'SAR',
  },
  {
    id: '4',
    nameAr: 'فندق فور سيزونز',
    nameEn: 'Four Seasons Hotel',
    cityAr: 'إسطنبول',
    cityEn: 'Istanbul',
    countryAr: 'تركيا',
    countryEn: 'Turkey',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
    stars: 5,
    rating: 4.7,
    reviewCount: 1890,
    pricePerNight: 1650,
    currency: 'SAR',
  },
];

const Favorites: React.FC<FavoritesProps> = ({ lang }) => {
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;
  const [favorites, setFavorites] = useState<FavoriteHotel[]>(mockFavorites);

  const handleRemoveFavorite = (e: React.MouseEvent, hotelId: string) => {
    e.stopPropagation();
    setFavorites(favorites.filter((hotel) => hotel.id !== hotelId));
  };

  const handleHotelClick = (hotelId: string) => {
    navigate(`/hotel/${hotelId}`);
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-32 h-32 bg-cream-100 rounded-full flex items-center justify-center mb-6">
        <EmptyStateIcon className="w-16 h-16 text-charcoal-300" />
      </div>
      <h3 className="font-display text-xl font-semibold text-charcoal-900 mb-2 text-center">
        {isArabic ? 'لا توجد فنادق محفوظة' : 'No Saved Hotels'}
      </h3>
      <p className="text-charcoal-500 text-center max-w-sm mb-6">
        {isArabic
          ? 'ابدأ بحفظ الفنادق المفضلة لديك للوصول إليها بسهولة لاحقاً'
          : 'Start saving your favorite hotels to easily access them later'}
      </p>
      <Button onClick={() => navigate('/explore')}>
        {isArabic ? 'استكشف الوجهات' : 'Explore Destinations'}
      </Button>
    </div>
  );

  const renderFavoriteCard = (hotel: FavoriteHotel) => {
    const name = isArabic ? hotel.nameAr : hotel.nameEn;
    const city = isArabic ? hotel.cityAr : hotel.cityEn;
    const country = isArabic ? hotel.countryAr : hotel.countryEn;

    return (
      <Card
        key={hotel.id}
        padding="none"
        hover
        className="overflow-hidden group"
        onClick={() => handleHotelClick(hotel.id)}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={hotel.image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          <button
            onClick={(e) => handleRemoveFavorite(e, hotel.id)}
            className="absolute top-4 end-4 w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center transition-all duration-200 hover:bg-red-50 hover:scale-110"
            aria-label={isArabic ? 'إزالة من المفضلة' : 'Remove from favorites'}
          >
            <HeartIcon filled className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 flex gap-1">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <svg key={i} className="w-4 h-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-display text-lg font-semibold text-charcoal-900 mb-2 line-clamp-1">
            {name}
          </h3>

          <div className="flex items-center gap-1.5 text-charcoal-500 mb-3">
            <LocationIcon className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{city}, {country}</span>
          </div>

          <div className="mb-4">
            <Rating rating={hotel.rating} reviewCount={hotel.reviewCount} size="sm" />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-charcoal-100">
            <div>
              <span className="text-brand-800 font-display text-xl font-bold">
                {hotel.pricePerNight.toLocaleString()}
              </span>
              <span className="text-charcoal-500 text-sm ml-1">
                {hotel.currency} / {isArabic ? 'ليلة' : 'night'}
              </span>
            </div>
            <Badge variant="gold" size="sm">
              {isArabic ? 'محفوظ' : 'Saved'}
            </Badge>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className={`min-h-screen bg-cream-50 pb-24 ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="bg-white border-b border-charcoal-100">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal-900">
            {isArabic ? 'الفنادق المحفوظة' : 'Saved Hotels'}
          </h1>
          {favorites.length > 0 && (
            <p className="text-charcoal-500 mt-2">
              {isArabic
                ? `${favorites.length} فندق محفوظ`
                : `${favorites.length} hotel${favorites.length !== 1 ? 's' : ''} saved`}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8">
        {favorites.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {favorites.map(renderFavoriteCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
