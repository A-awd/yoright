import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface DatePickerProps {
  checkInDate?: Date;
  checkOutDate?: Date;
  onCheckInChange?: (date: Date) => void;
  onCheckOutChange?: (date: Date) => void;
  minDate?: Date;
  className?: string;
  layout?: 'horizontal' | 'vertical';
  lang?: Language;
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

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  minDate: Date;
  title: string;
  lang: Language;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
  minDate,
  title,
  lang,
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = selectedDate || new Date();
    return { year: date.getFullYear(), month: date.getMonth() };
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const isArabic = lang === Language.AR;
  const t = translations[isArabic ? 'ar' : 'en'];
  const monthNames = t.calendar.months;
  const dayNames = t.calendar.weekdays;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 200);
  };

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
      handleClose();
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

  const modalContent = (
    <div 
      className="fixed inset-0 flex items-end md:items-center justify-center"
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
          relative bg-white w-full md:max-w-sm md:mx-4 md:rounded-2xl
          rounded-t-3xl shadow-2xl p-4
          transition-transform duration-200 ease-out
          ${isAnimating ? 'translate-y-0' : 'translate-y-full md:translate-y-0 md:scale-95'}
          ${isArabic ? 'rtl' : 'ltr'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-1 pb-2 md:hidden">
          <div className="w-12 h-1.5 bg-charcoal-300 rounded-full" />
        </div>

        <div className="text-center mb-4">
          <span className="text-sm font-medium text-charcoal-500">{title}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={isArabic ? nextMonth : prevMonth}
            className="p-2 hover:bg-cream-100 rounded-full transition-colors"
          >
            {isArabic ? <ChevronRight /> : <ChevronLeft />}
          </button>
          <span className="font-semibold text-charcoal-900">
            {monthNames[currentMonth.month]} {currentMonth.year}
          </span>
          <button
            onClick={isArabic ? prevMonth : nextMonth}
            className="p-2 hover:bg-cream-100 rounded-full transition-colors"
          >
            {isArabic ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
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
                  h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all mx-auto
                  ${isDisabled ? 'text-charcoal-300 cursor-not-allowed' : 'hover:bg-brand-100 cursor-pointer'}
                  ${isSelected ? 'bg-brand-800 text-white hover:bg-brand-900' : ''}
                  ${isToday && !isSelected ? 'border-2 border-brand-600' : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-charcoal-100">
          <button
            onClick={handleClose}
            className="w-full py-3 bg-brand-800 hover:bg-brand-900 text-white font-semibold rounded-xl transition-colors"
          >
            {t.common.done}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export const DatePicker: React.FC<DatePickerProps> = ({
  checkInDate,
  checkOutDate,
  onCheckInChange,
  onCheckOutChange,
  minDate = new Date(),
  className = '',
  layout = 'horizontal',
  lang = Language.EN,
}) => {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);

  const isArabic = lang === Language.AR;
  const t = translations[isArabic ? 'ar' : 'en'];

  const formatDateDisplay = (date?: Date): string => {
    if (!date) return t.search.selectDate;
    const day = date.getDate();
    const month = t.calendar.monthsShort[date.getMonth()];
    return `${day} ${month}`;
  };

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
          flex gap-2
          ${layout === 'vertical' ? 'flex-col' : 'flex-row'}
          ${className}
        `}
      >
        <button
          type="button"
          onClick={() => setShowCheckIn(true)}
          className="flex-1 flex items-center gap-2 px-4 h-12 bg-white rounded-xl border-2 border-charcoal-200 hover:border-charcoal-300 transition-colors"
        >
          <span className="text-charcoal-400">
            <CalendarIcon />
          </span>
          <span className="text-charcoal-700 text-sm font-medium truncate">
            {formatDateDisplay(checkInDate)}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowCheckOut(true)}
          className="flex-1 flex items-center gap-2 px-4 h-12 bg-white rounded-xl border-2 border-charcoal-200 hover:border-charcoal-300 transition-colors"
        >
          <span className="text-charcoal-400">
            <CalendarIcon />
          </span>
          <span className="text-charcoal-700 text-sm font-medium truncate">
            {formatDateDisplay(checkOutDate)}
          </span>
        </button>
      </div>

      <CalendarModal
        isOpen={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        selectedDate={checkInDate}
        onSelectDate={handleCheckInSelect}
        minDate={minDate}
        title={t.search.checkIn}
        lang={lang}
      />

      <CalendarModal
        isOpen={showCheckOut}
        onClose={() => setShowCheckOut(false)}
        selectedDate={checkOutDate}
        onSelectDate={handleCheckOutSelect}
        minDate={checkOutMinDate}
        title={t.search.checkOut}
        lang={lang}
      />
    </>
  );
};

export default DatePicker;
