import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Language, Hotel } from '../types';
import { api } from '../services/api';
import { Button, Input, Select, DatePicker, GuestSelector, Modal, ModalHeader, ModalBody, ModalFooter } from '../components/ui';
import { HotelCard } from '../components/HotelCard';
import { FilterPanel, FilterState } from '../components/FilterPanel';

interface SearchResultsProps {
  lang: Language;
}

type SortOption = 'recommended' | 'price_low' | 'price_high' | 'rating' | 'distance';
type ViewMode = 'grid' | 'list';

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const HotelIcon = () => (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-3xl shadow-card overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-charcoal-200" />
    <div className="p-5 space-y-3">
      <div className="h-6 bg-charcoal-200 rounded w-3/4" />
      <div className="h-4 bg-charcoal-100 rounded w-1/2" />
      <div className="h-4 bg-charcoal-100 rounded w-2/3" />
      <div className="flex justify-between pt-4 border-t border-charcoal-100">
        <div className="h-8 bg-charcoal-200 rounded w-24" />
        <div className="h-10 bg-charcoal-100 rounded w-28" />
      </div>
    </div>
  </div>
);

const SkeletonListItem: React.FC = () => (
  <div className="bg-white rounded-3xl shadow-card overflow-hidden flex flex-col md:flex-row animate-pulse">
    <div className="w-full md:w-72 h-48 bg-charcoal-200" />
    <div className="p-5 flex-1 space-y-3">
      <div className="h-6 bg-charcoal-200 rounded w-1/2" />
      <div className="h-4 bg-charcoal-100 rounded w-1/3" />
      <div className="h-4 bg-charcoal-100 rounded w-2/3" />
      <div className="flex gap-2 pt-2">
        <div className="h-6 bg-charcoal-100 rounded w-16" />
        <div className="h-6 bg-charcoal-100 rounded w-16" />
        <div className="h-6 bg-charcoal-100 rounded w-16" />
      </div>
    </div>
    <div className="p-5 flex flex-col items-end justify-between border-t md:border-t-0 md:border-l border-charcoal-100">
      <div className="h-8 bg-charcoal-200 rounded w-24" />
      <div className="h-10 bg-charcoal-100 rounded w-28" />
    </div>
  </div>
);

const SORT_OPTIONS = [
  { value: 'recommended', labelEn: 'Recommended', labelAr: 'مُوصى به' },
  { value: 'price_low', labelEn: 'Price (Low to High)', labelAr: 'السعر (من الأقل للأعلى)' },
  { value: 'price_high', labelEn: 'Price (High to Low)', labelAr: 'السعر (من الأعلى للأقل)' },
  { value: 'rating', labelEn: 'Rating', labelAr: 'التقييم' },
  { value: 'distance', labelEn: 'Distance', labelAr: 'المسافة' },
];

const ITEMS_PER_PAGE = 12;

const defaultFilters: FilterState = {
  priceMin: undefined,
  priceMax: undefined,
  starRatings: [],
  propertyTypes: [],
  amenities: [],
  mealPlans: [],
};

const getDefaultCheckIn = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const getDefaultCheckOut = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

