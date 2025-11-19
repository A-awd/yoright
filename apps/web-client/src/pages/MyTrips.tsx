import React from 'react';
import { Language } from '../types';

interface MyTripsProps {
  lang: Language;
}

const MyTrips: React.FC<MyTripsProps> = ({ lang }) => {
  const isArabic = lang === Language.AR;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">
        {isArabic ? 'رحلاتي' : 'My Trips'}
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <i className="fas fa-suitcase text-6xl text-gray-300 mb-4"></i>
        <p className="text-xl text-gray-600 mb-2">
          {isArabic ? 'لا توجد رحلات بعد' : 'No trips yet'}
        </p>
        <p className="text-gray-500">
          {isArabic
            ? 'عند إجراء حجز، ستظهر رحلاتك هنا'
            : 'When you make a booking, your trips will appear here'}
        </p>
      </div>
    </div>
  );
};

export default MyTrips;
