import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';
import { CITIES } from '../utils/constants';

interface HomeProps {
  lang: Language;
}

const Home: React.FC<HomeProps> = ({ lang }) => {
  const navigate = useNavigate();
  const isArabic = lang === Language.AR;
  const [cityId, setCityId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (cityId) params.append('cityId', cityId);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    params.append('guests', guests.toString());
    navigate(`/search?${params}`);
  };

  return (
    <div className="min-h-[80vh]">
      <div
        className="relative bg-cover bg-center h-96"
        style={{ backgroundImage: 'url(https://picsum.photos/id/1040/1920/1080)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
            {isArabic ? 'اعثر على إقامتك المثالية' : 'Find Your Perfect Stay'}
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            {isArabic ? 'حجوزات فندقية عالمية المستوى' : 'World-class hotel bookings'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary-600">
                {isArabic ? 'المدينة' : 'City'}
              </label>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">{isArabic ? 'اختر مدينة' : 'Select City'}</option>
                {CITIES.map((city) => (
                  <option key={city.id} value={city.id}>
                    {isArabic ? city.nameAr : city.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-primary-600">
                {isArabic ? 'تسجيل الوصول' : 'Check-in'}
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-primary-600">
                {isArabic ? 'تسجيل المغادرة' : 'Check-out'}
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-primary-600">
                {isArabic ? 'الضيوف' : 'Guests'}
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-accent-500 hover:bg-accent-600 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md"
          >
            <i className="fas fa-search mr-2"></i>
            {isArabic ? 'ابحث عن الفنادق' : 'Search Hotels'}
          </button>
        </form>

        <div className="mt-16 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary-600 font-serif">
            {isArabic ? 'وجهات شائعة' : 'Popular Destinations'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {CITIES.map((city) => (
              <div
                key={city.id}
                onClick={() => {
                  setCityId(city.id);
                  navigate(`/search?cityId=${city.id}`);
                }}
                className="cursor-pointer group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                <img
                  src={city.image}
                  alt={isArabic ? city.nameAr : city.nameEn}
                  className="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-bold">
                    {isArabic ? city.nameAr : city.nameEn}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
