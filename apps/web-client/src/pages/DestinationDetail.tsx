import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { Button, Card } from '../components/ui';
import HotelCard from '../components/HotelCard';

interface DestinationDetailProps {
  lang: Language;
}

interface DestinationData {
  id: string;
  nameAr: string;
  nameEn: string;
  countryAr: string;
  countryEn: string;
  image: string;
  descriptionAr: string;
  descriptionEn: string;
  areas: Array<{
    id: string;
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
    image: string;
  }>;
  hotels: Array<{
    id: string;
    nameAr: string;
    nameEn: string;
    cityAr: string;
    cityEn: string;
    countryAr: string;
    countryEn: string;
    taglineAr: string;
    taglineEn: string;
    image: string;
    stars: number;
    rating: number;
    reviewCount: number;
    pricePerNight: number;
    badge?: 'featured' | 'new';
  }>;
  tips: Array<{
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    icon: string;
  }>;
}

const destinationsData: Record<string, DestinationData> = {
  dubai: {
    id: 'dubai',
    nameAr: 'دبي',
    nameEn: 'Dubai',
    countryAr: 'الإمارات العربية المتحدة',
    countryEn: 'United Arab Emirates',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop',
    descriptionAr: 'دبي هي مدينة عالمية تجمع بين الحداثة والتراث العربي الأصيل. تشتهر بناطحات السحاب الشاهقة والمراكز التجارية الفاخرة والشواطئ الذهبية. استمتع بتجربة تسوق لا مثيل لها وأطباق عالمية ومغامرات صحراوية مثيرة.',
    descriptionEn: 'Dubai is a global city that blends modernity with authentic Arabian heritage. Famous for its towering skyscrapers, luxury shopping centers, and golden beaches. Enjoy unparalleled shopping experiences, world cuisine, and exciting desert adventures.',
    areas: [
      {
        id: 'downtown',
        nameAr: 'وسط المدينة',
        nameEn: 'Downtown Dubai',
        descriptionAr: 'موطن برج خليفة ودبي مول',
        descriptionEn: 'Home to Burj Khalifa and Dubai Mall',
        image: 'https://images.unsplash.com/photo-1546412414-e1885259563a?w=400&h=300&fit=crop'
      },
      {
        id: 'marina',
        nameAr: 'دبي مارينا',
        nameEn: 'Dubai Marina',
        descriptionAr: 'واجهة بحرية راقية ومطاعم فاخرة',
        descriptionEn: 'Upscale waterfront with fine dining',
        image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=300&fit=crop'
      },
      {
        id: 'palm',
        nameAr: 'نخلة جميرا',
        nameEn: 'Palm Jumeirah',
        descriptionAr: 'جزيرة اصطناعية فريدة ومنتجعات فاخرة',
        descriptionEn: 'Iconic man-made island with luxury resorts',
        image: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=400&h=300&fit=crop'
      },
      {
        id: 'creek',
        nameAr: 'خور دبي',
        nameEn: 'Dubai Creek',
        descriptionAr: 'المنطقة التاريخية والأسواق التقليدية',
        descriptionEn: 'Historic area with traditional souks',
        image: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=400&h=300&fit=crop'
      }
    ],
    hotels: [
      {
        id: '1',
        nameAr: 'فندق أتلانتس النخلة',
        nameEn: 'Atlantis The Palm',
        cityAr: 'دبي',
        cityEn: 'Dubai',
        countryAr: 'الإمارات',
        countryEn: 'UAE',
        taglineAr: 'شاطئ خاص · منتجع عائلي',
        taglineEn: 'Private Beach · Family Resort',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.8,
        reviewCount: 2847,
        pricePerNight: 1850,
        badge: 'featured'
      },
      {
        id: '2',
        nameAr: 'فندق برج العرب',
        nameEn: 'Burj Al Arab',
        cityAr: 'دبي',
        cityEn: 'Dubai',
        countryAr: 'الإمارات',
        countryEn: 'UAE',
        taglineAr: 'أيقونة · 7 نجوم',
        taglineEn: 'Iconic · 7-Star Luxury',
        image: 'https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.85,
        reviewCount: 3156,
        pricePerNight: 5500,
        badge: 'featured'
      },
      {
        id: '3',
        nameAr: 'أرماني دبي',
        nameEn: 'Armani Hotel Dubai',
        cityAr: 'دبي',
        cityEn: 'Dubai',
        countryAr: 'الإمارات',
        countryEn: 'UAE',
        taglineAr: 'في برج خليفة · تصميم إيطالي',
        taglineEn: 'In Burj Khalifa · Italian Design',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.7,
        reviewCount: 1890,
        pricePerNight: 2200,
        badge: 'new'
      },
      {
        id: '4',
        nameAr: 'فندق جميرا بيتش',
        nameEn: 'Jumeirah Beach Hotel',
        cityAr: 'دبي',
        cityEn: 'Dubai',
        countryAr: 'الإمارات',
        countryEn: 'UAE',
        taglineAr: 'منتجع شاطئي · مناسب للعائلات',
        taglineEn: 'Beach Resort · Family Friendly',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.6,
        reviewCount: 2234,
        pricePerNight: 1450
      },
      {
        id: '5',
        nameAr: 'فندق أدرس داون تاون',
        nameEn: 'Address Downtown',
        cityAr: 'دبي',
        cityEn: 'Dubai',
        countryAr: 'الإمارات',
        countryEn: 'UAE',
        taglineAr: 'إطلالة على البحيرة · قريب من دبي مول',
        taglineEn: 'Lake Views · Near Dubai Mall',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.75,
        reviewCount: 1678,
        pricePerNight: 1650
      },
      {
        id: '6',
        nameAr: 'فندق فور سيزونز',
        nameEn: 'Four Seasons Dubai',
        cityAr: 'دبي',
        cityEn: 'Dubai',
        countryAr: 'الإمارات',
        countryEn: 'UAE',
        taglineAr: 'شاطئ جميرا · سبا فاخر',
        taglineEn: 'Jumeirah Beach · Luxury Spa',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.9,
        reviewCount: 2456,
        pricePerNight: 2800
      }
    ],
    tips: [
      {
        titleAr: 'أفضل وقت للزيارة',
        titleEn: 'Best Time to Visit',
        descriptionAr: 'من نوفمبر إلى مارس عندما يكون الطقس معتدلاً ومناسباً للأنشطة الخارجية',
        descriptionEn: 'November to March when weather is mild and perfect for outdoor activities',
        icon: 'calendar'
      },
      {
        titleAr: 'قواعد اللباس',
        titleEn: 'Dress Code',
        descriptionAr: 'احترم الثقافة المحلية بارتداء ملابس محتشمة في الأماكن العامة والمراكز التجارية',
        descriptionEn: 'Respect local culture by wearing modest clothing in public areas and malls',
        icon: 'shirt'
      },
      {
        titleAr: 'التنقل',
        titleEn: 'Getting Around',
        descriptionAr: 'استخدم مترو دبي أو سيارات الأجرة. تطبيقات مثل Careem وUber متاحة أيضاً',
        descriptionEn: 'Use Dubai Metro or taxis. Apps like Careem and Uber are also available',
        icon: 'car'
      },
      {
        titleAr: 'العملة والدفع',
        titleEn: 'Currency & Payment',
        descriptionAr: 'الدرهم الإماراتي (AED). البطاقات مقبولة على نطاق واسع',
        descriptionEn: 'UAE Dirham (AED). Cards are widely accepted',
        icon: 'credit-card'
      }
    ]
  },
  riyadh: {
    id: 'riyadh',
    nameAr: 'الرياض',
    nameEn: 'Riyadh',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=1920&h=1080&fit=crop',
    descriptionAr: 'الرياض هي عاصمة المملكة العربية السعودية وأكبر مدنها. تجمع بين التراث العريق والتطور الحديث، وتضم معالم تاريخية ومراكز تسوق عالمية ومطاعم راقية.',
    descriptionEn: 'Riyadh is the capital and largest city of Saudi Arabia. It combines rich heritage with modern development, featuring historical landmarks, world-class shopping centers, and fine dining restaurants.',
    areas: [
      {
        id: 'olaya',
        nameAr: 'العليا',
        nameEn: 'Olaya District',
        descriptionAr: 'المنطقة التجارية الرئيسية والفنادق الفاخرة',
        descriptionEn: 'Main business district with luxury hotels',
        image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=400&h=300&fit=crop'
      },
      {
        id: 'diriyah',
        nameAr: 'الدرعية',
        nameEn: 'Diriyah',
        descriptionAr: 'موقع التراث العالمي والمنطقة التاريخية',
        descriptionEn: 'UNESCO World Heritage Site and historic area',
        image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=300&fit=crop'
      },
      {
        id: 'king-abdullah',
        nameAr: 'مركز الملك عبدالله المالي',
        nameEn: 'KAFD',
        descriptionAr: 'المركز المالي الحديث والأبراج الشاهقة',
        descriptionEn: 'Modern financial center with skyscrapers',
        image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&h=300&fit=crop'
      }
    ],
    hotels: [
      {
        id: '7',
        nameAr: 'فندق الريتز كارلتون',
        nameEn: 'The Ritz-Carlton Riyadh',
        cityAr: 'الرياض',
        cityEn: 'Riyadh',
        countryAr: 'السعودية',
        countryEn: 'Saudi Arabia',
        taglineAr: 'فخامة ملكية · سبا فاخر',
        taglineEn: 'Royal Luxury · Premium Spa',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.9,
        reviewCount: 1523,
        pricePerNight: 2200,
        badge: 'featured'
      },
      {
        id: '8',
        nameAr: 'فندق فور سيزونز',
        nameEn: 'Four Seasons Riyadh',
        cityAr: 'الرياض',
        cityEn: 'Riyadh',
        countryAr: 'السعودية',
        countryEn: 'Saudi Arabia',
        taglineAr: 'برج المملكة · إطلالات بانورامية',
        taglineEn: 'Kingdom Tower · Panoramic Views',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.85,
        reviewCount: 1890,
        pricePerNight: 1950,
        badge: 'new'
      },
      {
        id: '9',
        nameAr: 'فندق روزوود',
        nameEn: 'Rosewood Riyadh',
        cityAr: 'الرياض',
        cityEn: 'Riyadh',
        countryAr: 'السعودية',
        countryEn: 'Saudi Arabia',
        taglineAr: 'في مركز الملك عبدالله المالي',
        taglineEn: 'Located in KAFD',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.8,
        reviewCount: 945,
        pricePerNight: 2100
      },
      {
        id: '10',
        nameAr: 'فندق مندرين أورينتال',
        nameEn: 'Mandarin Oriental',
        cityAr: 'الرياض',
        cityEn: 'Riyadh',
        countryAr: 'السعودية',
        countryEn: 'Saudi Arabia',
        taglineAr: 'فخامة آسيوية · خدمة متميزة',
        taglineEn: 'Asian Luxury · Exceptional Service',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.75,
        reviewCount: 756,
        pricePerNight: 1850
      }
    ],
    tips: [
      {
        titleAr: 'أفضل وقت للزيارة',
        titleEn: 'Best Time to Visit',
        descriptionAr: 'من أكتوبر إلى مارس عندما يكون الطقس معتدلاً',
        descriptionEn: 'October to March when weather is pleasant',
        icon: 'calendar'
      },
      {
        titleAr: 'أوقات الصلاة',
        titleEn: 'Prayer Times',
        descriptionAr: 'تغلق المحلات خلال أوقات الصلاة لمدة 30 دقيقة تقريباً',
        descriptionEn: 'Shops close during prayer times for about 30 minutes',
        icon: 'clock'
      },
      {
        titleAr: 'التنقل',
        titleEn: 'Getting Around',
        descriptionAr: 'سيارات الأجرة وتطبيقات النقل مثل Uber وCareem هي الأفضل',
        descriptionEn: 'Taxis and ride-hailing apps like Uber and Careem are best',
        icon: 'car'
      }
    ]
  },
  makkah: {
    id: 'makkah',
    nameAr: 'مكة المكرمة',
    nameEn: 'Makkah',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&h=1080&fit=crop',
    descriptionAr: 'مكة المكرمة هي أقدس مدينة في الإسلام، موطن المسجد الحرام والكعبة المشرفة. يقصدها ملايين المسلمين سنوياً لأداء فريضة الحج والعمرة.',
    descriptionEn: 'Makkah is the holiest city in Islam, home to the Grand Mosque and the Kaaba. Millions of Muslims visit annually to perform Hajj and Umrah pilgrimages.',
    areas: [
      {
        id: 'haram',
        nameAr: 'منطقة الحرم',
        nameEn: 'Haram Area',
        descriptionAr: 'المسجد الحرام والفنادق المطلة عليه',
        descriptionEn: 'Grand Mosque and overlooking hotels',
        image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&h=300&fit=crop'
      },
      {
        id: 'aziziyah',
        nameAr: 'العزيزية',
        nameEn: 'Aziziyah',
        descriptionAr: 'منطقة سكنية قريبة من الحرم',
        descriptionEn: 'Residential area near the Haram',
        image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400&h=300&fit=crop'
      },
      {
        id: 'jabal-omar',
        nameAr: 'جبل عمر',
        nameEn: 'Jabal Omar',
        descriptionAr: 'مشروع تطويري حديث بفنادق فاخرة',
        descriptionEn: 'Modern development with luxury hotels',
        image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop'
      }
    ],
    hotels: [
      {
        id: '11',
        nameAr: 'فيرمونت برج الساعة',
        nameEn: 'Fairmont Clock Tower',
        cityAr: 'مكة المكرمة',
        cityEn: 'Makkah',
        countryAr: 'السعودية',
        countryEn: 'Saudi Arabia',
        taglineAr: 'إطلالة مباشرة على الحرم',
        taglineEn: 'Direct Haram View',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.9,
        reviewCount: 5678,
        pricePerNight: 3500,
        badge: 'featured'
      },
      {
        id: '12',
        nameAr: 'فندق رافلز',
        nameEn: 'Raffles Makkah Palace',
        cityAr: 'مكة المكرمة',
        cityEn: 'Makkah',
        countryAr: 'السعودية',
        countryEn: 'Saudi Arabia',
        taglineAr: 'فخامة استثنائية · خدمة الخادم الشخصي',
        taglineEn: 'Exceptional Luxury · Butler Service',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.95,
        reviewCount: 2345,
        pricePerNight: 4200,
        badge: 'featured'
      },
      {
        id: '13',
        nameAr: 'فندق كونراد',
        nameEn: 'Conrad Makkah',
        cityAr: 'مكة المكرمة',
        cityEn: 'Makkah',
        countryAr: 'السعودية',
        countryEn: 'Saudi Arabia',
        taglineAr: 'قريب من الحرم · غرف فسيحة',
        taglineEn: 'Near Haram · Spacious Rooms',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.7,
        reviewCount: 1890,
        pricePerNight: 1800
      },
      {
        id: '14',
        nameAr: 'سويس أوتيل المقام',
        nameEn: 'Swissotel Al Maqam',
        cityAr: 'مكة المكرمة',
        cityEn: 'Makkah',
        countryAr: 'السعودية',
        countryEn: 'Saudi Arabia',
        taglineAr: 'في أبراج البيت · إطلالة على الكعبة',
        taglineEn: 'In Abraj Al-Bait · Kaaba View',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.8,
        reviewCount: 3456,
        pricePerNight: 2900,
        badge: 'new'
      }
    ],
    tips: [
      {
        titleAr: 'التأشيرة',
        titleEn: 'Visa Requirements',
        descriptionAr: 'يحتاج غير السعوديين إلى تأشيرة عمرة أو حج للدخول',
        descriptionEn: 'Non-Saudis need Umrah or Hajj visa to enter',
        icon: 'document'
      },
      {
        titleAr: 'موسم الحج',
        titleEn: 'Hajj Season',
        descriptionAr: 'تجنب السفر خلال موسم الحج إلا إذا كنت حاجاً',
        descriptionEn: 'Avoid traveling during Hajj season unless performing Hajj',
        icon: 'calendar'
      },
      {
        titleAr: 'الملابس',
        titleEn: 'Clothing',
        descriptionAr: 'ارتدِ ملابس محتشمة واحترم قدسية المكان',
        descriptionEn: 'Wear modest clothing and respect the sanctity of the place',
        icon: 'shirt'
      },
      {
        titleAr: 'الطقس',
        titleEn: 'Weather',
        descriptionAr: 'الصيف حار جداً. أفضل وقت من نوفمبر إلى فبراير',
        descriptionEn: 'Summer is very hot. Best time is November to February',
        icon: 'sun'
      }
    ]
  },
  istanbul: {
    id: 'istanbul',
    nameAr: 'إسطنبول',
    nameEn: 'Istanbul',
    countryAr: 'تركيا',
    countryEn: 'Turkey',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1920&h=1080&fit=crop',
    descriptionAr: 'إسطنبول مدينة تجمع بين قارتين، آسيا وأوروبا. تمتاز بتاريخها العريق وآثارها العثمانية والبيزنطية، ومأكولاتها الشهية وأسواقها النابضة بالحياة.',
    descriptionEn: 'Istanbul is a city spanning two continents, Asia and Europe. Known for its rich history, Ottoman and Byzantine heritage, delicious cuisine, and vibrant markets.',
    areas: [
      {
        id: 'sultanahmet',
        nameAr: 'السلطان أحمد',
        nameEn: 'Sultanahmet',
        descriptionAr: 'المنطقة التاريخية وآيا صوفيا والجامع الأزرق',
        descriptionEn: 'Historic area with Hagia Sophia and Blue Mosque',
        image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&h=300&fit=crop'
      },
      {
        id: 'taksim',
        nameAr: 'تقسيم',
        nameEn: 'Taksim',
        descriptionAr: 'قلب إسطنبول الحديثة والحياة الليلية',
        descriptionEn: 'Heart of modern Istanbul and nightlife',
        image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop'
      },
      {
        id: 'besiktas',
        nameAr: 'بشكتاش',
        nameEn: 'Beşiktaş',
        descriptionAr: 'إطلالات على البوسفور وقصر دولما بهجة',
        descriptionEn: 'Bosphorus views and Dolmabahçe Palace',
        image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400&h=300&fit=crop'
      }
    ],
    hotels: [
      {
        id: '15',
        nameAr: 'فندق فور سيزونز السلطان أحمد',
        nameEn: 'Four Seasons Sultanahmet',
        cityAr: 'إسطنبول',
        cityEn: 'Istanbul',
        countryAr: 'تركيا',
        countryEn: 'Turkey',
        taglineAr: 'في سجن عثماني تاريخي',
        taglineEn: 'In a Historic Ottoman Prison',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.9,
        reviewCount: 1890,
        pricePerNight: 1650,
        badge: 'featured'
      },
      {
        id: '16',
        nameAr: 'فندق تشيراغان بالاس كمبنسكي',
        nameEn: 'Çırağan Palace Kempinski',
        cityAr: 'إسطنبول',
        cityEn: 'Istanbul',
        countryAr: 'تركيا',
        countryEn: 'Turkey',
        taglineAr: 'قصر عثماني على البوسفور',
        taglineEn: 'Ottoman Palace on the Bosphorus',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.85,
        reviewCount: 2345,
        pricePerNight: 2100,
        badge: 'featured'
      },
      {
        id: '17',
        nameAr: 'فندق سانت ريجيس',
        nameEn: 'The St. Regis Istanbul',
        cityAr: 'إسطنبول',
        cityEn: 'Istanbul',
        countryAr: 'تركيا',
        countryEn: 'Turkey',
        taglineAr: 'فخامة عصرية في نيشانتاشي',
        taglineEn: 'Modern Luxury in Nişantaşı',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.8,
        reviewCount: 1234,
        pricePerNight: 1450,
        badge: 'new'
      },
      {
        id: '18',
        nameAr: 'فندق شانغريلا',
        nameEn: 'Shangri-La Bosphorus',
        cityAr: 'إسطنبول',
        cityEn: 'Istanbul',
        countryAr: 'تركيا',
        countryEn: 'Turkey',
        taglineAr: 'إطلالة بانورامية على البوسفور',
        taglineEn: 'Panoramic Bosphorus Views',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
        stars: 5,
        rating: 4.75,
        reviewCount: 1567,
        pricePerNight: 1350
      }
    ],
    tips: [
      {
        titleAr: 'أفضل وقت للزيارة',
        titleEn: 'Best Time to Visit',
        descriptionAr: 'الربيع (أبريل-مايو) والخريف (سبتمبر-نوفمبر)',
        descriptionEn: 'Spring (April-May) and Autumn (September-November)',
        icon: 'calendar'
      },
      {
        titleAr: 'بطاقة المتاحف',
        titleEn: 'Museum Pass',
        descriptionAr: 'احصل على بطاقة متاحف إسطنبول لتوفير المال والوقت',
        descriptionEn: 'Get Istanbul Museum Pass to save money and time',
        icon: 'ticket'
      },
      {
        titleAr: 'التنقل',
        titleEn: 'Getting Around',
        descriptionAr: 'استخدم بطاقة إسطنبول كارت للمواصلات العامة',
        descriptionEn: 'Use Istanbulkart for public transportation',
        icon: 'car'
      }
    ]
  }
};

