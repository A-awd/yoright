import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const POPULAR_CITIES = [
  { id: '1', nameAr: 'الرياض', nameEn: 'Riyadh', slug: 'riyadh', image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e' },
  { id: '2', nameAr: 'دبي', nameEn: 'Dubai', slug: 'dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c' },
  { id: '3', nameAr: 'جدة', nameEn: 'Jeddah', slug: 'jeddah', image: 'https://images.unsplash.com/photo-1591608971362-f08b2a75731a' },
  { id: '4', nameAr: 'لندن', nameEn: 'London', slug: 'london', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad' },
  { id: '5', nameAr: 'باريس', nameEn: 'Paris', slug: 'paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34' },
  { id: '6', nameAr: 'بانكوك', nameEn: 'Bangkok', slug: 'bangkok', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365' },
];

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = params.locale;

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {locale === 'ar' ? 'يورايت - احجز رحلتك القادمة' : 'YoRight - Book Your Next Trip'}
        </h1>
        <p className="text-xl text-gray-600">
          {locale === 'ar' ? 'اكتشف أفضل الفنادق بأسعار منافسة' : 'Discover the best hotels at competitive prices'}
        </p>
      </div>

      <Card className="max-w-4xl mx-auto mb-16 shadow-xl">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                {locale === 'ar' ? 'إلى أين تريد السفر؟' : 'Where do you want to go?'}
              </label>
              <input
                type="text"
                placeholder={locale === 'ar' ? 'اختر المدينة' : 'Choose a city'}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {locale === 'ar' ? 'تاريخ الوصول' : 'Check-in'}
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {locale === 'ar' ? 'تاريخ المغادرة' : 'Check-out'}
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>
          <Button className="w-full mt-6" size="lg">
            {locale === 'ar' ? 'بحث' : 'Search'}
          </Button>
        </CardContent>
      </Card>

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {locale === 'ar' ? 'وجهات شائعة' : 'Popular Destinations'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_CITIES.map((city) => (
            <Link key={city.id} href={`/${locale}/search/hotels?city=${city.slug}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400">
                  <img
                    src={city.image}
                    alt={locale === 'ar' ? city.nameAr : city.nameEn}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold">
                    {locale === 'ar' ? city.nameAr : city.nameEn}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
