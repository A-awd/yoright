import { City, Hotel, Amenity } from '../types';

export const AMENITIES: Record<string, Amenity> = {
  wifi: { icon: 'fa-wifi', labelAr: 'واي فاي مجاني', labelEn: 'Free Wi-Fi' },
  pool: { icon: 'fa-water', labelAr: 'مسبح', labelEn: 'Swimming Pool' },
  gym: { icon: 'fa-dumbbell', labelAr: 'صالة رياضية', labelEn: 'Fitness Center' },
  parking: { icon: 'fa-parking', labelAr: 'موقف سيارات', labelEn: 'Parking' },
  restaurant: { icon: 'fa-utensils', labelAr: 'مطعم', labelEn: 'Restaurant' },
  spa: { icon: 'fa-spa', labelAr: 'سبا وعافية', labelEn: 'Spa & Wellness' },
};

export const CITIES: City[] = [
  {
    id: 'c1',
    nameAr: 'دبي',
    nameEn: 'Dubai',
    slug: 'dubai',
    lat: 25.2048,
    lng: 55.2708,
    image: 'https://picsum.photos/id/1040/800/600',
  },
  {
    id: 'c2',
    nameAr: 'الرياض',
    nameEn: 'Riyadh',
    slug: 'riyadh',
    lat: 24.7136,
    lng: 46.6753,
    image: 'https://picsum.photos/id/1039/800/600',
  },
  {
    id: 'c3',
    nameAr: 'لندن',
    nameEn: 'London',
    slug: 'london',
    lat: 51.5074,
    lng: -0.1278,
    image: 'https://picsum.photos/id/106/800/600',
  },
  {
    id: 'c4',
    nameAr: 'جدة',
    nameEn: 'Jeddah',
    slug: 'jeddah',
    lat: 21.4858,
    lng: 39.1925,
    image: 'https://picsum.photos/id/164/800/600',
  },
];

export const MOCK_HOTELS: Hotel[] = [
  {
    id: 'h1',
    nameAr: 'فندق برج العرب',
    nameEn: 'Burj Al Arab Hotel',
    cityId: 'c1',
    stars: 5,
    rating: 9.8,
    reviewCount: 3420,
    location: {
      lat: 25.1412,
      lng: 55.1852,
      addressAr: 'شارع جميرا، دبي',
      addressEn: 'Jumeirah St, Dubai',
      distanceToCenterKm: 15,
    },
    thumbnail: 'https://picsum.photos/id/10/400/300',
    images: ['https://picsum.photos/id/10/800/600', 'https://picsum.photos/id/11/800/600'],
    amenities: ['wifi', 'pool', 'spa', 'restaurant', 'gym'],
    minPrice: 4500,
    descriptionAr: 'أفخم فندق في العالم يقع على جزيرة خاصة.',
    descriptionEn: 'The most luxurious hotel in the world located on a private island.',
    rooms: [
      { id: 'r1', nameAr: 'جناح ديلوكس', nameEn: 'Deluxe Suite', price: 4500, capacity: 2, bedType: 'King', breakfastIncluded: true, freeCancellation: false },
      { id: 'r2', nameAr: 'جناح ملكي', nameEn: 'Royal Suite', price: 12000, capacity: 4, bedType: '2 King', breakfastIncluded: true, freeCancellation: true },
    ]
  },
  {
    id: 'h2',
    nameAr: 'فندق نارسيس',
    nameEn: 'Narcissus Hotel',
    cityId: 'c2',
    stars: 5,
    rating: 9.2,
    reviewCount: 1200,
    location: {
      lat: 24.697,
      lng: 46.683,
      addressAr: 'شارع العليا، الرياض',
      addressEn: 'Olaya St, Riyadh',
      distanceToCenterKm: 2,
    },
    thumbnail: 'https://picsum.photos/id/14/400/300',
    images: ['https://picsum.photos/id/14/800/600', 'https://picsum.photos/id/15/800/600'],
    amenities: ['wifi', 'spa', 'restaurant', 'gym'],
    minPrice: 1200,
    descriptionAr: 'فندق فاخر في قلب الرياض يتميز بالرقي.',
    descriptionEn: 'Luxury hotel in the heart of Riyadh distinguished by sophistication.',
    rooms: [
      { id: 'r3', nameAr: 'غرفة كلاسيك', nameEn: 'Classic Room', price: 1200, capacity: 2, bedType: 'Queen', breakfastIncluded: false, freeCancellation: true },
    ]
  },
  {
    id: 'h3',
    nameAr: 'ذا ريتز كارلتون',
    nameEn: 'The Ritz-Carlton',
    cityId: 'c2',
    stars: 5,
    rating: 9.5,
    reviewCount: 2100,
    location: {
      lat: 24.665,
      lng: 46.630,
      addressAr: 'طريق مكة، الرياض',
      addressEn: 'Makkah Road, Riyadh',
      distanceToCenterKm: 8,
    },
    thumbnail: 'https://picsum.photos/id/16/400/300',
    images: ['https://picsum.photos/id/16/800/600', 'https://picsum.photos/id/17/800/600'],
    amenities: ['wifi', 'pool', 'spa', 'gym', 'parking'],
    minPrice: 1800,
    descriptionAr: 'واحة من الفخامة والهدوء في العاصمة.',
    descriptionEn: 'An oasis of luxury and tranquility in the capital.',
    rooms: [
      { id: 'r4', nameAr: 'غرفة ديلوكس', nameEn: 'Deluxe Room', price: 1800, capacity: 2, bedType: 'King', breakfastIncluded: true, freeCancellation: true },
    ]
  },
];
