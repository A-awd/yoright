import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '@/app/globals.css';
import { locales } from '@/i18n';

export const metadata: Metadata = {
  title: 'YoRight - احجز رحلتك القادمة',
  description: 'اكتشف أفضل الفنادق بأسعار منافسة',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
            <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    YoRight
                  </h1>
                  <div className="flex items-center gap-4">
                    <a href={`/${locale}`} className="text-sm hover:text-purple-600">
                      {locale === 'ar' ? 'الرئيسية' : 'Home'}
                    </a>
                    <a href={`/${locale}/my-trips`} className="text-sm hover:text-purple-600">
                      {locale === 'ar' ? 'رحلاتي' : 'My Trips'}
                    </a>
                  </div>
                </div>
              </div>
            </nav>
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
