import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language, Currency } from '../types';
import { Button, Card, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Input } from '../components/ui';

interface ProfileProps {
  lang: Language;
}

const Profile: React.FC<ProfileProps> = ({ lang }) => {
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['personal']));
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(Currency.SAR);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const mockUser = {
    name: 'Abdulrahman Al-Rashid',
    email: 'abdulrahman@example.com',
    phone: '+966 50 123 4567',
    avatar: 'https://picsum.photos/200/200?random=1',
    memberSince: 'January 2023',
    memberSinceAr: 'يناير 2023',
    tier: 'Gold Member',
    tierAr: 'عضو ذهبي',
    points: 12500,
    totalTrips: 8,
    savedHotels: 15,
    reviewsWritten: 5,
  };

  const savedCards = [
    { id: '1', last4: '4242', brand: 'Visa', expiry: '12/25' },
    { id: '2', last4: '8888', brand: 'Mastercard', expiry: '08/26' },
  ];

  const favoriteHotels = [
    { id: '1', name: isArabic ? 'فندق الريتز كارلتون' : 'The Ritz-Carlton', image: 'https://picsum.photos/300/200?random=10', rating: 4.9 },
    { id: '2', name: isArabic ? 'فندق فور سيزونز' : 'Four Seasons Hotel', image: 'https://picsum.photos/300/200?random=11', rating: 4.8 },
    { id: '3', name: isArabic ? 'فندق روزوود' : 'Rosewood Hotel', image: 'https://picsum.photos/300/200?random=12', rating: 4.7 },
    { id: '4', name: isArabic ? 'منتجع سانت ريجيس' : 'St. Regis Resort', image: 'https://picsum.photos/300/200?random=13', rating: 4.9 },
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const SectionHeader: React.FC<{ id: string; icon: string; title: string; titleAr: string }> = ({ id, icon, title, titleAr }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 hover:bg-cream-50 transition-colors rounded-2xl"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
          <i className={`fas ${icon} text-brand-900`}></i>
        </div>
        <span className="font-medium text-charcoal-800">{isArabic ? titleAr : title}</span>
      </div>
      <i className={`fas fa-chevron-${expandedSections.has(id) ? 'up' : 'down'} text-charcoal-400 transition-transform`}></i>
    </button>
  );

  return (
    <div className={`min-h-screen bg-cream-100 pb-24 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 pt-12 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-600 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-600 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-brand-600 ring-offset-4 ring-offset-charcoal-900">
                <img 
                  src={mockUser.avatar} 
                  alt={mockUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-brand-800 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-900 transition-colors">
                <i className="fas fa-camera text-charcoal-900"></i>
              </button>
            </div>
            
            <h1 className="text-2xl font-display font-bold text-white mb-1">
              {mockUser.name}
            </h1>
            
            <p className="text-charcoal-300 mb-3">
              {isArabic ? `عضو منذ ${mockUser.memberSinceAr}` : `Member since ${mockUser.memberSince}`}
            </p>
            
            <Badge variant="gold" size="md" className="mb-4">
              <i className="fas fa-crown mr-1.5"></i>
              {isArabic ? mockUser.tierAr : mockUser.tier}
            </Badge>
            
            <div className="flex items-center gap-2 bg-charcoal-800/50 rounded-2xl px-5 py-3 backdrop-blur">
              <i className="fas fa-coins text-brand-600 text-xl"></i>
              <span className="text-2xl font-bold text-brand-600">{mockUser.points.toLocaleString()}</span>
              <span className="text-charcoal-400 text-sm">{isArabic ? 'نقطة' : 'points'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <Card padding="none" className="mb-6 overflow-hidden">
          <div className="grid grid-cols-4 divide-x divide-charcoal-100">
            {[
              { value: mockUser.totalTrips, labelEn: 'Trips', labelAr: 'رحلات', icon: 'fa-plane-departure' },
              { value: mockUser.savedHotels, labelEn: 'Saved', labelAr: 'محفوظة', icon: 'fa-heart' },
              { value: mockUser.points.toLocaleString(), labelEn: 'Points', labelAr: 'نقاط', icon: 'fa-coins' },
              { value: mockUser.reviewsWritten, labelEn: 'Reviews', labelAr: 'تقييمات', icon: 'fa-star' },
            ].map((stat, idx) => (
              <div key={idx} className="p-4 text-center">
                <div className="w-10 h-10 bg-cream-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <i className={`fas ${stat.icon} text-brand-900`}></i>
                </div>
                <p className="text-xl font-bold text-charcoal-900">{stat.value}</p>
                <p className="text-xs text-charcoal-500">{isArabic ? stat.labelAr : stat.labelEn}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="none" className="mb-6">
          <SectionHeader id="personal" icon="fa-user" title="Personal Information" titleAr="المعلومات الشخصية" />
          {expandedSections.has('personal') && (
            <div className="px-4 pb-4 space-y-4">
              <div className="bg-cream-50 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-charcoal-500 mb-0.5">{isArabic ? 'الاسم' : 'Name'}</p>
                    <p className="text-charcoal-800 font-medium">{mockUser.name}</p>
                  </div>
                </div>
                <div className="border-t border-charcoal-200 pt-3">
                  <p className="text-xs text-charcoal-500 mb-0.5">{isArabic ? 'البريد الإلكتروني' : 'Email'}</p>
                  <p className="text-charcoal-800 font-medium">{mockUser.email}</p>
                </div>
                <div className="border-t border-charcoal-200 pt-3">
                  <p className="text-xs text-charcoal-500 mb-0.5">{isArabic ? 'رقم الهاتف' : 'Phone'}</p>
                  <p className="text-charcoal-800 font-medium">{mockUser.phone}</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" fullWidth onClick={() => setEditModalOpen(true)}>
                <i className="fas fa-edit mr-2"></i>
                {isArabic ? 'تعديل المعلومات' : 'Edit Information'}
              </Button>
            </div>
          )}
        </Card>

        <Card padding="none" className="mb-6">
          <SectionHeader id="payment" icon="fa-credit-card" title="Payment Methods" titleAr="طرق الدفع" />
          {expandedSections.has('payment') && (
            <div className="px-4 pb-4 space-y-3">
              {savedCards.map(card => (
                <div key={card.id} className="flex items-center justify-between bg-cream-50 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-charcoal-800 rounded-lg flex items-center justify-center">
                      <i className={`fab fa-cc-${card.brand.toLowerCase()} text-white text-xl`}></i>
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-800">•••• {card.last4}</p>
                      <p className="text-xs text-charcoal-500">{isArabic ? 'ينتهي' : 'Expires'} {card.expiry}</p>
                    </div>
                  </div>
                  <button className="text-charcoal-400 hover:text-error-500 transition-colors">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              ))}
              <Button variant="ghost" size="sm" fullWidth>
                <i className="fas fa-plus mr-2"></i>
                {isArabic ? 'إضافة بطاقة جديدة' : 'Add New Card'}
              </Button>
            </div>
          )}
        </Card>

        <Card padding="none" className="mb-6">
          <SectionHeader id="preferences" icon="fa-sliders-h" title="Preferences" titleAr="التفضيلات" />
          {expandedSections.has('preferences') && (
            <div className="px-4 pb-4 space-y-4">
              <div className="flex items-center justify-between bg-cream-50 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <i className="fas fa-language text-brand-900"></i>
                  <span className="text-charcoal-800">{isArabic ? 'اللغة' : 'Language'}</span>
                </div>
                <select className="bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600">
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between bg-cream-50 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <i className="fas fa-coins text-brand-900"></i>
                  <span className="text-charcoal-800">{isArabic ? 'العملة' : 'Currency'}</span>
                </div>
                <select 
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
                  className="bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                >
                  <option value={Currency.SAR}>SAR</option>
                  <option value={Currency.USD}>USD</option>
                  <option value={Currency.EUR}>EUR</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between bg-cream-50 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <i className="fas fa-bell text-brand-900"></i>
                  <span className="text-charcoal-800">{isArabic ? 'الإشعارات' : 'Notifications'}</span>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-14 h-8 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-brand-800' : 'bg-charcoal-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${notificationsEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          )}
        </Card>

        <Card padding="none" className="mb-6">
          <SectionHeader id="favorites" icon="fa-heart" title="My Favorites" titleAr="المفضلة" />
          {expandedSections.has('favorites') && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {favoriteHotels.map(hotel => (
                  <button
                    key={hotel.id}
                    onClick={() => navigate(`/hotel/${hotel.id}`)}
                    className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
                  >
                    <img 
                      src={hotel.image} 
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium truncate">{hotel.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <i className="fas fa-star text-brand-600 text-xs"></i>
                        <span className="text-white text-xs">{hotel.rating}</span>
                      </div>
                    </div>
                    <button className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                      <i className="fas fa-heart text-red-500"></i>
                    </button>
                  </button>
                ))}
              </div>
              <Button variant="ghost" size="sm" fullWidth onClick={() => navigate('/favorites')}>
                {isArabic ? 'عرض الكل' : 'See All'}
                <i className={`fas fa-arrow-${isArabic ? 'left' : 'right'} ml-2`}></i>
              </Button>
            </div>
          )}
        </Card>

        <Card padding="none" className="mb-6">
          <SectionHeader id="security" icon="fa-shield-alt" title="Security" titleAr="الأمان" />
          {expandedSections.has('security') && (
            <div className="px-4 pb-4 space-y-3">
              <button className="w-full flex items-center justify-between bg-cream-50 rounded-2xl p-4 hover:bg-cream-100 transition-colors">
                <div className="flex items-center gap-3">
                  <i className="fas fa-key text-brand-900"></i>
                  <span className="text-charcoal-800">{isArabic ? 'تغيير كلمة المرور' : 'Change Password'}</span>
                </div>
                <i className={`fas fa-chevron-${isArabic ? 'left' : 'right'} text-charcoal-400`}></i>
              </button>
              
              <div className="flex items-center justify-between bg-cream-50 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <i className="fas fa-mobile-alt text-brand-900"></i>
                  <div>
                    <span className="text-charcoal-800 block">{isArabic ? 'المصادقة الثنائية' : 'Two-Factor Authentication'}</span>
                    <span className="text-xs text-charcoal-500">{isArabic ? 'غير مفعل' : 'Not enabled'}</span>
                  </div>
                </div>
                <Badge variant="warning" size="sm">{isArabic ? 'تفعيل' : 'Enable'}</Badge>
              </div>
            </div>
          )}
        </Card>

        <Card padding="none" className="mb-6">
          <SectionHeader id="support" icon="fa-headset" title="Support" titleAr="الدعم" />
          {expandedSections.has('support') && (
            <div className="px-4 pb-4 space-y-3">
              {[
                { icon: 'fa-question-circle', labelEn: 'Help Center', labelAr: 'مركز المساعدة' },
                { icon: 'fa-envelope', labelEn: 'Contact Us', labelAr: 'اتصل بنا' },
                { icon: 'fa-file-alt', labelEn: 'FAQs', labelAr: 'الأسئلة الشائعة' },
              ].map((item, idx) => (
                <button key={idx} className="w-full flex items-center justify-between bg-cream-50 rounded-2xl p-4 hover:bg-cream-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <i className={`fas ${item.icon} text-brand-900`}></i>
                    <span className="text-charcoal-800">{isArabic ? item.labelAr : item.labelEn}</span>
                  </div>
                  <i className={`fas fa-chevron-${isArabic ? 'left' : 'right'} text-charcoal-400`}></i>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Button 
          variant="ghost" 
          fullWidth 
          className="text-error-500 hover:bg-error-500/10 border border-error-500/20"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          {isArabic ? 'تسجيل الخروج' : 'Log Out'}
        </Button>
      </div>

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} size="lg">
        <ModalHeader onClose={() => setEditModalOpen(false)}>
          {isArabic ? 'تعديل المعلومات الشخصية' : 'Edit Personal Information'}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
                {isArabic ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <Input defaultValue={mockUser.name} placeholder={isArabic ? 'أدخل اسمك' : 'Enter your name'} />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
                {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <Input type="email" defaultValue={mockUser.email} placeholder={isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email'} />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
                {isArabic ? 'رقم الهاتف' : 'Phone Number'}
              </label>
              <Input type="tel" defaultValue={mockUser.phone} placeholder={isArabic ? 'أدخل رقم هاتفك' : 'Enter your phone'} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={() => setEditModalOpen(false)}>
            {isArabic ? 'حفظ التغييرات' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Profile;
