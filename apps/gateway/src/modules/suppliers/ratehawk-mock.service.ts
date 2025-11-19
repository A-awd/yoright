import { Injectable } from '@nestjs/common';

@Injectable()
export class RatehawkMockService {
  private mockHotels = [
    {
      id: 'hotel-riyadh-1',
      name: 'فندق الفيصلية الرياض',
      nameEn: 'Al Faisaliah Hotel Riyadh',
      cityId: 'riyadh',
      stars: 5,
      rating: 4.7,
      reviewCount: 1243,
      pricePerNight: 1200,
      currency: 'SAR',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      address: 'طريق الملك فهد، الرياض',
      amenities: ['مسبح', 'سبا', 'مطعم', 'واي فاي مجاني', 'موقف سيارات'],
      lat: 24.6900,
      lng: 46.6851,
    },
    {
      id: 'hotel-riyadh-2',
      name: 'فندق برج رافال الرياض',
      nameEn: 'Rafal Tower Hotel Riyadh',
      cityId: 'riyadh',
      stars: 4,
      rating: 4.5,
      reviewCount: 856,
      pricePerNight: 850,
      currency: 'SAR',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      address: 'حي السفارات، الرياض',
      amenities: ['مسبح', 'صالة رياضية', 'واي فاي مجاني'],
      lat: 24.7136,
      lng: 46.6753,
    },
    {
      id: 'hotel-jeddah-1',
      name: 'فندق كراون بلازا جدة',
      nameEn: 'Crowne Plaza Jeddah',
      cityId: 'jeddah',
      stars: 5,
      rating: 4.6,
      reviewCount: 1567,
      pricePerNight: 1100,
      currency: 'SAR',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      address: 'طريق الملك عبدالعزيز، جدة',
      amenities: ['إطلالة على البحر', 'مسبح', 'مطعم', 'واي فاي مجاني'],
      lat: 21.5169,
      lng: 39.1748,
    },
    {
      id: 'hotel-dubai-1',
      name: 'برج العرب جميرا',
      nameEn: 'Burj Al Arab Jumeirah',
      cityId: 'dubai',
      stars: 5,
      rating: 4.9,
      reviewCount: 3421,
      pricePerNight: 5000,
      currency: 'SAR',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
      address: 'Jumeirah Street, Dubai',
      amenities: ['شاطئ خاص', 'مطاعم فاخرة', 'سبا عالمي', 'مسبح لا متناهي'],
      lat: 25.1412,
      lng: 55.1853,
    },
  ];

  async searchHotels(params: any) {
    let results = this.mockHotels.filter(h => !params.cityId || h.cityId === params.cityId);
    
    return results.map(hotel => ({
      id: hotel.id,
      nameAr: hotel.name,
      nameEn: hotel.nameEn,
      cityId: hotel.cityId,
      stars: hotel.stars,
      rating: hotel.rating,
      reviewCount: hotel.reviewCount,
      location: {
        lat: hotel.lat,
        lng: hotel.lng,
        addressAr: hotel.address,
        addressEn: hotel.address.includes('،') ? hotel.nameEn + ' Area' : hotel.address,
        distanceToCenterKm: 5.2,
      },
      thumbnail: hotel.image,
      images: [hotel.image, hotel.image, hotel.image],
      amenitiesAr: hotel.amenities,
      amenitiesEn: hotel.amenities.map(a => {
        const translations: Record<string, string> = {
          'مسبح': 'Swimming Pool',
          'سبا': 'Spa',
          'مطعم': 'Restaurant',
          'واي فاي مجاني': 'Free WiFi',
          'موقف سيارات': 'Parking',
          'صالة رياضية': 'Gym',
          'إطلالة على البحر': 'Sea View',
          'شاطئ خاص': 'Private Beach',
          'مطاعم فاخرة': 'Fine Dining',
          'سبا عالمي': 'World-class Spa',
          'مسبح لا متناهي': 'Infinity Pool',
        };
        return translations[a] || a;
      }),
      pricePerNight: hotel.pricePerNight,
      totalPrice: hotel.pricePerNight * 3,
      currency: hotel.currency,
      freeCancellation: true,
      breakfastIncluded: hotel.stars >= 4,
    }));
  }

  async getHotelDetails(id: string) {
    const hotel = this.mockHotels.find(h => h.id === id);
    if (!hotel) {
      throw new Error('Hotel not found');
    }

    return {
      id: hotel.id,
      nameAr: hotel.name,
      nameEn: hotel.nameEn,
      cityId: hotel.cityId,
      stars: hotel.stars,
      rating: hotel.rating,
      reviewCount: hotel.reviewCount,
      location: {
        lat: hotel.lat,
        lng: hotel.lng,
        addressAr: hotel.address,
        addressEn: hotel.address.includes('،') ? hotel.nameEn + ' Area' : hotel.address,
        distanceToCenterKm: 5.2,
      },
      thumbnail: hotel.image,
      images: [hotel.image, hotel.image, hotel.image],
      amenitiesAr: hotel.amenities,
      amenitiesEn: hotel.amenities.map(a => {
        const translations: Record<string, string> = {
          'مسبح': 'Swimming Pool',
          'سبا': 'Spa',
          'مطعم': 'Restaurant',
          'واي فاي مجاني': 'Free WiFi',
          'موقف سيارات': 'Parking',
          'صالة رياضية': 'Gym',
          'إطلالة على البحر': 'Sea View',
          'شاطئ خاص': 'Private Beach',
          'مطاعم فاخرة': 'Fine Dining',
          'سبا عالمي': 'World-class Spa',
          'مسبح لا متناهي': 'Infinity Pool',
        };
        return translations[a] || a;
      }),
      descriptionAr: 'فندق فاخر في قلب المدينة مع خدمات من الدرجة الأولى',
      descriptionEn: 'Luxury hotel in the heart of the city with world-class services',
      pricePerNight: hotel.pricePerNight,
      currency: hotel.currency,
      freeCancellation: true,
      breakfastIncluded: hotel.stars >= 4,
      rooms: [
        {
          id: `${id}-room-1`,
          nameAr: 'غرفة ديلوكس',
          nameEn: 'Deluxe Room',
          priceSar: hotel.pricePerNight,
          refundable: true,
          breakfast: true,
          capacity: 2,
          size: 35,
        },
        {
          id: `${id}-room-2`,
          nameAr: 'جناح تنفيذي',
          nameEn: 'Executive Suite',
          priceSar: hotel.pricePerNight * 1.5,
          refundable: true,
          breakfast: true,
          capacity: 4,
          size: 60,
        },
        {
          id: `${id}-room-3`,
          nameAr: 'غرفة قياسية',
          nameEn: 'Standard Room',
          priceSar: hotel.pricePerNight * 0.7,
          refundable: false,
          breakfast: false,
          capacity: 2,
          size: 25,
        },
      ],
    };
  }
}
