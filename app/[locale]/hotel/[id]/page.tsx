import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { rateHawkAdapter } from '@/lib/adapters/ratehawk';

export default async function HotelDetailsPage({ 
  params 
}: { 
  params: { locale: string; id: string };
}) {
  const locale = params.locale;
  const checkIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const checkOut = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { hotel, rooms } = await rateHawkAdapter.getHotelDetails(params.id, checkIn, checkOut);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
        <div className="flex items-center gap-4">
          <span className="text-yellow-500 text-lg">★ {hotel.rating || 4.5}</span>
          <span className="text-gray-600">{hotel.location.address}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {hotel.images.slice(0, 4).map((img, i) => (
                <div key={i} className="h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg overflow-hidden">
                  <img src={img} alt={hotel.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{locale === 'ar' ? 'عن الفندق' : 'About'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{hotel.description}</p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{locale === 'ar' ? 'المرافق' : 'Amenities'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {hotel.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-purple-600">✓</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              {locale === 'ar' ? 'اختر غرفتك' : 'Choose Your Room'}
            </h2>
            <div className="space-y-4">
              {rooms.map((room) => (
                <Card key={room.id}>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                        <p className="text-gray-600 mb-4">{room.description}</p>
                        <div className="flex gap-2 flex-wrap mb-4">
                          {room.amenities.map((amenity, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                              {amenity}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{locale === 'ar' ? 'سياسة الإلغاء:' : 'Cancellation:'} {room.policies.cancellation}</p>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-2xl font-bold text-purple-600 mb-2">
                          {room.price} {locale === 'ar' ? 'ر.س' : 'SAR'}
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          {locale === 'ar' ? 'لليلة' : 'per night'}
                        </div>
                        <Button asChild>
                          <a href={`/${locale}/checkout?hotelId=${hotel.id}&roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}`}>
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
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">{locale === 'ar' ? 'الموقع' : 'Location'}</h3>
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <p className="text-sm text-gray-600">{hotel.location.address}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
