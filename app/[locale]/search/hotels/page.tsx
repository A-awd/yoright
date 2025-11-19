import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Wifi, Coffee, Car, Dumbbell, Utensils, CheckCircle, Map, Filter, ChevronDown, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const VALID_CITIES = ['riyadh', 'dubai', 'jeddah', 'london', 'paris', 'bangkok'];

const CITY_NAMES = {
  riyadh: { en: 'Riyadh', ar: 'الرياض' },
  dubai: { en: 'Dubai', ar: 'دبي' },
  jeddah: { en: 'Jeddah', ar: 'جدة' },
  london: { en: 'London', ar: 'لندن' },
  paris: { en: 'Paris', ar: 'باريس' },
  bangkok: { en: 'Bangkok', ar: 'بانكوك' },
};

export default async function HotelsSearchPage({ 
  params,
  searchParams 
}: { 
  params: { locale: string };
  searchParams: { city?: string; checkIn?: string; checkOut?: string; guests?: string };
}) {
  const locale = params.locale;
  const city = searchParams.city || 'riyadh';
  
  const isValidCity = VALID_CITIES.includes(city);
  
  if (!isValidCity) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto rounded-xl shadow-lg border-0">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-4 text-gray-900">
                {locale === 'ar' ? 'مدينة غير صالحة' : 'Invalid City'}
              </h1>
              <p className="text-gray-600 mb-6">
                {locale === 'ar' 
                  ? 'المدينة المحددة غير متاحة. الرجاء اختيار مدينة من القائمة المتاحة.' 
                  : 'The selected city is not available. Please choose a city from the available list.'}
              </p>
              <Link href={`/${locale}`}>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  {locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  let hotels = [];
  let error = false;
  
  try {
    const queryParams = new URLSearchParams({
      cityId: city,
      guests: searchParams.guests || '2',
    });
    
    if (searchParams.checkIn) {
      queryParams.set('checkIn', searchParams.checkIn);
    }
    if (searchParams.checkOut) {
      queryParams.set('checkOut', searchParams.checkOut);
    }

    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:5000'}/api/hotels/search?${queryParams.toString()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch hotels');
    }

    const data = await response.json();
    hotels = data.hotels || [];
  } catch (err) {
    console.error('Error fetching hotels:', err);
    error = true;
  }
  
  const cityName = CITY_NAMES[city as keyof typeof CITY_NAMES];
  const displayCityName = locale === 'ar' ? cityName.ar : cityName.en;

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {locale === 'ar' ? `نتائج البحث - ${displayCityName}` : `Search Results - ${displayCityName}`}
          </h1>
          <p className="text-gray-600">
            {error 
              ? (locale === 'ar' ? 'حدث خطأ أثناء البحث' : 'An error occurred while searching')
              : `${hotels.length} ${locale === 'ar' ? 'فندق متاح' : 'hotels available'}`
            }
          </p>
        </div>

        {error && (
          <Card className="max-w-2xl mx-auto rounded-xl shadow-lg border-0 mb-8">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                {locale === 'ar' ? 'عذراً، حدث خطأ' : 'Sorry, an error occurred'}
              </h2>
              <p className="text-gray-600 mb-6">
                {locale === 'ar' 
                  ? 'لم نتمكن من جلب الفنادق في الوقت الحالي. الرجاء المحاولة مرة أخرى لاحقاً.' 
                  : 'We could not fetch hotels at this time. Please try again later.'}
              </p>
              <Link href={`/${locale}`}>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  {locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {!error && hotels.length === 0 && (
          <Card className="max-w-2xl mx-auto rounded-xl shadow-lg border-0 mb-8">
            <CardContent className="p-8 text-center">
              <MapPin className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                {locale === 'ar' ? 'لا توجد فنادق متاحة' : 'No Hotels Available'}
              </h2>
              <p className="text-gray-600 mb-6">
                {locale === 'ar' 
                  ? `لم نجد أي فنادق متاحة في ${displayCityName} للتواريخ المحددة. جرب تواريخ مختلفة أو مدينة أخرى.` 
                  : `We couldn't find any available hotels in ${displayCityName} for the selected dates. Try different dates or another city.`}
              </p>
              <Link href={`/${locale}`}>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  {locale === 'ar' ? 'ابحث عن وجهة أخرى' : 'Search Another Destination'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {!error && hotels.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-80 flex-shrink-0">
            <Card className="sticky top-24 rounded-xl shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-bold">
                    {locale === 'ar' ? 'فلترة النتائج' : 'Filter Results'}
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      {locale === 'ar' ? 'نطاق السعر' : 'Price Range'}
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="2000" 
                      className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>0 SAR</span>
                      <span>2000 SAR</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      {locale === 'ar' ? 'التصنيف بالنجوم' : 'Star Rating'}
                    </label>
                    <div className="space-y-3">
                      {[5, 4, 3].map(star => (
                        <label key={star} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer" 
                          />
                          <div className="flex items-center gap-1">
                            {[...Array(star)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm group-hover:text-purple-600 transition">{star} {locale === 'ar' ? 'نجوم' : 'Stars'}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      {locale === 'ar' ? 'المرافق' : 'Amenities'}
                    </label>
                    <div className="space-y-3">
                      {[
                        { icon: Wifi, label: locale === 'ar' ? 'واي فاي مجاني' : 'Free WiFi' },
                        { icon: Coffee, label: locale === 'ar' ? 'إفطار مجاني' : 'Free Breakfast' },
                        { icon: Car, label: locale === 'ar' ? 'موقف سيارات' : 'Parking' },
                        { icon: Dumbbell, label: locale === 'ar' ? 'نادي رياضي' : 'Gym' },
                      ].map((amenity, i) => (
                        <label key={i} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer" 
                          />
                          <amenity.icon className="w-4 h-4 text-purple-600" />
                          <span className="text-sm group-hover:text-purple-600 transition">{amenity.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  {locale === 'ar' ? 'إظهار' : 'Showing'} <span className="font-semibold text-purple-600">{hotels.length}</span> {locale === 'ar' ? 'نتيجة' : 'results'}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-lg border-purple-200 hover:bg-purple-50 transition">
                  <Map className="w-4 h-4 mr-2" />
                  {locale === 'ar' ? 'عرض الخريطة' : 'Map View'}
                </Button>
                
                <div className="relative">
                  <select className="px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-white hover:border-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition appearance-none cursor-pointer">
                    <option>{locale === 'ar' ? 'موصى به' : 'Recommended'}</option>
                    <option>{locale === 'ar' ? 'السعر: منخفض إلى مرتفع' : 'Price: Low to High'}</option>
                    <option>{locale === 'ar' ? 'السعر: مرتفع إلى منخفض' : 'Price: High to Low'}</option>
                    <option>{locale === 'ar' ? 'التقييم' : 'Rating'}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {hotels.map((hotel: any) => (
                <a key={hotel.id} href={`/${locale}/hotel/${hotel.id}`}>
                  <Card className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0">
                    <div className="flex flex-col md:flex-row gap-0 md:gap-6">
                      <div className="relative w-full md:w-80 h-64 md:h-auto bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 overflow-hidden flex-shrink-0">
                        {hotel.images && hotel.images[0] && (
                          <img 
                            src={hotel.images[0]} 
                            alt={hotel.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        )}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-lg">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-sm">{hotel.rating || 4.5}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 p-6">
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-600 transition">
                              {hotel.name}
                            </h3>
                            <div className="flex items-center gap-2 mb-3 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{hotel.location?.address || displayCityName}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-yellow-500 font-semibold">★ {hotel.rating || 4.5}</span>
                              <span className="text-sm text-gray-600">
                                ({hotel.reviewCount || 120} {locale === 'ar' ? 'تقييم' : 'reviews'})
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-2">{hotel.description || (locale === 'ar' ? 'فندق فاخر مع خدمات متميزة' : 'Luxury hotel with premium services')}</p>
                            
                            <div className="flex gap-2 flex-wrap mb-4">
                              {hotel.freeCancellation && (
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                  <CheckCircle className="w-3 h-3" />
                                  {locale === 'ar' ? 'إلغاء مجاني' : 'Free Cancellation'}
                                </span>
                              )}
                              {hotel.breakfastIncluded && (
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                  <Coffee className="w-3 h-3" />
                                  {locale === 'ar' ? 'إفطار مجاني' : 'Free Breakfast'}
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                <Wifi className="w-3 h-3" />
                                {locale === 'ar' ? 'واي فاي مجاني' : 'Free WiFi'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-end justify-between pt-4 border-t">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">{locale === 'ar' ? 'يبدأ من' : 'Starting from'}</p>
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                  {hotel.minPrice}
                                </span>
                                <span className="text-gray-600 font-medium">{locale === 'ar' ? 'ر.س' : 'SAR'}</span>
                              </div>
                              <p className="text-xs text-gray-500">{locale === 'ar' ? 'لليلة الواحدة' : 'per night'}</p>
                            </div>
                            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg shadow-lg hover:shadow-xl transition-all">
                              {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </main>
  );
}
