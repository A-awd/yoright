import React, { useRef } from 'react';

interface DatePickerProps {
  checkInDate?: Date;
  checkOutDate?: Date;
  onCheckInChange?: (date: Date) => void;
  onCheckOutChange?: (date: Date) => void;
  minDate?: Date;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const formatDateForInput = (date?: Date): string => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

const formatDateDisplay = (date?: Date): string => {
  if (!date) return 'Select date';
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const DatePicker: React.FC<DatePickerProps> = ({
  checkInDate,
  checkOutDate,
  onCheckInChange,
  onCheckOutChange,
  minDate = new Date(),
  className = '',
  layout = 'horizontal',
}) => {
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value + 'T00:00:00');
    if (!isNaN(date.getTime())) {
      onCheckInChange?.(date);
      if (!checkOutDate || checkOutDate <= date) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        onCheckOutChange?.(nextDay);
      }
    }
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value + 'T00:00:00');
    if (!isNaN(date.getTime())) {
      onCheckOutChange?.(date);
    }
  };

  const checkInMin = formatDateForInput(minDate);
  const checkOutMin = checkInDate
    ? formatDateForInput(new Date(checkInDate.getTime() + 86400000))
    : checkInMin;

  return (
    <div
      className={`
        flex bg-white rounded-2xl border-2 border-charcoal-200 
        hover:border-charcoal-300 transition-colors overflow-hidden
        ${layout === 'vertical' ? 'flex-col' : 'flex-row'}
        ${className}
      `}
    >
      <label
        className={`
          relative flex-1 cursor-pointer hover:bg-cream-50 transition-colors
          ${layout === 'horizontal' ? 'border-e-2 border-charcoal-200' : 'border-b-2 border-charcoal-200'}
        `}
      >
        <span className="absolute start-4 top-2 text-xs font-medium text-charcoal-500">
          Check-in
        </span>
        <div className="flex items-center px-4 pt-6 pb-3 pointer-events-none">
          <span className="text-charcoal-400 me-3">
            <CalendarIcon />
          </span>
          <span className="text-charcoal-900 font-medium">
            {formatDateDisplay(checkInDate)}
          </span>
        </div>
        <input
          ref={checkInRef}
          type="date"
          value={formatDateForInput(checkInDate)}
          onChange={handleCheckInChange}
          min={checkInMin}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </label>

      <label className="relative flex-1 cursor-pointer hover:bg-cream-50 transition-colors">
        <span className="absolute start-4 top-2 text-xs font-medium text-charcoal-500">
          Check-out
        </span>
        <div className="flex items-center px-4 pt-6 pb-3 pointer-events-none">
          <span className="text-charcoal-400 me-3">
            <CalendarIcon />
          </span>
          <span className="text-charcoal-900 font-medium">
            {formatDateDisplay(checkOutDate)}
          </span>
        </div>
        <input
          ref={checkOutRef}
          type="date"
          value={formatDateForInput(checkOutDate)}
          onChange={handleCheckOutChange}
          min={checkOutMin}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </label>
    </div>
  );
};

export default DatePicker;
