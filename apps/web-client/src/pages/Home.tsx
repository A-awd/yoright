import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';

interface HomeProps {
  lang: Language;
}

const Home: React.FC<HomeProps> = ({ lang }) => {
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;

  const mockUser = {
    name: 'Abdulrahman',
    points: 1800,
    pointsExpiry: '30 مارس 2026'
  };

  const quickActions = [
    {
      icon: 'fa-hot-air-balloon',
      labelAr: 'أنشطة',
      labelEn: 'Activities',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      link: '/search'
    },
    {
      icon: 'fa-bed',
      labelAr: 'الإقامة',
      labelEn: 'Hotels',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      link: '/search'
    },
    {
      icon: 'fa-plane',
      labelAr: 'طيران',
      labelEn: 'Flights',
      color: 'bg-teal-50',
      iconColor: 'text-teal-600',
      link: '/search'
    }
  ];

  const featuredOffers = [
    {
      id: '1',
      titleAr: 'رحلتك بنتظرك والعرض الحصري معنا',
      titleEn: 'Your Trip Awaits',
      discount: '7%',
      categoryAr: 'طيران',
      categoryEn: 'Flights',
      image: 'https://picsum.photos/seed/offer1/400/250',
      code: 'SAUDIA'
    },
    {
      id: '2',
      titleAr: 'مسعد لعطلة استثنائية؟',
      titleEn: 'Ready for Vacation?',
      discount: '1,500₪',
      categoryAr: 'فنادق',
      categoryEn: 'Hotels',
      image: 'https://picsum.photos/seed/offer2/400/250',
      code: 'WINTER'
    },
    {
      id: '3',
      titleAr: '٪10 نقاط المسافر',
      titleEn: '10% Points',
      discount: '10%',
      categoryAr: 'رحلات',
      categoryEn: 'Trips',
      image: 'https://picsum.photos/seed/offer3/400/250',
      code: 'POINTS10'
    },
    {
      id: '4',
      titleAr: 'حافز الأسرة',
      titleEn: 'Family Reward',
      discount: '15%',
      categoryAr: 'عروض',
      categoryEn: 'Offers',
      image: 'https://picsum.photos/seed/offer4/400/250',
      code: 'STAWSB'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div
        className="relative bg-cover bg-center h-32"
        style={{ backgroundImage: 'url(https://picsum.photos/id/1040/1920/600)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/80 to-primary-600/60" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-wallet text-primary-600"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {isArabic ? 'المحفظة' : 'Wallet'}
                  </p>
                  <p className="text-sm font-bold text-primary-600">
                    {mockUser.points.toLocaleString()} {isArabic ? 'نقاط المسافر' : 'Points'}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-gray-800 mb-1">
                {isArabic ? `حياك الله ${mockUser.name}` : `Hello ${mockUser.name}`}
              </h1>
              <p className="text-sm text-gray-500">
                {isArabic ? 'ماذا تشترك لاكتشافه؟' : 'What would you like to discover?'}
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border-r-4 border-amber-500 rounded-lg p-3 flex items-center gap-3">
            <i className="fas fa-gift text-amber-600 text-xl"></i>
            <p className="text-sm text-amber-900">
              {isArabic 
                ? `تنتهي صلاحية ${mockUser.points.toLocaleString()} نقاط المسافر في ${mockUser.pointsExpiry}`
                : `${mockUser.points.toLocaleString()} points expire on ${mockUser.pointsExpiry}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => navigate(action.link)}
              className={`${action.color} rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
            >
              <div className={`text-4xl ${action.iconColor}`}>
                <i className={`fas ${action.icon}`}></i>
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {isArabic ? action.labelAr : action.labelEn}
              </span>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {isArabic ? 'عروض مميزة لك' : 'Featured Offers for You'}
            </h2>
            <button
              onClick={() => navigate('/offers')}
              className="text-primary-500 hover:text-primary-600 font-semibold text-sm flex items-center gap-1"
            >
              {isArabic ? 'عرض المزيد' : 'Show More'}
              <i className={`fas fa-chevron-${isArabic ? 'left' : 'right'} text-xs`}></i>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {featuredOffers.map((offer) => (
              <div
                key={offer.id}
                onClick={() => navigate('/offers')}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={offer.image}
                    alt={isArabic ? offer.titleAr : offer.titleEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                    {isArabic ? 'جديد' : 'New'}
                  </div>

                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-2xl font-bold">
                        {offer.discount}
                      </span>
                      <span className="text-white text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                        {isArabic ? offer.categoryAr : offer.categoryEn}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2">
                    {isArabic ? offer.titleAr : offer.titleEn}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {isArabic ? 'الكود:' : 'Code:'}
                    </span>
                    <span className="text-xs font-bold text-primary-600">
                      {offer.code}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {isArabic ? 'ابحث عن رحلتك القادمة' : 'Search for Your Next Trip'}
          </h2>
          <button
            onClick={() => navigate('/search')}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold py-4 rounded-xl transition duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            <i className="fas fa-search"></i>
            <span>{isArabic ? 'ابحث عن الفنادق' : 'Search Hotels'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
