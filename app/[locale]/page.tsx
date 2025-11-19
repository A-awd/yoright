import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import SearchForm from '@/components/SearchForm';
import { Sparkles, Shield, Clock, Award } from 'lucide-react';

const POPULAR_CITIES = [
  { id: '1', nameAr: 'الرياض', nameEn: 'Riyadh', slug: 'riyadh', image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e' },
  { id: '2', nameAr: 'دبي', nameEn: 'Dubai', slug: 'dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c' },
  { id: '3', nameAr: 'جدة', nameEn: 'Jeddah', slug: 'jeddah', image: 'https://images.unsplash.com/photo-1591608971362-f08b2a75731a' },
  { id: '4', nameAr: 'لندن', nameEn: 'London', slug: 'london', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad' },
  { id: '5', nameAr: 'باريس', nameEn: 'Paris', slug: 'paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34' },
  { id: '6', nameAr: 'بانكوك', nameEn: 'Bangkok', slug: 'bangkok', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365' },
];

const FEATURES = [
  { icon: Shield, titleAr: 'حجز آمن', titleEn: 'Secure Booking', descAr: 'حماية بياناتك على مدار الساعة', descEn: '24/7 data protection' },
  { icon: Clock, titleAr: 'دعم فوري', titleEn: 'Instant Support', descAr: 'فريق دعم متاح على مدار الساعة', descEn: '24/7 customer service' },
  { icon: Award, titleAr: 'أفضل الأسعار', titleEn: 'Best Prices', descAr: 'ضمان أفضل الأسعار', descEn: 'Price match guarantee' },
  { icon: Sparkles, titleAr: 'تجربة مميزة', titleEn: 'Premium Experience', descAr: 'فنادق فاخرة وخدمة متميزة', descEn: 'Luxury hotels & service' },
];

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = params.locale;

  return (
    <main>
      <div className="relative bg-gradient-to-br from-brand-primary via-brand-primary-dark to-brand-primary-light overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJsLTItMnYtMmgydjJoMnYyem0wLTEwdi0yaDJ2MmgtmnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              {locale === 'ar' ? 'اكتشف رحلتك القادمة' : 'Discover Your Next Journey'}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              {locale === 'ar' ? 'ابحث عن أفضل الفنادق في أكثر من 1000 وجهة حول العالم' : 'Find the best hotels in over 1,000 destinations worldwide'}
            </p>
          </div>
          <div className="mb-8">
            <SearchForm locale={locale} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary/10 to-brand-secondary/20 mb-4">
                  <Icon className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {locale === 'ar' ? feature.titleAr : feature.titleEn}
                </h3>
                <p className="text-sm text-gray-600">
                  {locale === 'ar' ? feature.descAr : feature.descEn}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-primary to-brand-primary-light bg-clip-text text-transparent">
              {locale === 'ar' ? 'وجهات شائعة' : 'Popular Destinations'}
            </h2>
            <p className="text-gray-600">
              {locale === 'ar' ? 'استكشف أجمل المدن حول العالم' : 'Explore the most beautiful cities around the world'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_CITIES.map((city) => (
              <Link key={city.id} href={`/${locale}/search/hotels?city=${city.slug}`}>
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-0">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
                    <img
                      src={city.image}
                      alt={locale === 'ar' ? city.nameAr : city.nameEn}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {locale === 'ar' ? city.nameAr : city.nameEn}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {locale === 'ar' ? 'اكتشف الفنادق' : 'Explore Hotels'}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-brand-primary to-brand-primary-light rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            {locale === 'ar' ? 'جاهز لبدء رحلتك؟' : 'Ready to Start Your Journey?'}
          </h2>
          <p className="text-lg mb-6 text-white/90">
            {locale === 'ar' ? 'انضم إلى ملايين المسافرين الذين يثقون بنا لحجز فنادقهم' : 'Join millions of travelers who trust us for their hotel bookings'}
          </p>
          <Link href={`/${locale}/search/hotels`}>
            <button className="px-8 py-4 bg-brand-secondary text-white rounded-xl font-semibold hover:bg-brand-accent transition-colors shadow-lg">
              {locale === 'ar' ? 'ابدأ البحث الآن' : 'Start Searching Now'}
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