const SearchResults: React.FC<SearchResultsProps> = ({ lang }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const [destination, setDestination] = useState(searchParams.get('cityId') || searchParams.get('city') || '');
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : getDefaultCheckIn()
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : getDefaultCheckOut()
  );
  const [adults, setAdults] = useState(parseInt(searchParams.get('guests') || '2'));
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const fetchHotels = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
      } else {
        setLoadingMore(true);
      }

      const response = await api.hotels.search({
        cityId: searchParams.get('cityId') || undefined,
        checkIn: searchParams.get('checkIn') || undefined,
        checkOut: searchParams.get('checkOut') || undefined,
        adults: parseInt(searchParams.get('guests') || '2'),
      });

      let filteredHotels = response.items;

      if (filters.priceMin !== undefined) {
        filteredHotels = filteredHotels.filter((h) => (h.minPrice ?? h.pricePerNight ?? 0) >= filters.priceMin!);
      }
      if (filters.priceMax !== undefined) {
        filteredHotels = filteredHotels.filter((h) => (h.minPrice ?? h.pricePerNight ?? 0) <= filters.priceMax!);
      }
      if (filters.starRatings.length > 0) {
        filteredHotels = filteredHotels.filter((h) => filters.starRatings.includes(h.stars));
      }
      if (filters.amenities.length > 0) {
        filteredHotels = filteredHotels.filter((h) =>
          filters.amenities.some((a) => h.amenities.includes(a))
        );
      }

      switch (sortBy) {
        case 'price_low':
          filteredHotels.sort((a, b) => (a.minPrice ?? a.pricePerNight ?? 0) - (b.minPrice ?? b.pricePerNight ?? 0));
          break;
        case 'price_high':
          filteredHotels.sort((a, b) => (b.minPrice ?? b.pricePerNight ?? 0) - (a.minPrice ?? a.pricePerNight ?? 0));
          break;
        case 'rating':
          filteredHotels.sort((a, b) => b.rating - a.rating);
          break;
        case 'distance':
          filteredHotels.sort(
            (a, b) => a.location.distanceToCenterKm - b.location.distanceToCenterKm
          );
          break;
      }

      if (reset) {
        setHotels(filteredHotels.slice(0, ITEMS_PER_PAGE));
      } else {
        setHotels((prev) => [...prev, ...filteredHotels.slice(prev.length, prev.length + ITEMS_PER_PAGE)]);
      }
      setTotal(filteredHotels.length);
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchParams, filters, sortBy]);

  useEffect(() => {
    fetchHotels(true);
  }, [searchParams, filters, sortBy]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('cityId', destination);
    if (checkInDate) params.set('checkIn', checkInDate.toISOString().split('T')[0]);
    if (checkOutDate) params.set('checkOut', checkOutDate.toISOString().split('T')[0]);
    params.set('guests', adults.toString());
    setSearchParams(params);
  };

  const handleApplyFilters = () => {
    setShowFiltersModal(false);
    fetchHotels(true);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  const handleLoadMore = () => {
    setCurrentPage((p) => p + 1);
    fetchHotels(false);
  };

  const hasMoreHotels = hotels.length < total;

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) count++;
    if (filters.starRatings.length > 0) count++;
    if (filters.propertyTypes.length > 0) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.mealPlans.length > 0) count++;
    return count;
  }, [filters]);

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-luxury border-b border-charcoal-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Input
                placeholder={isArabic ? 'الوجهة' : 'Destination'}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                leftIcon={<LocationIcon />}
              />
              <DatePicker
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onCheckInChange={setCheckInDate}
                onCheckOutChange={setCheckOutDate}
              />
              <GuestSelector
                adults={adults}
                children={children}
                rooms={rooms}
                onAdultsChange={setAdults}
                onChildrenChange={setChildren}
                onRoomsChange={setRooms}
              />
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  leftIcon={<SearchIcon />}
                  className="flex-1"
                >
                  {isArabic ? 'بحث' : 'Search'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowFiltersModal(true)}
                  className="lg:hidden relative"
                >
                  <FilterIcon />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-800 text-charcoal-950 text-xs rounded-full flex items-center justify-center font-medium">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-32">
              <FilterPanel
                lang={lang}
                filters={filters}
                onFiltersChange={setFilters}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
              />
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-display font-bold text-charcoal-900">
                  {loading ? (
                    <span className="inline-block h-8 w-48 bg-charcoal-200 rounded animate-pulse" />
                  ) : (
                    <>
                      {total} {isArabic ? 'فندق متاح' : 'hotels found'}
                      {destination && (
                        <span className="text-charcoal-500 font-normal">
                          {' '}
                          {isArabic ? 'في' : 'in'} {destination}
                        </span>
                      )}
                    </>
                  )}
                </h1>
                {activeFilterCount > 0 && (
                  <p className="text-sm text-charcoal-500 mt-1">
                    {activeFilterCount} {isArabic ? 'فلتر نشط' : 'filter(s) active'}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Select
                  options={SORT_OPTIONS.map((opt) => ({
                    value: opt.value,
                    label: isArabic ? opt.labelAr : opt.labelEn,
                  }))}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-48"
                />

                <div className="hidden sm:flex bg-white rounded-xl border-2 border-charcoal-200 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-brand-800 text-charcoal-950'
                        : 'text-charcoal-500 hover:bg-charcoal-50'
                    }`}
                  >
                    <GridIcon />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-brand-800 text-charcoal-950'
                        : 'text-charcoal-500 hover:bg-charcoal-50'
                    }`}
                  >
                    <ListIcon />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {Array.from({ length: 6 }).map((_, i) =>
                  viewMode === 'grid' ? <SkeletonCard key={i} /> : <SkeletonListItem key={i} />
                )}
              </div>
            ) : hotels.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {hotels.map((hotel) => (
                      <HotelCard
                        key={hotel.id}
                        id={hotel.id}
                        nameAr={hotel.nameAr}
                        nameEn={hotel.nameEn}
                        cityAr={hotel.location.addressAr.split(',')[0] || ''}
                        cityEn={hotel.location.addressEn.split(',')[0] || ''}
                        countryAr="السعودية"
                        countryEn="Saudi Arabia"
                        image={hotel.thumbnail}
                        stars={hotel.stars}
                        rating={hotel.rating}
                        reviewCount={hotel.reviewCount}
                        pricePerNight={hotel.minPrice ?? hotel.pricePerNight ?? 0}
                        lang={lang}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {hotels.map((hotel) => (
                      <div
                        key={hotel.id}
                        onClick={() => navigate(`/hotel/${hotel.id}`)}
                        className="bg-white rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col md:flex-row cursor-pointer group"
                      >
                        <div className="relative w-full md:w-72 h-48 overflow-hidden">
                          <img
                            src={hotel.thumbnail}
                            alt={isArabic ? hotel.nameAr : hotel.nameEn}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute bottom-3 left-3 flex gap-0.5">
                            {Array.from({ length: hotel.stars }).map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>

                        <div className="flex-1 p-5">
                          <h3 className="font-display text-xl font-semibold text-charcoal-900 mb-2">
                            {isArabic ? hotel.nameAr : hotel.nameEn}
                          </h3>
                          <div className="flex items-center gap-1.5 text-charcoal-500 mb-2">
                            <LocationIcon />
                            <span className="text-sm">
                              {isArabic ? hotel.location.addressAr : hotel.location.addressEn}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="bg-brand-800 text-charcoal-950 px-2 py-1 rounded-lg text-sm font-semibold">
                              {hotel.rating}
                            </span>
                            <span className="text-sm text-charcoal-500">
                              ({hotel.reviewCount} {isArabic ? 'تقييم' : 'reviews'})
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {hotel.amenities.slice(0, 4).map((amenity) => (
                              <span
                                key={amenity}
                                className="text-xs bg-cream-100 text-charcoal-600 px-2.5 py-1 rounded-full"
                              >
                                {amenity}
                              </span>
                            ))}
                            {hotel.amenities.length > 4 && (
                              <span className="text-xs text-charcoal-400">
                                +{hotel.amenities.length - 4} {isArabic ? 'المزيد' : 'more'}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-5 flex flex-col items-end justify-between border-t md:border-t-0 md:border-l border-charcoal-100 md:min-w-[180px]">
                          <div className="text-right">
                            <p className="text-brand-900 font-display text-2xl font-bold">
                              {(hotel.minPrice ?? hotel.pricePerNight ?? 0).toLocaleString()}
                            </p>
                            <p className="text-charcoal-500 text-sm">
                              SAR / {isArabic ? 'ليلة' : 'night'}
                            </p>
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/hotel/${hotel.id}`);
                            }}
                          >
                            {isArabic ? 'عرض التفاصيل' : 'View Details'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {hasMoreHotels && (
                  <div className="text-center mt-8">
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={handleLoadMore}
                      loading={loadingMore}
                    >
                      {isArabic ? 'تحميل المزيد' : 'Load More Hotels'}
                    </Button>
                    <p className="text-sm text-charcoal-500 mt-2">
                      {isArabic
                        ? `عرض ${hotels.length} من ${total} فندق`
                        : `Showing ${hotels.length} of ${total} hotels`}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl shadow-card">
                <div className="text-charcoal-300 mb-6">
                  <HotelIcon />
                </div>
                <h2 className="text-2xl font-display font-semibold text-charcoal-900 mb-3">
                  {isArabic ? 'لم يتم العثور على فنادق' : 'No hotels found'}
                </h2>
                <p className="text-charcoal-500 mb-6 max-w-md mx-auto">
                  {isArabic
                    ? 'عذراً، لم نتمكن من العثور على فنادق تطابق معايير البحث الخاصة بك. جرب تعديل الفلاتر أو تغيير التواريخ.'
                    : "Sorry, we couldn't find any hotels matching your criteria. Try adjusting your filters or changing your dates."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="primary" onClick={handleClearFilters}>
                    {isArabic ? 'مسح الفلاتر' : 'Clear Filters'}
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/')}>
                    {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <Modal isOpen={showFiltersModal} onClose={() => setShowFiltersModal(false)} size="lg">
        <ModalHeader onClose={() => setShowFiltersModal(false)}>
          {isArabic ? 'تصفية النتائج' : 'Filter Results'}
        </ModalHeader>
        <ModalBody className="max-h-[60vh] overflow-y-auto">
          <FilterPanel
            lang={lang}
            filters={filters}
            onFiltersChange={setFilters}
            onApply={() => {}}
            onClear={handleClearFilters}
            className="shadow-none p-0"
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={handleClearFilters}>
            {isArabic ? 'مسح الكل' : 'Clear All'}
          </Button>
          <Button variant="primary" onClick={handleApplyFilters}>
            {isArabic ? 'عرض النتائج' : 'Show Results'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default SearchResults;
