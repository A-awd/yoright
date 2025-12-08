import { translations } from './translations';
import { Language } from '../types';

export const useTranslation = (lang: Language) => {
  const currentLang = lang === Language.AR ? 'ar' : 'en';
  const t = translations[currentLang];
  const isRTL = lang === Language.AR;
  
  return { t, isRTL, lang: currentLang };
};

export const formatGuestSummary = (
  adults: number, 
  children: number, 
  rooms: number, 
  lang: Language
) => {
  const t = translations[lang === Language.AR ? 'ar' : 'en'].guestSelector;
  const parts: string[] = [];
  
  if (lang === Language.AR) {
    parts.push(`${adults} ${adults === 1 ? t.adult : t.adults}`);
    if (children > 0) {
      parts.push(`${children} ${children === 1 ? t.child : t.children}`);
    }
    parts.push(`${rooms} ${rooms === 1 ? t.room : t.rooms}`);
  } else {
    parts.push(`${adults} Adult${adults !== 1 ? 's' : ''}`);
    if (children > 0) {
      parts.push(`${children} Child${children !== 1 ? 'ren' : ''}`);
    }
    parts.push(`${rooms} Room${rooms !== 1 ? 's' : ''}`);
  }
  
  return parts.join(', ');
};

export const formatDate = (date: Date, lang: Language): string => {
  const t = translations[lang === Language.AR ? 'ar' : 'en'].calendar;
  const day = date.getDate();
  const month = t.monthsShort[date.getMonth()];
  return `${day} ${month}`;
};
