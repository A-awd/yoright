import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface GuestSelectorProps {
  adults?: number;
  children?: number;
  rooms?: number;
  onAdultsChange?: (count: number) => void;
  onChildrenChange?: (count: number) => void;
  onRoomsChange?: (count: number) => void;
  maxAdults?: number;
  maxChildren?: number;
  maxRooms?: number;
  className?: string;
  lang?: Language;
}

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const ChevronDown = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

interface CounterRowProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const CounterRow: React.FC<CounterRowProps> = ({
  label,
  description,
  value,
  onChange,
  min = 0,
  max = 10,
}) => (
  <div className="flex items-center justify-between py-5">
    <div>
      <p className="font-semibold text-charcoal-900 text-base">{label}</p>
      <p className="text-sm text-charcoal-500 mt-0.5">{description}</p>
    </div>
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange(Math.max(min, value - 1));
        }}
        disabled={value <= min}
        className={`
          w-11 h-11 rounded-full border-2 flex items-center justify-center
          transition-all duration-200
          ${value <= min
            ? 'border-charcoal-200 text-charcoal-300 cursor-not-allowed'
            : 'border-charcoal-300 text-charcoal-700 hover:border-brand-800 hover:text-brand-800 active:bg-charcoal-100'
          }
        `}
      >
        <span className="text-2xl leading-none font-light">−</span>
      </button>
      <span className="w-10 text-center font-bold text-charcoal-900 text-xl">{value}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange(Math.min(max, value + 1));
        }}
        disabled={value >= max}
        className={`
          w-11 h-11 rounded-full border-2 flex items-center justify-center
          transition-all duration-200
          ${value >= max
            ? 'border-charcoal-200 text-charcoal-300 cursor-not-allowed'
            : 'border-charcoal-300 text-charcoal-700 hover:border-brand-800 hover:text-brand-800 active:bg-charcoal-100'
          }
        `}
      >
        <span className="text-2xl leading-none font-light">+</span>
      </button>
    </div>
  </div>
);

export const GuestSelector: React.FC<GuestSelectorProps> = ({
  adults = 2,
  children = 0,
  rooms = 1,
  onAdultsChange,
  onChildrenChange,
  onRoomsChange,
  maxAdults = 10,
  maxChildren = 6,
  maxRooms = 5,
  className = '',
  lang = Language.EN,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const isArabic = lang === Language.AR;
  const t = translations[isArabic ? 'ar' : 'en'];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
      setIsAnimating(true);
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 200);
  };

  const getSummaryText = () => {
    const parts: string[] = [];
    if (isArabic) {
      parts.push(`${adults} ${t.guestSelector.adults}`);
      if (children > 0) {
        parts.push(`${children} ${t.guestSelector.children}`);
      }
      parts.push(`${rooms} ${t.guestSelector.rooms}`);
    } else {
      parts.push(`${adults} Adult${adults !== 1 ? 's' : ''}`);
      if (children > 0) {
        parts.push(`${children} Child${children !== 1 ? 'ren' : ''}`);
      }
      parts.push(`${rooms} Room${rooms !== 1 ? 's' : ''}`);
    }
    return parts.join(isArabic ? '، ' : ', ');
  };

  const modalContent = (
    <div 
      className={`fixed inset-0 flex flex-col justify-end md:justify-center md:items-center ${isArabic ? 'rtl' : 'ltr'}`}
      style={{ zIndex: 9999 }}
    >
      <div 
        className={`
          absolute inset-0 bg-black/60 transition-opacity duration-200
          ${isAnimating ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={handleClose}
      />
      
      <div
        className={`
          relative bg-white w-full md:max-w-md md:mx-4 md:rounded-2xl
          rounded-t-3xl shadow-2xl
          transition-transform duration-200 ease-out
          ${isAnimating ? 'translate-y-0' : 'translate-y-full md:translate-y-0 md:scale-95'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-12 h-1.5 bg-charcoal-300 rounded-full" />
        </div>

        <div className="px-6 py-4 border-b border-charcoal-100">
          <h3 className="font-semibold text-charcoal-900 text-lg text-center">{t.guestSelector.title}</h3>
        </div>

        <div className="px-6 divide-y divide-charcoal-100 max-h-[60vh] overflow-y-auto">
          <CounterRow
            label={t.guestSelector.adults}
            description={t.guestSelector.adultsDesc}
            value={adults}
            onChange={(v) => onAdultsChange?.(v)}
            min={1}
            max={maxAdults}
          />
          <CounterRow
            label={t.guestSelector.children}
            description={t.guestSelector.childrenDesc}
            value={children}
            onChange={(v) => onChildrenChange?.(v)}
            min={0}
            max={maxChildren}
          />
          <CounterRow
            label={t.guestSelector.rooms}
            description={t.guestSelector.roomsDesc}
            value={rooms}
            onChange={(v) => onRoomsChange?.(v)}
            min={1}
            max={maxRooms}
          />
        </div>

        <div className="px-6 py-5 border-t border-charcoal-100 bg-white rounded-b-3xl md:rounded-b-2xl">
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-4 bg-brand-800 hover:bg-brand-900 text-white font-semibold rounded-xl transition-colors text-base"
          >
            {t.common.done}
          </button>
          <div className="h-safe-area-inset-bottom" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`
          w-full flex items-center gap-2 px-4 h-12
          bg-white rounded-xl border-2 transition-all duration-200
          border-charcoal-200 hover:border-charcoal-300
          ${className}
        `}
      >
        <span className="text-charcoal-400">
          <UsersIcon />
        </span>
        <span className="text-charcoal-700 text-sm font-medium truncate flex-1 text-start">
          {getSummaryText()}
        </span>
        <span className="text-charcoal-400">
          <ChevronDown />
        </span>
      </button>

      {isOpen && createPortal(modalContent, document.body)}
    </>
  );
};

export default GuestSelector;
