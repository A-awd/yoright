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
    <nav className="bg-brand-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex flex-col items-center">
          <div className="flex flex-col items-center leading-tight">
            <span className="text-xl font-bold tracking-wide" style={{ fontFamily: 'Cairo, sans-serif' }}>
              يورايت
            </span>
            <span className="text-lg font-bold tracking-widest" style={{ letterSpacing: '0.15em' }}>
              YORIGHT
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link 
            to="/my-trips" 
            className="flex items-center gap-2 hover:text-brand-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">{isArabic ? 'رحلاتي' : 'My Trips'}</span>
          </Link>

          <button
            onClick={() => setLang(isArabic ? Language.EN : Language.AR)}
            className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            {isArabic ? 'EN' : 'AR'}
          </button>
        </div>
      </div>
    </nav>
  );
};
