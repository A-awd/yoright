import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Language } from './types';
import { Navbar } from './components/layout/Navbar';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import HotelDetails from './pages/HotelDetails';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import MyTrips from './pages/MyTrips';
import Offers from './pages/Offers';
import Profile from './pages/Profile';

const BottomNavigation: React.FC<{ lang: Language }> = ({ lang }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;

  const navItems = [
    {
      path: '/',
      icon: 'fa-home',
      labelAr: 'الرئيسية',
      labelEn: 'Home'
    },
    {
      path: '/search',
      icon: 'fa-compass',
      labelAr: 'اكتشف',
      labelEn: 'Discover'
    },
    {
      path: '/my-trips',
      icon: 'fa-calendar-alt',
      labelAr: 'رحلاتي',
      labelEn: 'My Trips'
    },
    {
      path: '/offers',
      icon: 'fa-percent',
      labelAr: 'العروض',
      labelEn: 'Offers',
      badge: true
    },
    {
      path: '/profile',
      icon: 'fa-user',
      labelAr: 'حسابي',
      labelEn: 'Profile'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center flex-1 py-2 px-1 transition-colors ${
              isActive(item.path)
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="relative">
              <i className={`fas ${item.icon} text-xl mb-1`}></i>
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </div>
            <span className="text-xs font-medium">
              {isArabic ? item.labelAr : item.labelEn}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.AR);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === Language.AR ? 'rtl' : 'ltr';
    document.body.className = lang === Language.AR ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar lang={lang} setLang={setLang} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home lang={lang} />} />
            <Route path="/search" element={<SearchResults lang={lang} />} />
            <Route path="/hotel/:id" element={<HotelDetails lang={lang} />} />
            <Route path="/checkout" element={<Checkout lang={lang} />} />
            <Route path="/confirmation/:ref" element={<Confirmation lang={lang} />} />
            <Route path="/my-trips" element={<MyTrips lang={lang} />} />
            <Route path="/offers" element={<Offers lang={lang} />} />
            <Route path="/profile" element={<Profile lang={lang} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <BottomNavigation lang={lang} />
      </div>
    </Router>
  );
};

export default App;
