import React from 'react';
import { Language } from '../types';

interface OffersProps {
  lang: Language;
}

interface Offer {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  promoCode: string;
  categories: Array<{ labelAr: string; labelEn: string; color: string }>;
  image: string;
  partnerLogo?: string;
  partnerName?: string;
}

const mockOffers: Offer[] = [
  {
    id: '1',
    titleAr: 'حافز الأسرة',
    titleEn: 'Family Reward',
    descriptionAr: 'استمتع بخصم حتى 15% على رحلتك في عطلة المدارس',
    descriptionEn: 'Enjoy up to 15% discount on school holiday trips',
    promoCode: 'STAWSB',
    categories: [
      { labelAr: 'طيران', labelEn: 'Flights', color: 'bg-teal-500' },
      { labelAr: 'فنادق', labelEn: 'Hotels', color: 'bg-green-500' }
    ],
    image: 'https://picsum.photos/seed/family/800/400',
    partnerName: 'الخطوط السعودية'
  },
  {
    id: '2',
    titleAr: 'خيارات دفع متنوعة وسهلة',
    titleEn: 'Various and Easy Payment Options',
    descriptionAr: 'لا تفشل هم تكاليف السفر! احجز الحين وادفع أقساط مع تابي مع ٪0 فوائد',
    descriptionEn: 'Book now and pay in installments with Tabby with 0% interest',
    promoCode: 'TABBY0',
    categories: [
      { labelAr: 'طيران', labelEn: 'Flights', color: 'bg-teal-500' },
      { labelAr: 'فنادق', labelEn: 'Hotels', color: 'bg-green-500' }
    ],
    image: 'https://picsum.photos/seed/tabby/800/400',
    partnerName: 'Tabby'
  },
  {
    id: '3',
    titleAr: '٪10 نقاط المسافر',
    titleEn: '10% Traveler Points',
    descriptionAr: 'على رحلات الطيران ولإقامة فندقية',
    descriptionEn: 'On flights and hotel stays',
    promoCode: 'POINTS10',
    categories: [
      { labelAr: 'طيران', labelEn: 'Flights', color: 'bg-teal-500' },
      { labelAr: 'فنادق', labelEn: 'Hotels', color: 'bg-green-500' }
    ],
    image: 'https://picsum.photos/seed/makkah/800/400',
    partnerName: 'شركة المسافر'
  },
  {
    id: '4',
    titleAr: 'رحلتك بنتظرك والعرض الحصري معنا',
    titleEn: 'Your Trip Awaits with Exclusive Offer',
    descriptionAr: 'احجز رحلتك الآن واحصل على خصومات مميزة',
    descriptionEn: 'Book your trip now and get special discounts',
    promoCode: 'SAUDIA',
    categories: [
      { labelAr: 'طيران', labelEn: 'Flights', color: 'bg-teal-500' }
    ],
    image: 'https://picsum.photos/seed/plane/800/400',
    partnerName: 'السعودية'
  },
  {
    id: '5',
    titleAr: 'مسعد لعطلة استثنائية؟',
    titleEn: 'Ready for an Exceptional Vacation?',
    descriptionAr: 'احجز فندقك المفضل واحصل على خصم يصل إلى 25%',
    descriptionEn: 'Book your favorite hotel and get up to 25% discount',
    promoCode: 'WINTER',
    categories: [
      { labelAr: 'فنادق', labelEn: 'Hotels', color: 'bg-green-500' }
    ],
    image: 'https://picsum.photos/seed/resort/800/400',
    partnerName: 'ونتر'
  }
];

const Offers: React.FC<OffersProps> = ({ lang }) => {
  const isArabic = lang === Language.AR;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center text-primary-600">
            {isArabic ? 'العروض' : 'Offers'}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {mockOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={offer.image}
                alt={isArabic ? offer.titleAr : offer.titleEn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              <div className={`absolute top-4 ${isArabic ? 'right-4' : 'left-4'} flex gap-2`}>
                {offer.categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className={`${cat.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                  >
                    {isArabic ? cat.labelAr : cat.labelEn}
                  </span>
                ))}
              </div>

              {offer.partnerName && (
                <div className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'}`}>
                  <div className="bg-white/95 px-3 py-1 rounded-lg">
                    <span className="text-sm font-bold text-primary-600">
                      {offer.partnerName}
                    </span>
                  </div>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h2 className="text-xl font-bold mb-1">
                  {isArabic ? offer.titleAr : offer.titleEn}
                </h2>
              </div>
            </div>

            <div className="p-4">
              <p className="text-gray-700 mb-4 leading-relaxed">
                {isArabic ? offer.descriptionAr : offer.descriptionEn}
              </p>
              
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border-2 border-dashed border-primary-300">
                <span className="text-sm text-gray-600">
                  {isArabic ? 'استخدم الكود:' : 'Use Code:'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary-600 tracking-wider">
                    {offer.promoCode}
                  </span>
                  <button className="text-primary-600 hover:text-primary-700">
                    <i className="far fa-copy"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
