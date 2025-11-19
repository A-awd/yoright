import type { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '@/app/globals.css';
import { locales } from '@/i18n';
import LocaleShell from '@/components/LocaleShell';

export const metadata: Metadata = {
  title: 'YoRight - احجز رحلتك القادمة | Book Your Next Trip',
  description: 'اكتشف أفضل الفنادق بأسعار منافسة | Discover the best hotels at competitive prices',
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
      <body className="bg-gray-50">
        <LocaleShell locale={locale} messages={messages}>
          {children}
        </LocaleShell>
      </body>
    </html>
  );
}
