import React, { useState, useRef, useEffect } from 'react';

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

const ChevronLeft = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const formatDateDisplay = (date?: Date): string => {
  if (!date) return 'Select date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isDateBefore = (date1: Date, date2: Date): boolean => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return d1 < d2;
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  minDate: Date;
  title: string;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
  minDate,
  title,
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = selectedDate || new Date();
    return { year: date.getFullYear(), month: date.getMonth() };
  });

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const daysInMonth = getDaysInMonth(currentMonth.year, currentMonth.month);
  const firstDay = getFirstDayOfMonth(currentMonth.year, currentMonth.month);

  const prevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.year, currentMonth.month, day);
    if (!isDateBefore(date, minDate) || isSameDay(date, minDate)) {
      onSelectDate(date);
      onClose();
    }
  };

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const today = new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-luxury-xl p-4 w-80 animate-scale-in"
      >
        <div className="text-center mb-4">
          <span className="text-sm font-medium text-charcoal-500">{title}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-cream-100 rounded-full transition-colors"
          >
            <ChevronLeft />
          </button>
          <span className="font-semibold text-charcoal-900">
            {MONTH_NAMES[currentMonth.month]} {currentMonth.year}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-cream-100 rounded-full transition-colors"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_NAMES.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-charcoal-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="h-10" />;
            }

            const date = new Date(currentMonth.year, currentMonth.month, day);
            const isDisabled = isDateBefore(date, minDate) && !isSameDay(date, minDate);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={isDisabled}
                className={`
                  h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all
                  ${isDisabled ? 'text-charcoal-300 cursor-not-allowed' : 'hover:bg-gold-100 cursor-pointer'}
                  ${isSelected ? 'bg-gold-500 text-white hover:bg-gold-600' : ''}
                  ${isToday && !isSelected ? 'border-2 border-gold-400' : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
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
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);

  const handleCheckInSelect = (date: Date) => {
    onCheckInChange?.(date);
    if (!checkOutDate || checkOutDate <= date) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      onCheckOutChange?.(nextDay);
    }
  };

  const handleCheckOutSelect = (date: Date) => {
    onCheckOutChange?.(date);
  };

  const checkOutMinDate = checkInDate
    ? new Date(checkInDate.getTime() + 86400000)
    : minDate;

  return (
    <>
      <div
        className={`
          flex bg-white rounded-2xl border-2 border-charcoal-200 
          hover:border-charcoal-300 transition-colors overflow-hidden
          ${layout === 'vertical' ? 'flex-col' : 'flex-row'}
          ${className}
        `}
      >
        <button
          type="button"
          onClick={() => setShowCheckIn(true)}
          className={`
            relative flex-1 text-start hover:bg-cream-50 transition-colors
            ${layout === 'horizontal' ? 'border-e-2 border-charcoal-200' : 'border-b-2 border-charcoal-200'}
          `}
        >
          <span className="absolute start-4 top-2 text-xs font-medium text-charcoal-500">
            Check-in
          </span>
          <div className="flex items-center px-4 pt-6 pb-3">
            <span className="text-charcoal-400 me-3">
              <CalendarIcon />
            </span>
            <span className="text-charcoal-900 font-medium">
              {formatDateDisplay(checkInDate)}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setShowCheckOut(true)}
          className="relative flex-1 text-start hover:bg-cream-50 transition-colors"
        >
          <span className="absolute start-4 top-2 text-xs font-medium text-charcoal-500">
            Check-out
          </span>
          <div className="flex items-center px-4 pt-6 pb-3">
            <span className="text-charcoal-400 me-3">
              <CalendarIcon />
            </span>
            <span className="text-charcoal-900 font-medium">
              {formatDateDisplay(checkOutDate)}
            </span>
          </div>
        </button>
      </div>

      <CalendarModal
        isOpen={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        selectedDate={checkInDate}
        onSelectDate={handleCheckInSelect}
        minDate={minDate}
        title="Check-in Date"
      />

      <CalendarModal
        isOpen={showCheckOut}
        onClose={() => setShowCheckOut(false)}
        selectedDate={checkOutDate}
        onSelectDate={handleCheckOutSelect}
        minDate={checkOutMinDate}
        title="Check-out Date"
      />
    </>
  );
};

export default DatePicker;
