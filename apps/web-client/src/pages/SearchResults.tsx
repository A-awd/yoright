import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Language, Hotel } from '../types';
import { api } from '../services/api';

interface SearchResultsProps {
  lang: Language;
}

const SearchResults: React.FC<SearchResultsProps> = ({ lang }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await api.hotels.search({
          cityId: searchParams.get('cityId') || undefined,
          checkIn: searchParams.get('checkIn') || undefined,
          checkOut: searchParams.get('checkOut') || undefined,
          adults: parseInt(searchParams.get('guests') || '2'),
        });
        setHotels(response.items);
        setTotal(response.total);
      } catch (error) {
        console.error('Failed to fetch hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary-600"></i>
        <p className="mt-4 text-gray-600">{isArabic ? 'جاري البحث...' : 'Searching...'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">
        {isArabic ? `${total} فندق متاح` : `${total} Hotels Available`}
      </h1>

      <div className="grid grid-cols-1 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            onClick={() => navigate(`/hotel/${hotel.id}`)}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden flex flex-col md:flex-row"
          >
            <img
              src={hotel.thumbnail}
              alt={isArabic ? hotel.nameAr : hotel.nameEn}
              className="w-full md:w-64 h-48 object-cover"
            />
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-bold text-primary-600">
                    {isArabic ? hotel.nameAr : hotel.nameEn}
                  </h2>
                  <div className="flex items-center text-yellow-500 mt-1">
                    {[...Array(hotel.stars)].map((_, i) => (
                      <i key={i} className="fas fa-star text-sm"></i>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-accent-500">
                    {hotel.minPrice} {isArabic ? 'ر.س' : 'SAR'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {isArabic ? 'لليلة الواحدة' : 'per night'}
                  </div>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-2">
                <i className="fas fa-map-marker-alt mr-2"></i>
                {isArabic ? hotel.location.addressAr : hotel.location.addressEn}
              </div>

              <div className="flex items-center text-sm mb-3">
                <div className="bg-primary-600 text-white px-2 py-1 rounded font-semibold mr-2">
                  {hotel.rating}
                </div>
                <span className="text-gray-600">
                  ({hotel.reviewCount} {isArabic ? 'تقييم' : 'reviews'})
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {hotel.amenities.slice(0, 4).map((amenity) => (
                  <span
                    key={amenity}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    <i className={`fas ${amenity} mr-1`}></i>
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {hotels.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <i className="fas fa-hotel text-6xl mb-4"></i>
          <p className="text-xl">
            {isArabic ? 'لم يتم العثور على فنادق' : 'No hotels found'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
