import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Language, Hotel, Room } from '../types';
import { api } from '../services/api';
import { AMENITIES } from '../utils/constants';
import Map, { MapMarker } from '../components/Map';
import {
  Button,
  Badge,
  Rating,
  DatePicker,
  GuestSelector,
  Modal,
  ModalHeader,
  ModalBody,
  Avatar,
} from '../components/ui';

interface HotelDetailsProps {
  lang: Language;
}

const MOCK_REVIEWS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://picsum.photos/id/64/100/100',
    date: '2024-11-15',
    rating: 4.8,
    text: 'Absolutely stunning hotel with impeccable service. The room was spacious and the views were breathtaking. The staff went above and beyond to make our stay memorable.',
    helpful: 24,
  },
  {
    id: '2',
    name: 'Ahmed Al-Rashid',
    avatar: 'https://picsum.photos/id/65/100/100',
    date: '2024-11-10',
    rating: 5.0,
    text: 'A truly luxurious experience from start to finish. The attention to detail is remarkable. Perfect for a special occasion or romantic getaway.',
    helpful: 18,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://picsum.photos/id/66/100/100',
    date: '2024-10-28',
    rating: 4.5,
    text: 'Beautiful property with excellent amenities. The spa was world-class and the dining options exceeded our expectations. Will definitely return!',
    helpful: 12,
  },
];

const RATING_BREAKDOWN = [
  { label: 'Cleanliness', labelAr: 'النظافة', score: 9.6 },
  { label: 'Location', labelAr: 'الموقع', score: 9.8 },
  { label: 'Service', labelAr: 'الخدمة', score: 9.4 },
  { label: 'Comfort', labelAr: 'الراحة', score: 9.5 },
  { label: 'Value', labelAr: 'القيمة', score: 9.0 },
];

const NEARBY_ATTRACTIONS = [
  { name: 'City Center Mall', nameAr: 'مركز المدينة للتسوق', distance: '0.5 km', icon: 'fa-shopping-bag' },
  { name: 'Beach Promenade', nameAr: 'كورنيش الشاطئ', distance: '0.2 km', icon: 'fa-umbrella-beach' },
  { name: 'Museum of Art', nameAr: 'متحف الفنون', distance: '1.2 km', icon: 'fa-landmark' },
  { name: 'Marina Walk', nameAr: 'ممشى المارينا', distance: '0.8 km', icon: 'fa-ship' },
];

const ROOM_AMENITY_ICONS: Record<string, { icon: string; label: string; labelAr: string }> = {
  ac: { icon: 'fa-snowflake', label: 'Air Conditioning', labelAr: 'تكييف' },
  wifi: { icon: 'fa-wifi', label: 'Free WiFi', labelAr: 'واي فاي' },
  tv: { icon: 'fa-tv', label: 'Smart TV', labelAr: 'تلفاز ذكي' },
  minibar: { icon: 'fa-glass-martini-alt', label: 'Minibar', labelAr: 'ميني بار' },
  safe: { icon: 'fa-lock', label: 'In-room Safe', labelAr: 'خزنة' },
  balcony: { icon: 'fa-door-open', label: 'Balcony', labelAr: 'شرفة' },
};

const AMENITY_CATEGORIES = {
  general: {
    title: 'General',
    titleAr: 'عام',
    items: ['wifi', 'parking'],
  },
  wellness: {
    title: 'Wellness & Spa',
    titleAr: 'الصحة والسبا',
    items: ['spa', 'pool', 'gym'],
  },
  dining: {
    title: 'Dining',
    titleAr: 'تناول الطعام',
    items: ['restaurant'],
  },
};

