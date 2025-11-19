'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, User, Menu } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  locale: string;
}

export default function Navigation({ locale }: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.replace(newPath);
  };

  return (
    <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={`/${locale}`} className="cursor-pointer hover:opacity-80 transition">
            <Image 
              src="/images/logo.png" 
              alt="YoRight" 
              width={300} 
              height={300} 
              className="h-10 w-auto"
              priority
            />
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href={`/${locale}`} 
              className="text-sm font-medium hover:text-brand-primary-light transition"
            >
              {locale === 'ar' ? 'الرئيسية' : 'Home'}
            </Link>
            <Link 
              href={`/${locale}/search/hotels`} 
              className="text-sm font-medium hover:text-brand-primary-light transition"
            >
              {locale === 'ar' ? 'الفنادق' : 'Hotels'}
            </Link>
            <Link 
              href={`/${locale}/my-trips`} 
              className="text-sm font-medium hover:text-brand-primary-light transition"
            >
              {locale === 'ar' ? 'رحلاتي' : 'My Trips'}
            </Link>
            
            <button
              onClick={toggleLocale}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{locale === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            <Link href={`/${locale}/auth/signin`}>
              <button className="flex items-center gap-2 px-4 py-2 bg-brand-secondary text-white rounded-lg hover:bg-brand-accent hover:shadow-lg transition">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4 space-y-3">
            <Link 
              href={`/${locale}`} 
              className="block text-sm font-medium hover:text-brand-primary-light transition"
            >
              {locale === 'ar' ? 'الرئيسية' : 'Home'}
            </Link>
            <Link 
              href={`/${locale}/search/hotels`} 
              className="block text-sm font-medium hover:text-brand-primary-light transition"
            >
              {locale === 'ar' ? 'الفنادق' : 'Hotels'}
            </Link>
            <Link 
              href={`/${locale}/my-trips`} 
              className="block text-sm font-medium hover:text-brand-primary-light transition"
            >
              {locale === 'ar' ? 'رحلاتي' : 'My Trips'}
            </Link>
            <button
              onClick={toggleLocale}
              className="flex items-center gap-2 w-full text-left text-sm font-medium hover:text-brand-primary-light transition"
            >
              <Globe className="w-4 h-4" />
              {locale === 'ar' ? 'English' : 'العربية'}
            </button>
            <Link href={`/${locale}/auth/signin`} className="block">
              <button className="w-full px-4 py-2 bg-brand-secondary text-white rounded-lg hover:bg-brand-accent hover:shadow-lg transition text-sm font-medium">
                {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
