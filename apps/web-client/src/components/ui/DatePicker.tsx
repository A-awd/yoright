import React from 'react';

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
  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      onCheckInChange?.(date);
    }
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
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
      <div
        className={`
          relative flex-1 group
          ${layout === 'horizontal' ? 'border-r-2 border-charcoal-200' : 'border-b-2 border-charcoal-200'}
        `}
      >
        <label className="absolute left-4 top-2 text-xs font-medium text-charcoal-500">
          Check-in
        </label>
        <div className="flex items-center px-4 pt-6 pb-3">
          <span className="text-charcoal-400 mr-3">
            <CalendarIcon />
          </span>
          <div className="relative flex-1">
            <span className="text-charcoal-900 font-medium">
              {formatDateDisplay(checkInDate)}
            </span>
            <input
              type="date"
              value={formatDateForInput(checkInDate)}
              onChange={handleCheckInChange}
              min={checkInMin}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="relative flex-1 group">
        <label className="absolute left-4 top-2 text-xs font-medium text-charcoal-500">
          Check-out
        </label>
        <div className="flex items-center px-4 pt-6 pb-3">
          <span className="text-charcoal-400 mr-3">
            <CalendarIcon />
          </span>
          <div className="relative flex-1">
            <span className="text-charcoal-900 font-medium">
              {formatDateDisplay(checkOutDate)}
            </span>
            <input
              type="date"
              value={formatDateForInput(checkOutDate)}
              onChange={handleCheckOutChange}
              min={checkOutMin}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
