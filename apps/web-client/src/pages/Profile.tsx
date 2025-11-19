import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';

interface ProfileProps {
  lang: Language;
}

const Profile: React.FC<ProfileProps> = ({ lang }) => {
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;

  const mockUser = {
    name: 'Abdulrahman',
    email: 'kun.ads90@gmail.com',
    reference: 'ALM 103 311 725',
    points: 1800,
    pointsExpiry: '30 مارس 2026'
  };

  const menuItems = [
    {
      icon: 'fa-calendar-alt',
      labelAr: 'حجوزاتي',
      labelEn: 'My Bookings',
      link: '/my-trips'
    },
    {
      icon: 'fa-heart',
      labelAr: 'اختياري',
      labelEn: 'Favorites',
      link: '#'
    },
    {
      icon: 'fa-envelope',
      labelAr: 'الرسائل',
      labelEn: 'Messages',
      link: '#'
    }
  ];

  const walletActions = [
    {
      icon: 'fa-ticket-alt',
      labelAr: 'اشتر قسيمة سفرية',
      labelEn: 'Buy Travel Voucher'
    },
    {
      icon: 'fa-exchange-alt',
      labelAr: 'تحويل النقاط',
      labelEn: 'Convert Points'
    },
    {
      icon: 'fa-plus-circle',
      labelAr: 'أضف النقاط لمحفظتك',
      labelEn: 'Add Points'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white pt-8 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <i className="fas fa-user text-4xl text-gray-400"></i>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              {isArabic ? `مرحبا ${mockUser.name}` : `Hello ${mockUser.name}`}
            </h1>
            
            <p className="text-gray-600 mb-3">{mockUser.email}</p>
            
            <div className="flex items-center gap-2 text-gray-500 mb-4">
              <i className="far fa-id-badge"></i>
              <span className="text-sm">{isArabic ? 'رقم المسافر المرجعي' : 'Reference Number'}</span>
              <i className="far fa-calendar"></i>
              <span className="font-mono text-sm">{mockUser.reference}</span>
            </div>
            
            <button className="text-primary-500 hover:text-primary-600 font-semibold text-sm">
              {isArabic ? 'تعديل ملفك الشخصي' : 'Edit Your Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-4">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => item.link !== '#' && navigate(item.link)}
            className="w-full bg-white rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <i className={`far ${item.icon} text-xl text-gray-600`}></i>
              <span className="text-gray-800 font-medium">
                {isArabic ? item.labelAr : item.labelEn}
              </span>
            </div>
            <i className={`fas fa-chevron-${isArabic ? 'left' : 'right'} text-gray-400`}></i>
          </button>
        ))}

        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">
            {isArabic ? 'المحفظة' : 'Wallet'}
          </h2>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-wallet text-primary-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-600">
                    {mockUser.points.toLocaleString()} {isArabic ? 'نقطة المسافر' : 'Points'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isArabic ? `تنتهي صلاحية ${mockUser.points.toLocaleString()} نقطة المسافر في ${mockUser.pointsExpiry}` : `${mockUser.points.toLocaleString()} points expire on ${mockUser.pointsExpiry}`}
                  </p>
                </div>
              </div>
              <i className={`fas fa-chevron-${isArabic ? 'left' : 'right'} text-gray-400`}></i>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {walletActions.map((action, idx) => (
              <button
                key={idx}
                className="bg-white rounded-lg p-4 flex items-center gap-3 hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i className={`fas ${action.icon} text-primary-600`}></i>
                </div>
                <span className="text-gray-800 font-medium text-sm">
                  {isArabic ? action.labelAr : action.labelEn}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mt-4 border border-blue-200">
            <div className="flex gap-3">
              <i className="fas fa-info-circle text-blue-600 mt-1"></i>
              <div>
                <p className="text-sm text-blue-900 leading-relaxed">
                  {isArabic 
                    ? 'ما لم تقم بإكمال معاملة مؤهلة؟ يمكنك إضافة رصيد إلى محفظتك بسهولة عن طريق تحويل نقاط مكافأة من برنامج الولاء الخاص بمصرف الراجحي.'
                    : 'Haven\'t completed a qualifying transaction? You can easily add balance to your wallet by converting reward points from Al Rajhi Bank loyalty program.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
