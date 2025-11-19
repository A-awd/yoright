'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

interface SearchFormProps {
  locale: string;
}

const POPULAR_CITIES = [
  { slug: 'riyadh', nameEn: 'Riyadh', nameAr: 'الرياض' },
  { slug: 'dubai', nameEn: 'Dubai', nameAr: 'دبي' },
  { slug: 'jeddah', nameEn: 'Jeddah', nameAr: 'جدة' },
  { slug: 'london', nameEn: 'London', nameAr: 'لندن' },
  { slug: 'paris', nameEn: 'Paris', nameAr: 'باريس' },
  { slug: 'bangkok', nameEn: 'Bangkok', nameAr: 'بانكوك' },
];

export default function SearchForm({ locale }: SearchFormProps) {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city && checkIn && checkOut) {
      const params = new URLSearchParams({
        city,
        checkIn,
        checkOut,
        guests: guests.toString()
      });
      router.push(`/${locale}/search/hotels?${params.toString()}`);
    }
  };

  return (
    <Card className="max-w-5xl mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                <MapPin className="inline w-4 h-4 mr-1" />
                {locale === 'ar' ? 'الوجهة' : 'Destination'}
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition cursor-pointer"
              >
                <option value="">
                  {locale === 'ar' ? 'اختر مدينة' : 'Select a city'}
                </option>
                {POPULAR_CITIES.map((cityOption) => (
                  <option key={cityOption.slug} value={cityOption.slug}>
                    {locale === 'ar' ? cityOption.nameAr : cityOption.nameEn}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                <Calendar className="inline w-4 h-4 mr-1" />
                {locale === 'ar' ? 'تسجيل الوصول' : 'Check-in'}
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                <Calendar className="inline w-4 h-4 mr-1" />
                {locale === 'ar' ? 'تسجيل المغادرة' : 'Check-out'}
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                <Users className="inline w-4 h-4 mr-1" />
                {locale === 'ar' ? 'الضيوف' : 'Guests'}
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full mt-6 py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            size="lg"
          >
            <Search className="w-5 h-5 mr-2" />
            {locale === 'ar' ? 'ابحث عن فندق' : 'Search Hotels'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
