import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Language, Hotel } from '../types';
import { api } from '../services/api';
import { AMENITIES } from '../utils/constants';
import Map, { MapMarker } from '../components/Map';

interface HotelDetailsProps {
  lang: Language;
}

const HotelDetails: React.FC<HotelDetailsProps> = ({ lang }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.hotels.getById(id);
        setHotel(data);
      } catch (error) {
        console.error('Failed to fetch hotel:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary-600"></i>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-600">{isArabic ? 'الفندق غير موجود' : 'Hotel not found'}</p>
      </div>
    );
  }

  const mapMarker: MapMarker = useMemo(
    () => ({
      lat: hotel.location.lat,
      lng: hotel.location.lng,
      title: isArabic ? hotel.nameAr : hotel.nameEn,
      address: isArabic ? hotel.location.addressAr : hotel.location.addressEn,
    }),
    [hotel, isArabic]
  );

  const mapCenter = useMemo(
    () => ({
      lat: hotel.location.lat,
      lng: hotel.location.lng,
    }),
    [hotel]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-96 relative overflow-hidden">
        <img
          src={hotel.images[0] || hotel.thumbnail}
          alt={isArabic ? hotel.nameAr : hotel.nameEn}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 -mt-20 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-600 mb-2">
                {isArabic ? hotel.nameAr : hotel.nameEn}
              </h1>
              <div className="flex items-center text-yellow-500 mb-2">
                {[...Array(hotel.stars)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
              <div className="flex items-center text-gray-600">
                <i className="fas fa-map-marker-alt mr-2"></i>
                {isArabic ? hotel.location.addressAr : hotel.location.addressEn}
              </div>
            </div>
            <div className="text-right">
              <div className="bg-primary-600 text-white px-3 py-2 rounded font-bold text-xl">
                {hotel.rating}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {hotel.reviewCount} {isArabic ? 'تقييم' : 'reviews'}
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-6">
            {isArabic ? hotel.descriptionAr : hotel.descriptionEn}
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-primary-600 mb-3">
              {isArabic ? 'الموقع' : 'Location'}
            </h3>
            <Map
              center={mapCenter}
              markers={[mapMarker]}
              zoom={15}
              height="500px"
              className="rounded-lg shadow-md overflow-hidden"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-primary-600 mb-3">
              {isArabic ? 'المرافق' : 'Amenities'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {hotel.amenities.map((amenityId) => {
                const amenity = AMENITIES[amenityId];
                return (
                  <div key={amenityId} className="flex items-center text-gray-700">
                    <i className={`fas ${amenity.icon} mr-2 text-primary-600`}></i>
                    {isArabic ? amenity.labelAr : amenity.labelEn}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-primary-600 mb-4">
              {isArabic ? 'الغرف المتاحة' : 'Available Rooms'}
            </h3>
            <div className="space-y-4">
              {hotel.rooms.map((room) => (
                <div
                  key={room.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-600 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-primary-600">
                        {isArabic ? room.nameAr : room.nameEn}
                      </h4>
                      <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <div>
                          <i className="fas fa-users mr-2"></i>
                          {room.capacity} {isArabic ? 'ضيوف' : 'guests'}
                        </div>
                        <div>
                          <i className="fas fa-bed mr-2"></i>
                          {room.bedType}
                        </div>
                        {room.breakfastIncluded && (
                          <div className="text-green-600">
                            <i className="fas fa-check mr-2"></i>
                            {isArabic ? 'إفطار مشمول' : 'Breakfast included'}
                          </div>
                        )}
                        {room.freeCancellation && (
                          <div className="text-green-600">
                            <i className="fas fa-check mr-2"></i>
                            {isArabic ? 'إلغاء مجاني' : 'Free cancellation'}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-accent-500">
                        {room.price} {isArabic ? 'ر.س' : 'SAR'}
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        {isArabic ? 'لليلة' : 'per night'}
                      </div>
                      <button
                        onClick={() => navigate(`/checkout?hotelId=${hotel.id}&roomId=${room.id}`)}
                        className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-2 rounded-lg transition font-semibold"
                      >
                        {isArabic ? 'احجز الآن' : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