const HotelDetails: React.FC<HotelDetailsProps> = ({ lang }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    rooms: true,
    amenities: true,
    location: true,
    reviews: true,
    policies: true,
  });
  const [visibleReviews, setVisibleReviews] = useState(3);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.hotels.getById(id);
        setHotel(data);
        if (data.rooms.length > 0) {
          setSelectedRoom(data.rooms[0]);
        }
      } catch (error) {
        console.error('Failed to fetch hotel:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const allImages = useMemo(() => {
    if (!hotel) return [];
    return [hotel.thumbnail, ...hotel.images].filter(Boolean);
  }, [hotel]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-charcoal-600 font-medium">{isArabic ? 'جارٍ التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-hotel text-6xl text-charcoal-300 mb-4"></i>
          <p className="text-xl text-charcoal-600">{isArabic ? 'الفندق غير موجود' : 'Hotel not found'}</p>
          <Button variant="secondary" className="mt-4" onClick={() => navigate(-1)}>
            {isArabic ? 'العودة' : 'Go Back'}
          </Button>
        </div>
      </div>
    );
  }

  const mapMarker: MapMarker = {
    lat: hotel.location.lat,
    lng: hotel.location.lng,
    title: isArabic ? hotel.nameAr : hotel.nameEn,
    address: isArabic ? hotel.location.addressAr : hotel.location.addressEn,
  };

  const mapCenter = {
    lat: hotel.location.lat,
    lng: hotel.location.lng,
  };

  const handleBookNow = () => {
    if (selectedRoom) {
      navigate(`/checkout?hotelId=${hotel.id}&roomId=${selectedRoom.id}`);
    }
  };

  const SectionHeader: React.FC<{ id: string; title: string; titleAr: string }> = ({ id, title, titleAr }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between py-4 text-left md:cursor-default"
    >
      <h2 className="text-2xl font-display font-semibold text-charcoal-900">
        {isArabic ? titleAr : title}
      </h2>
      <i
        className={`fas fa-chevron-down text-charcoal-400 transition-transform md:hidden ${
          expandedSections[id] ? 'rotate-180' : ''
        }`}
      ></i>
    </button>
  );

  return (
    <div className={`min-h-screen bg-cream-50 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <section className="relative">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={allImages[0] || 'https://picsum.photos/id/1018/1200/800'}
            alt={isArabic ? hotel.nameAr : hotel.nameEn}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent"></div>

          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-charcoal-700 hover:bg-white'
              }`}
            >
              <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
            </button>
            <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-charcoal-700 hover:bg-white flex items-center justify-center transition-all">
              <i className="fas fa-share-alt"></i>
            </button>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-charcoal-700 hover:bg-white flex items-center justify-center transition-all"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>

        <div className="container mx-auto px-4 -mt-16 relative z-10">
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {allImages.slice(1, 5).map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setGalleryIndex(idx + 1);
                  setShowGalleryModal(true);
                }}
                className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden ring-2 ring-white shadow-luxury hover:ring-brand-800 transition-all"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            <button
              onClick={() => {
                setGalleryIndex(0);
                setShowGalleryModal(true);
              }}
              className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-charcoal-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white ring-2 ring-white hover:ring-brand-800 transition-all"
            >
              <i className="fas fa-images text-xl mb-1"></i>
              <span className="text-sm font-medium">{isArabic ? 'عرض الكل' : 'View All'}</span>
              <span className="text-xs opacity-80">{allImages.length} {isArabic ? 'صور' : 'photos'}</span>
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-3xl p-6 md:p-8 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(hotel.stars)].map((_, i) => (
                      <i key={i} className="fas fa-star text-brand-800 text-sm"></i>
                    ))}
                    <Badge variant="gold" size="sm">{isArabic ? 'فندق فاخر' : 'Luxury Hotel'}</Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-charcoal-900 mb-3">
                    {isArabic ? hotel.nameAr : hotel.nameEn}
                  </h1>
                  <div className="flex items-center text-charcoal-600 mb-4">
                    <i className="fas fa-map-marker-alt text-brand-800 mr-2"></i>
                    <span>{isArabic ? hotel.location.addressAr : hotel.location.addressEn}</span>
                  </div>
                </div>
                <div className="hidden md:block text-right">
                  <div className="bg-brand-800 text-charcoal-950 px-4 py-2 rounded-xl font-bold text-2xl">
                    {hotel.rating}
                  </div>
                  <p className="text-sm text-charcoal-500 mt-1">
                    {hotel.reviewCount.toLocaleString()} {isArabic ? 'تقييم' : 'reviews'}
                  </p>
                </div>
              </div>

              <p className="text-charcoal-700 text-lg leading-relaxed mb-6">
                {isArabic ? hotel.descriptionAr : hotel.descriptionEn}
              </p>

              <div className="flex flex-wrap gap-2">
                {hotel.amenities.slice(0, 5).map((amenityId) => {
                  const amenity = AMENITIES[amenityId];
                  if (!amenity) return null;
                  return (
                    <Badge key={amenityId} variant="default" shape="pill" className="gap-2">
                      <i className={`fas ${amenity.icon} text-brand-900`}></i>
                      {isArabic ? amenity.labelAr : amenity.labelEn}
                    </Badge>
                  );
                })}
              </div>
            </section>

            <section className="bg-white rounded-3xl shadow-card overflow-hidden">
              <div className="p-6 md:p-8 border-b border-charcoal-100">
                <SectionHeader id="overview" title="Overview" titleAr="نظرة عامة" />
              </div>
              <div className={`p-6 md:p-8 ${expandedSections.overview ? '' : 'hidden md:block'}`}>
                <div className="prose prose-charcoal max-w-none">
                  <p className="text-charcoal-700 leading-relaxed mb-4">
                    {isArabic ? hotel.descriptionAr : hotel.descriptionEn}
                  </p>
                  <p className="text-charcoal-700 leading-relaxed mb-4">
                    {isArabic
                      ? 'يقدم الفندق تجربة إقامة استثنائية مع مرافق عالمية المستوى وخدمة شخصية لا مثيل لها. استمتع بالهدوء والفخامة في كل ركن من أركان الفندق.'
                      : 'The hotel offers an exceptional stay experience with world-class facilities and unparalleled personalized service. Enjoy tranquility and luxury in every corner of the property.'}
                  </p>
                  <p className="text-charcoal-700 leading-relaxed">
                    {isArabic
                      ? 'سواء كنت تبحث عن ملاذ رومانسي أو رحلة عمل مريحة، ستجد كل ما تحتاجه لإقامة لا تُنسى.'
                      : 'Whether you\'re seeking a romantic getaway or a comfortable business trip, you\'ll find everything you need for an unforgettable stay.'}
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: 'fa-concierge-bell', label: '24/7 Concierge', labelAr: 'خدمة الكونسيرج ٢٤/٧' },
                    { icon: 'fa-car', label: 'Valet Parking', labelAr: 'خدمة صف السيارات' },
                    { icon: 'fa-plane-arrival', label: 'Airport Transfer', labelAr: 'نقل من المطار' },
                    { icon: 'fa-shield-alt', label: 'Security 24/7', labelAr: 'أمن على مدار الساعة' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-cream-100 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                        <i className={`fas ${item.icon} text-brand-900`}></i>
                      </div>
                      <span className="text-sm font-medium text-charcoal-800">
                        {isArabic ? item.labelAr : item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl shadow-card overflow-hidden">
              <div className="p-6 md:p-8 border-b border-charcoal-100">
                <SectionHeader id="rooms" title="Available Rooms" titleAr="الغرف المتاحة" />
              </div>
              <div className={`p-6 md:p-8 ${expandedSections.rooms ? '' : 'hidden md:block'}`}>
                <div className="space-y-4">
                  {hotel.rooms.map((room, idx) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${
                        selectedRoom?.id === room.id
                          ? 'border-brand-800 bg-gold-50/50'
                          : 'border-charcoal-200 hover:border-charcoal-300'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 h-40 md:h-auto flex-shrink-0">
                          <img
                            src={`https://picsum.photos/id/${20 + idx}/400/300`}
                            alt={isArabic ? room.nameAr : room.nameEn}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4 md:p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-semibold text-charcoal-900 mb-1">
                                {isArabic ? room.nameAr : room.nameEn}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-charcoal-600">
                                <span className="flex items-center gap-1">
                                  <i className="fas fa-bed text-brand-800"></i>
                                  {room.bedType}
                                </span>
                                <span className="flex items-center gap-1">
                                  <i className="fas fa-users text-brand-800"></i>
                                  {room.capacity} {isArabic ? 'ضيوف' : 'guests'}
                                </span>
                              </div>
                            </div>
                            {selectedRoom?.id === room.id && (
                              <div className="w-6 h-6 rounded-full bg-brand-800 flex items-center justify-center">
                                <i className="fas fa-check text-white text-xs"></i>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {Object.entries(ROOM_AMENITY_ICONS).slice(0, 4).map(([key, item]) => (
                              <span
                                key={key}
                                className="inline-flex items-center gap-1 text-xs text-charcoal-600 bg-charcoal-100 px-2 py-1 rounded-lg"
                              >
                                <i className={`fas ${item.icon} text-charcoal-500`}></i>
                                {isArabic ? item.labelAr : item.label}
                              </span>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {room.breakfastIncluded && (
                              <Badge variant="success" size="sm">
                                <i className="fas fa-utensils mr-1"></i>
                                {isArabic ? 'إفطار مشمول' : 'Breakfast Included'}
                              </Badge>
                            )}
                            {room.freeCancellation && (
                              <Badge variant="success" size="sm">
                                <i className="fas fa-undo mr-1"></i>
                                {isArabic ? 'إلغاء مجاني' : 'Free Cancellation'}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-brand-900">{room.price}</span>
                              <span className="text-charcoal-500 ml-1">{isArabic ? 'ر.س' : 'SAR'}</span>
                              <span className="text-charcoal-400 text-sm ml-1">
                                /{isArabic ? 'ليلة' : 'night'}
                              </span>
                            </div>
                            <Button
                              variant={selectedRoom?.id === room.id ? 'primary' : 'secondary'}
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRoom(room);
                              }}
                            >
                              {selectedRoom?.id === room.id
                                ? isArabic ? 'تم الاختيار' : 'Selected'
                                : isArabic ? 'اختيار' : 'Select'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl shadow-card overflow-hidden">
              <div className="p-6 md:p-8 border-b border-charcoal-100">
                <SectionHeader id="amenities" title="Amenities" titleAr="المرافق" />
              </div>
              <div className={`p-6 md:p-8 ${expandedSections.amenities ? '' : 'hidden md:block'}`}>
                <div className="space-y-8">
                  {Object.entries(AMENITY_CATEGORIES).map(([key, category]) => {
                    const availableAmenities = category.items.filter((a) => hotel.amenities.includes(a));
                    if (availableAmenities.length === 0) return null;
                    return (
                      <div key={key}>
                        <h3 className="text-lg font-semibold text-charcoal-800 mb-4">
                          {isArabic ? category.titleAr : category.title}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {availableAmenities.map((amenityId) => {
                            const amenity = AMENITIES[amenityId];
                            if (!amenity) return null;
                            return (
                              <div
                                key={amenityId}
                                className="flex items-center gap-3 p-4 bg-cream-50 rounded-xl hover:bg-cream-100 transition-colors"
                              >
                                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                                  <i className={`fas ${amenity.icon} text-brand-900`}></i>
                                </div>
                                <span className="text-charcoal-700 font-medium">
                                  {isArabic ? amenity.labelAr : amenity.labelEn}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl shadow-card overflow-hidden">
              <div className="p-6 md:p-8 border-b border-charcoal-100">
                <SectionHeader id="location" title="Location" titleAr="الموقع" />
              </div>
              <div className={`${expandedSections.location ? '' : 'hidden md:block'}`}>
                <Map
                  center={mapCenter}
                  markers={[mapMarker]}
                  zoom={15}
                  height="300px"
                  className="w-full"
                />
                <div className="p-6 md:p-8">
                  <h3 className="text-lg font-semibold text-charcoal-800 mb-4">
                    {isArabic ? 'المعالم القريبة' : 'Nearby Attractions'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {NEARBY_ATTRACTIONS.map((attraction, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-cream-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                            <i className={`fas ${attraction.icon} text-brand-900 text-sm`}></i>
                          </div>
                          <span className="text-charcoal-700">
                            {isArabic ? attraction.nameAr : attraction.name}
                          </span>
                        </div>
                        <span className="text-charcoal-500 text-sm">{attraction.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl shadow-card overflow-hidden">
              <div className="p-6 md:p-8 border-b border-charcoal-100">
                <SectionHeader id="reviews" title="Guest Reviews" titleAr="تقييمات الضيوف" />
              </div>
              <div className={`p-6 md:p-8 ${expandedSections.reviews ? '' : 'hidden md:block'}`}>
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="flex-shrink-0 text-center md:text-left">
                    <div className="inline-flex flex-col items-center md:items-start">
                      <span className="text-5xl font-bold text-brand-900">{hotel.rating}</span>
                      <Rating rating={hotel.rating / 2} size="lg" showNumber={false} className="mt-2" />
                      <span className="text-charcoal-500 mt-1">
                        {hotel.reviewCount.toLocaleString()} {isArabic ? 'تقييم' : 'reviews'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    {RATING_BREAKDOWN.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <span className="w-24 text-sm text-charcoal-600">
                          {isArabic ? item.labelAr : item.label}
                        </span>
                        <div className="flex-1 h-2 bg-charcoal-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-800 rounded-full"
                            style={{ width: `${(item.score / 10) * 100}%` }}
                          ></div>
                        </div>
                        <span className="w-8 text-sm font-medium text-charcoal-700">{item.score}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {MOCK_REVIEWS.slice(0, visibleReviews).map((review) => (
                    <div key={review.id} className="p-5 bg-cream-50 rounded-2xl">
                      <div className="flex items-start gap-4">
                        <Avatar src={review.avatar} name={review.name} size="lg" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-charcoal-900">{review.name}</h4>
                              <span className="text-sm text-charcoal-500">
                                {new Date(review.date).toLocaleDateString(isArabic ? 'ar' : 'en', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <Rating rating={review.rating} size="sm" />
                          </div>
                          <p className="text-charcoal-700 leading-relaxed mb-3">{review.text}</p>
                          <button className="flex items-center gap-2 text-sm text-charcoal-500 hover:text-brand-900 transition-colors">
                            <i className="far fa-thumbs-up"></i>
                            <span>{isArabic ? 'مفيد' : 'Helpful'} ({review.helpful})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {visibleReviews < MOCK_REVIEWS.length && (
                  <div className="mt-6 text-center">
                    <Button
                      variant="secondary"
                      onClick={() => setVisibleReviews((prev) => prev + 3)}
                    >
                      {isArabic ? 'تحميل المزيد من التقييمات' : 'Load More Reviews'}
                    </Button>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white rounded-3xl shadow-card overflow-hidden">
              <div className="p-6 md:p-8 border-b border-charcoal-100">
                <SectionHeader id="policies" title="Hotel Policies" titleAr="سياسات الفندق" />
              </div>
              <div className={`p-6 md:p-8 ${expandedSections.policies ? '' : 'hidden md:block'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-cream-50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <i className="fas fa-sign-in-alt text-green-600"></i>
                      </div>
                      <h4 className="font-semibold text-charcoal-900">
                        {isArabic ? 'تسجيل الوصول' : 'Check-in'}
                      </h4>
                    </div>
                    <p className="text-charcoal-700">
                      {isArabic ? 'من الساعة 3:00 مساءً' : 'From 3:00 PM'}
                    </p>
                    <p className="text-sm text-charcoal-500 mt-1">
                      {isArabic
                        ? 'تسجيل الوصول المبكر متاح عند الطلب'
                        : 'Early check-in available upon request'}
                    </p>
                  </div>

                  <div className="p-5 bg-cream-50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <i className="fas fa-sign-out-alt text-red-600"></i>
                      </div>
                      <h4 className="font-semibold text-charcoal-900">
                        {isArabic ? 'تسجيل المغادرة' : 'Check-out'}
                      </h4>
                    </div>
                    <p className="text-charcoal-700">
                      {isArabic ? 'حتى الساعة 12:00 ظهراً' : 'Until 12:00 PM'}
                    </p>
                    <p className="text-sm text-charcoal-500 mt-1">
                      {isArabic
                        ? 'تسجيل المغادرة المتأخر متاح مع رسوم إضافية'
                        : 'Late check-out available with additional fees'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-5 bg-cream-50 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                      <i className="fas fa-undo text-brand-900"></i>
                    </div>
                    <h4 className="font-semibold text-charcoal-900">
                      {isArabic ? 'سياسة الإلغاء' : 'Cancellation Policy'}
                    </h4>
                  </div>
                  <ul className="space-y-2 text-charcoal-700">
                    <li className="flex items-start gap-2">
                      <i className="fas fa-check text-green-500 mt-1"></i>
                      <span>
                        {isArabic
                          ? 'إلغاء مجاني حتى 48 ساعة قبل الوصول'
                          : 'Free cancellation up to 48 hours before arrival'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-exclamation-circle text-amber-500 mt-1"></i>
                      <span>
                        {isArabic
                          ? 'إلغاء خلال 48 ساعة: رسوم ليلة واحدة'
                          : 'Cancellation within 48 hours: one night charge'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fas fa-times text-red-500 mt-1"></i>
                      <span>
                        {isArabic
                          ? 'عدم الحضور: رسوم الإقامة الكاملة'
                          : 'No-show: full stay charge'}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 p-5 bg-cream-50 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-charcoal-100 flex items-center justify-center">
                      <i className="fas fa-clipboard-list text-charcoal-600"></i>
                    </div>
                    <h4 className="font-semibold text-charcoal-900">
                      {isArabic ? 'قواعد المنزل' : 'House Rules'}
                    </h4>
                  </div>
                  <ul className="space-y-2 text-charcoal-700">
                    <li className="flex items-center gap-2">
                      <i className="fas fa-smoking-ban text-charcoal-500"></i>
                      <span>{isArabic ? 'التدخين غير مسموح في الغرف' : 'No smoking in rooms'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-paw text-charcoal-500"></i>
                      <span>{isArabic ? 'الحيوانات الأليفة مسموحة عند الطلب' : 'Pets allowed upon request'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-volume-mute text-charcoal-500"></i>
                      <span>{isArabic ? 'ساعات الهدوء: 10 مساءً - 7 صباحاً' : 'Quiet hours: 10 PM - 7 AM'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl shadow-luxury-lg p-6 border border-charcoal-100">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-brand-900">
                      {selectedRoom?.price || hotel.minPrice}
                    </span>
                    <span className="text-charcoal-600">{isArabic ? 'ر.س' : 'SAR'}</span>
                    <span className="text-charcoal-400">/{isArabic ? 'ليلة' : 'night'}</span>
                  </div>
                  {selectedRoom && (
                    <p className="text-sm text-charcoal-500 mt-1">
                      {isArabic ? selectedRoom.nameAr : selectedRoom.nameEn}
                    </p>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <DatePicker
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    onCheckInChange={setCheckInDate}
                    onCheckOutChange={setCheckOutDate}
                    layout="vertical"
                  />

                  <GuestSelector
                    adults={adults}
                    children={children}
                    rooms={rooms}
                    onAdultsChange={setAdults}
                    onChildrenChange={setChildren}
                    onRoomsChange={setRooms}
                  />
                </div>

                <Button fullWidth size="lg" onClick={handleBookNow} disabled={!selectedRoom}>
                  {isArabic ? 'احجز الآن' : 'Book Now'}
                </Button>

                {selectedRoom?.freeCancellation && (
                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-green-600">
                    <i className="fas fa-check-circle"></i>
                    <span>{isArabic ? 'إلغاء مجاني' : 'Free cancellation'}</span>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-charcoal-100">
                  <div className="flex items-center gap-3 text-sm text-charcoal-600">
                    <i className="fas fa-shield-alt text-brand-800"></i>
                    <span>{isArabic ? 'أفضل سعر مضمون' : 'Best price guaranteed'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-charcoal-200 p-4 z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-brand-900">
                {selectedRoom?.price || hotel.minPrice}
              </span>
              <span className="text-charcoal-500">{isArabic ? 'ر.س' : 'SAR'}</span>
              <span className="text-charcoal-400 text-sm">/{isArabic ? 'ليلة' : 'night'}</span>
            </div>
            {selectedRoom?.freeCancellation && (
              <span className="text-xs text-green-600">
                {isArabic ? 'إلغاء مجاني' : 'Free cancellation'}
              </span>
            )}
          </div>
          <Button size="lg" onClick={handleBookNow} disabled={!selectedRoom}>
            {isArabic ? 'احجز الآن' : 'Book Now'}
          </Button>
        </div>
      </div>

      <Modal isOpen={showGalleryModal} onClose={() => setShowGalleryModal(false)} size="full">
        <ModalHeader onClose={() => setShowGalleryModal(false)}>
          {isArabic ? 'معرض الصور' : 'Photo Gallery'} ({galleryIndex + 1}/{allImages.length})
        </ModalHeader>
        <ModalBody className="p-0">
          <div className="relative aspect-video bg-charcoal-950">
            <img
              src={allImages[galleryIndex]}
              alt=""
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setGalleryIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm text-charcoal-800 hover:bg-white flex items-center justify-center transition-all"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              onClick={() => setGalleryIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm text-charcoal-800 hover:bg-white flex items-center justify-center transition-all"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <div className="p-4 flex gap-2 overflow-x-auto">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setGalleryIndex(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden ring-2 transition-all ${
                  galleryIndex === idx ? 'ring-brand-800' : 'ring-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </ModalBody>
      </Modal>

      <div className="pb-24 lg:pb-0"></div>
    </div>
  );
};

export default HotelDetails;
