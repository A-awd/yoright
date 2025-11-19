import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { rateHawkAdapter } from '@/lib/adapters/ratehawk';
import { Star, MapPin, Wifi, Coffee, Car, Dumbbell, Users, Bed, CheckCircle, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function HotelDetailsPage({ 
  params 
}: { 
  params: { locale: string; id: string };
}) {
  const locale = params.locale;
  const checkIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const checkOut = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { hotel, rooms } = await rateHawkAdapter.getHotelDetails(params.id, checkIn, checkOut);

  const amenityIcons: any = {
    'wifi': Wifi,
    'free wifi': Wifi,
    'parking': Car,
    'gym': Dumbbell,
    'breakfast': Coffee,
    'restaurant': Coffee,
    'default': CheckCircle
  };

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    for (const key in amenityIcons) {
      if (lower.includes(key)) {
        return amenityIcons[key];
      }
    }
    return amenityIcons.default;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-primary/5 to-white">
      <div className="container mx-auto px-4 py-8">
        <Link href={`/${locale}/search/hotels`} className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">{locale === 'ar' ? 'العودة إلى النتائج' : 'Back to Results'}</span>
        </Link>

        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-brand-primary to-brand-primary-light bg-clip-text text-transparent">
            {hotel.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 px-3 py-1.5 rounded-full">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-lg">{hotel.rating || 4.5}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{hotel.location.address}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-xl overflow-hidden">
            {hotel.images.slice(0, 1).map((img, i) => (
              <div key={i} className="md:col-span-2 md:row-span-2 h-96 md:h-full bg-gradient-to-br from-brand-primary via-brand-primary-light to-brand-secondary overflow-hidden group">
                <img src={img} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
            {hotel.images.slice(1, 5).map((img, i) => (
              <div key={i} className="h-48 bg-gradient-to-br from-brand-primary/30 to-brand-secondary/30 overflow-hidden group">
                <img src={img} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{locale === 'ar' ? 'عن الفندق' : 'About This Hotel'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{locale === 'ar' ? 'المرافق والخدمات' : 'Amenities & Services'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotel.amenities.map((amenity, i) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-lg">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Icon className="w-5 h-5 text-brand-primary" />
                        </div>
                        <span className="font-medium text-gray-700">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-brand-primary to-brand-primary-light bg-clip-text text-transparent">
                {locale === 'ar' ? 'اختر غرفتك' : 'Choose Your Room'}
              </h2>
              <div className="space-y-6">
                {rooms.map((room) => (
                  <Card key={room.id} className="group rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-3 group-hover:text-brand-primary transition">{room.name}</h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">{room.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {room.amenities.map((amenity, i) => (
                              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary text-sm font-medium rounded-full">
                                <CheckCircle className="w-3.5 h-3.5" />
                                {amenity}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 px-3 py-2 rounded-lg inline-flex">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-700 font-medium">{locale === 'ar' ? 'سياسة الإلغاء:' : 'Cancellation:'} {room.policies.cancellation}</span>
                          </div>
                        </div>
                        
                        <div className="lg:text-right space-y-4">
                          <div className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 p-6 rounded-xl">
                            <p className="text-sm text-gray-600 mb-1">{locale === 'ar' ? 'السعر لليلة' : 'Price per night'}</p>
                            <div className="flex items-baseline gap-2 lg:justify-end">
                              <span className="text-4xl font-bold bg-gradient-to-r from-brand-primary to-brand-primary-light bg-clip-text text-transparent">
                                {room.price}
                              </span>
                              <span className="text-gray-600 font-semibold">{locale === 'ar' ? 'ر.س' : 'SAR'}</span>
                            </div>
                          </div>
                          
                          <Button asChild className="w-full bg-gradient-to-r from-brand-primary to-brand-primary-light hover:from-purple-700 hover:to-pink-700 rounded-lg shadow-lg hover:shadow-xl transition-all" size="lg">
                            <a href={`/${locale}/checkout?hotelId=${hotel.id}&roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}`}>
                              <Calendar className="w-4 h-4 mr-2" />
                              {locale === 'ar' ? 'احجز الآن' : 'Book Now'}
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Card className="sticky top-24 rounded-xl shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-primary" />
                  {locale === 'ar' ? 'الموقع' : 'Location'}
                </h3>
                <div className="aspect-square bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-xl mb-4 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-brand-primary/40" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{hotel.location.address}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
