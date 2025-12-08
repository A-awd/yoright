import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rating, Badge, Button } from './ui';
import { Language } from '../types';

interface HotelCardProps {
  id: string;
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  countryAr: string;
  countryEn: string;
  taglineAr?: string;
  taglineEn?: string;
  image: string;
  stars: number;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency?: string;
  badge?: 'featured' | 'new';
  lang: Language;
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

export const HotelCard: React.FC<HotelCardProps> = ({
  id,
  nameAr,
  nameEn,
  cityAr,
  cityEn,
  countryAr,
  countryEn,
  taglineAr,
  taglineEn,
  image,
  stars,
  rating,
  reviewCount,
  pricePerNight,
  currency = 'SAR',
  badge,
  lang,
}) => {
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;
  const [isFavorite, setIsFavorite] = useState(false);

  const name = isArabic ? nameAr : nameEn;
  const city = isArabic ? cityAr : cityEn;
  const country = isArabic ? countryAr : countryEn;
  const tagline = isArabic ? taglineAr : taglineEn;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const getBadgeLabel = () => {
    if (!badge) return null;
    if (badge === 'featured') return isArabic ? 'مميز' : 'Featured';
    if (badge === 'new') return isArabic ? 'جديد' : 'New';
    return null;
  };

  return (
    <div
      className="group bg-white rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => navigate(`/hotel/${id}`)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            isFavorite
              ? 'bg-white text-red-500'
              : 'bg-white/80 backdrop-blur-sm text-charcoal-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <HeartIcon filled={isFavorite} className="w-5 h-5" />
        </button>

        {badge && (
          <div className="absolute top-4 left-4">
            <Badge variant={badge === 'featured' ? 'gold' : 'success'} size="md">
              {getBadgeLabel()}
            </Badge>
          </div>
        )}

        <div className="absolute bottom-4 left-4 flex gap-1">
          {Array.from({ length: stars }).map((_, i) => (
            <svg key={i} className="w-4 h-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-charcoal-900 mb-2 line-clamp-1">
          {name}
        </h3>

        <div className="flex items-center gap-1.5 text-charcoal-500 mb-2">
          <LocationIcon className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{city}, {country}</span>
        </div>

        {tagline && (
          <p className="text-sm text-charcoal-400 mb-3">{tagline}</p>
        )}

        <div className="mb-4">
          <Rating rating={rating} reviewCount={reviewCount} size="sm" />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-charcoal-100">
          <div>
            <span className="text-brand-900 font-display text-2xl font-bold">
              {pricePerNight.toLocaleString()}
            </span>
            <span className="text-charcoal-500 text-sm ml-1">
              {currency} / {isArabic ? 'ليلة' : 'night'}
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/hotel/${id}`);
            }}
          >
            {isArabic ? 'عرض التفاصيل' : 'View Details'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
