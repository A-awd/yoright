import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function HotelsSearchPage({ 
  params,
  searchParams 
}: { 
  params: { locale: string };
  searchParams: { city?: string; checkIn?: string; checkOut?: string; guests?: string };
}) {
  const locale = params.locale;
  const city = searchParams.city || 'riyadh';

  const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:5000'}/api/hotels/search?cityId=${city}&guests=${searchParams.guests || '2'}`, {
    cache: 'no-store',
  });

  const data = await response.json();
  const hotels = data.hotels || [];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        <aside className="w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">
                {locale === 'ar' ? 'فلترة' : 'Filters'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    {locale === 'ar' ? 'نطاق السعر' : 'Price Range'}
                  </label>
                  <input type="range" min="0" max="2000" className="w-full mt-2" />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {locale === 'ar' ? 'التصنيف' : 'Stars'}
                  </label>
                  <div className="space-y-2 mt-2">
                    {[5, 4, 3].map(star => (
                      <label key={star} className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">{star} {locale === 'ar' ? 'نجوم' : 'Stars'}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {hotels.length} {locale === 'ar' ? 'فندق' : 'Hotels'}
            </h1>
            <select className="px-4 py-2 border rounded-lg">
              <option>{locale === 'ar' ? 'موصى به' : 'Recommended'}</option>
              <option>{locale === 'ar' ? 'السعر: منخفض إلى مرتفع' : 'Price: Low to High'}</option>
              <option>{locale === 'ar' ? 'التقييم' : 'Rating'}</option>
            </select>
          </div>

          <div className="space-y-4">
            {hotels.map((hotel: any) => (
              <a key={hotel.id} href={`/${locale}/hotel/${hotel.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex gap-4 p-4">
                    <div className="w-64 h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg overflow-hidden flex-shrink-0">
                      {hotel.images && hotel.images[0] && (
                        <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-yellow-500">★ {hotel.rating || 4.5}</span>
                            <span className="text-sm text-gray-600">
                              ({hotel.reviewCount || 120} {locale === 'ar' ? 'تقييم' : 'reviews'})
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{hotel.description}</p>
                          <div className="flex gap-2 flex-wrap">
                            {hotel.freeCancellation && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                {locale === 'ar' ? 'إلغاء مجاني' : 'Free Cancellation'}
                              </span>
                            )}
                            {hotel.breakfastIncluded && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                {locale === 'ar' ? 'إفطار مجاني' : 'Free Breakfast'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">
                            {hotel.minPrice} {locale === 'ar' ? 'ر.س' : 'SAR'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {locale === 'ar' ? 'لليلة' : 'per night'}
                          </div>
                          <Button className="mt-4">
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
    </main>
  );
}
