import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Language } from './types';
import { Navbar } from './components/layout/Navbar';
import { MapsProvider } from './contexts/MapsContext';
import Home from './pages/Home';

const Explore = lazy(() => import('./pages/Explore'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'));
const HotelDetails = lazy(() => import('./pages/HotelDetails'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Confirmation = lazy(() => import('./pages/Confirmation'));
const MyTrips = lazy(() => import('./pages/MyTrips'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Favorites = lazy(() => import('./pages/Favorites'));

interface NavItem {
  path: string;
  icon: string;
  labelAr: string;
  labelEn: string;
  badge?: boolean;
}

const BottomNavigation: React.FC<{ lang: Language }> = ({ lang }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;

  const navItems: NavItem[] = [
    {
      path: '/',
      icon: 'fa-home',
      labelAr: 'الرئيسية',
      labelEn: 'Home'
    },
    {
      path: '/explore',
      icon: 'fa-compass',
      labelAr: 'اكتشف',
      labelEn: 'Explore'
    },
    {
      path: '/my-trips',
      icon: 'fa-calendar-alt',
      labelAr: 'رحلاتي',
      labelEn: 'My Trips'
    },
    {
      path: '/favorites',
      icon: 'fa-heart',
      labelAr: 'المفضلة',
      labelEn: 'Saved'
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
                <span className="absolute -top-1 -end-1 w-2 h-2 bg-red-500 rounded-full"></span>
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

const AppContent: React.FC<{ lang: Language; setLang: (lang: Language) => void }> = ({ lang, setLang }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) {
    return (
      <Suspense fallback={null}>
        <Routes>
          <Route path="/login" element={<Login lang={lang} />} />
          <Route path="/signup" element={<SignUp lang={lang} />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar lang={lang} setLang={setLang} />
      <main className="flex-grow">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}>
          <Routes>
            <Route path="/" element={<Home lang={lang} />} />
            <Route path="/explore" element={<Explore lang={lang} />} />
            <Route path="/destination/:cityId" element={<DestinationDetail lang={lang} />} />
            <Route path="/search" element={<SearchResults lang={lang} />} />
            <Route path="/hotel/:id" element={<HotelDetails lang={lang} />} />
            <Route path="/checkout" element={<Checkout lang={lang} />} />
            <Route path="/confirmation/:ref" element={<Confirmation lang={lang} />} />
            <Route path="/my-trips" element={<MyTrips lang={lang} />} />
            <Route path="/profile" element={<Profile lang={lang} />} />
            <Route path="/favorites" element={<Favorites lang={lang} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <BottomNavigation lang={lang} />
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
    <MapsProvider>
      <Router>
        <AppContent lang={lang} setLang={setLang} />
      </Router>
    </MapsProvider>
  );
};

export default App;
