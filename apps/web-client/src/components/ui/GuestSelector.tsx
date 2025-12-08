import React, { useState, useRef, useEffect } from 'react';

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
        onClick={() => onChange(Math.max(min, value - 1))}
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
        onClick={() => onChange(Math.min(max, value + 1))}
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getSummaryText = () => {
    const parts: string[] = [];
    parts.push(`${adults} Adult${adults !== 1 ? 's' : ''}`);
    if (children > 0) {
      parts.push(`${children} Child${children !== 1 ? 'ren' : ''}`);
    }
    parts.push(`${rooms} Room${rooms !== 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`
          w-full flex items-center justify-between px-4 py-3.5
          bg-white rounded-2xl border-2 transition-all duration-200
          border-charcoal-200 hover:border-charcoal-300
          ${className}
        `}
      >
        <div className="flex items-center gap-3">
          <span className="text-charcoal-400">
            <UsersIcon />
          </span>
          <div className="text-start">
            <p className="text-xs font-medium text-charcoal-500">Guests</p>
            <p className="text-charcoal-900 font-medium text-sm">{getSummaryText()}</p>
          </div>
        </div>
        <span className="text-charcoal-400">
          <ChevronDown />
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <div
            ref={modalRef}
            className="
              relative bg-white w-full md:w-96 md:rounded-2xl
              rounded-t-3xl shadow-luxury-xl
              animate-slide-up md:animate-scale-in
              max-h-[85vh] overflow-hidden
              safe-area-inset-bottom
            "
          >
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-12 h-1.5 bg-charcoal-200 rounded-full" />
            </div>

            <div className="px-6 py-4 border-b border-charcoal-100">
              <h3 className="font-semibold text-charcoal-900 text-lg text-center">Select Guests & Rooms</h3>
            </div>

            <div className="px-6 divide-y divide-charcoal-100">
              <CounterRow
                label="Adults"
                description="Ages 13 or above"
                value={adults}
                onChange={(v) => onAdultsChange?.(v)}
                min={1}
                max={maxAdults}
              />
              <CounterRow
                label="Children"
                description="Ages 0-12"
                value={children}
                onChange={(v) => onChildrenChange?.(v)}
                min={0}
                max={maxChildren}
              />
              <CounterRow
                label="Rooms"
                description="Number of rooms"
                value={rooms}
                onChange={(v) => onRoomsChange?.(v)}
                min={1}
                max={maxRooms}
              />
            </div>

            <div className="px-6 py-5 border-t border-charcoal-100 bg-white">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-4 bg-brand-800 hover:bg-brand-900 text-white font-semibold rounded-xl transition-colors text-base"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GuestSelector;
