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
  <div className="flex items-center justify-between py-4">
    <div>
      <p className="font-medium text-charcoal-900">{label}</p>
      <p className="text-sm text-charcoal-500">{description}</p>
    </div>
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`
          w-10 h-10 rounded-full border-2 flex items-center justify-center
          transition-all duration-200
          ${value <= min
            ? 'border-charcoal-200 text-charcoal-300 cursor-not-allowed'
            : 'border-charcoal-300 text-charcoal-700 hover:border-gold-500 hover:text-gold-600'
          }
        `}
      >
        <span className="text-xl leading-none">−</span>
      </button>
      <span className="w-8 text-center font-semibold text-charcoal-900">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`
          w-10 h-10 rounded-full border-2 flex items-center justify-center
          transition-all duration-200
          ${value >= max
            ? 'border-charcoal-200 text-charcoal-300 cursor-not-allowed'
            : 'border-charcoal-300 text-charcoal-700 hover:border-gold-500 hover:text-gold-600'
          }
        `}
      >
        <span className="text-xl leading-none">+</span>
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between px-4 py-3.5
          bg-white rounded-2xl border-2 transition-all duration-200
          ${isOpen
            ? 'border-gold-500'
            : 'border-charcoal-200 hover:border-charcoal-300'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <span className="text-charcoal-400">
            <UsersIcon />
          </span>
          <div className="text-left">
            <p className="text-xs font-medium text-charcoal-500">Guests</p>
            <p className="text-charcoal-900 font-medium">{getSummaryText()}</p>
          </div>
        </div>
        <span className={`text-charcoal-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown />
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-luxury-lg border border-charcoal-100 z-50 animate-fade-in">
          <div className="p-4 divide-y divide-charcoal-100">
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
          <div className="p-4 border-t border-charcoal-100">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-medium rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestSelector;