const defaultDestination: DestinationData = {
  id: 'default',
  nameAr: 'وجهة غير معروفة',
  nameEn: 'Unknown Destination',
  countryAr: '',
  countryEn: '',
  image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&fit=crop',
  descriptionAr: 'لم نتمكن من العثور على معلومات حول هذه الوجهة.',
  descriptionEn: 'We could not find information about this destination.',
  areas: [],
  hotels: [],
  tips: []
};

const getIconComponent = (iconName: string) => {
  const icons: Record<string, JSX.Element> = {
    calendar: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    clock: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    car: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h8m-8 5h8m-4-9l-2 3H6l-2-3m16 0l-2 3h-2l-2-3M5 17h14a2 2 0 002-2v-3a2 2 0 00-2-2H5a2 2 0 00-2 2v3a2 2 0 002 2z" />
      </svg>
    ),
    shirt: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    'credit-card': (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    document: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    sun: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    ticket: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    )
  };
  return icons[iconName] || icons.calendar;
};

const DestinationDetail: React.FC<DestinationDetailProps> = ({ lang }) => {
  const { cityId } = useParams<{ cityId: string }>();
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;

  const destination = cityId && destinationsData[cityId] ? destinationsData[cityId] : defaultDestination;

  const name = isArabic ? destination.nameAr : destination.nameEn;
  const country = isArabic ? destination.countryAr : destination.countryEn;
  const description = isArabic ? destination.descriptionAr : destination.descriptionEn;

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${destination.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/40 to-charcoal-950/20" />
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 md:top-6 md:left-6 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-charcoal-700 hover:bg-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto max-w-7xl">
            <p className="text-cream-200 text-sm md:text-base mb-2">{country}</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-3">
              {name}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-6 md:py-10 bg-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal-900 mb-4">
            {isArabic ? 'نبذة عن المدينة' : 'About the City'}
          </h2>
          <p className="text-charcoal-600 leading-relaxed text-sm md:text-base">
            {description}
          </p>
        </div>
      </section>

      {destination.areas.length > 0 && (
        <section className="py-6 md:py-10 bg-cream-50">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal-900 mb-6">
              {isArabic ? 'المناطق الشائعة' : 'Popular Areas'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {destination.areas.map((area) => (
                <div
                  key={area.id}
                  className="group relative rounded-xl md:rounded-2xl overflow-hidden cursor-pointer shadow-card hover:shadow-card-hover transition-all duration-300"
                  onClick={() => navigate(`/search?city=${destination.id}&area=${area.id}`)}
                >
                  <div className="aspect-[4/3]">
                    <img
                      src={area.image}
                      alt={isArabic ? area.nameAr : area.nameEn}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <h3 className="font-display text-sm md:text-lg font-semibold text-white mb-0.5">
                      {isArabic ? area.nameAr : area.nameEn}
                    </h3>
                    <p className="text-cream-200 text-xs md:text-sm line-clamp-1">
                      {isArabic ? area.descriptionAr : area.descriptionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {destination.hotels.length > 0 && (
        <section className="py-6 md:py-10 bg-white">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal-900">
                {isArabic ? 'أفضل الفنادق' : 'Top Hotels'}
              </h2>
              <Button
                variant="ghost"
                onClick={() => navigate(`/search?city=${destination.id}`)}
                className="text-sm"
              >
                {isArabic ? 'عرض الكل' : 'View All'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {destination.hotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  {...hotel}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {destination.tips.length > 0 && (
        <section className="py-6 md:py-10 bg-cream-50">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal-900 mb-6">
              {isArabic ? 'معلومات مهمة' : 'Things to Know'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {destination.tips.map((tip, index) => (
                <Card key={index} className="p-4 md:p-5 bg-white">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-900 flex-shrink-0">
                      {getIconComponent(tip.icon)}
                    </div>
                    <div>
                      <h3 className="font-display text-base md:text-lg font-semibold text-charcoal-900 mb-1">
                        {isArabic ? tip.titleAr : tip.titleEn}
                      </h3>
                      <p className="text-charcoal-500 text-sm">
                        {isArabic ? tip.descriptionAr : tip.descriptionEn}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default DestinationDetail;
