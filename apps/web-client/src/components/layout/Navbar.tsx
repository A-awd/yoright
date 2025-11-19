import React from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../../types';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, setLang }) => {
  const isArabic = lang === Language.AR;

  return (
    <nav className="bg-primary-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <i className="fas fa-plane-departure text-2xl text-accent-500"></i>
          <span className="text-xl font-bold font-serif">YoRight</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/my-trips" className="hover:text-accent-500 transition">
            <i className="fas fa-suitcase mr-2"></i>
            {isArabic ? 'رحلاتي' : 'My Trips'}
          </Link>

          <button
            onClick={() => setLang(isArabic ? Language.EN : Language.AR)}
            className="bg-primary-700 hover:bg-primary-800 px-3 py-1 rounded transition"
          >
            {isArabic ? 'EN' : 'AR'}
          </button>
        </div>
      </div>
    </nav>
  );
};
