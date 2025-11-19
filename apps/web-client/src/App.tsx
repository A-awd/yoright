import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Language } from './types';
import { Navbar } from './components/layout/Navbar';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import HotelDetails from './pages/HotelDetails';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import MyTrips from './pages/MyTrips';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.AR);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === Language.AR ? 'rtl' : 'ltr';
    document.body.className = lang === Language.AR ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar lang={lang} setLang={setLang} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home lang={lang} />} />
            <Route path="/search" element={<SearchResults lang={lang} />} />
            <Route path="/hotel/:id" element={<HotelDetails lang={lang} />} />
            <Route path="/checkout" element={<Checkout lang={lang} />} />
            <Route path="/confirmation/:ref" element={<Confirmation lang={lang} />} />
            <Route path="/my-trips" element={<MyTrips lang={lang} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 p-3 flex justify-around text-xs text-gray-500 z-40">
           <div className="flex flex-col items-center text-primary-600">
              <i className="fas fa-home text-lg mb-1"></i>
              <span>Home</span>
           </div>
           <div className="flex flex-col items-center">
              <i className="fas fa-suitcase text-lg mb-1"></i>
              <span>Trips</span>
           </div>
           <div className="flex flex-col items-center">
              <i className="fas fa-user text-lg mb-1"></i>
              <span>Account</span>
           </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
