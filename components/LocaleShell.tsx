'use client';

import { NextIntlClientProvider } from 'next-intl';
import Navigation from '@/components/Navigation';

interface LocaleShellProps {
  locale: string;
  messages: any;
  children: React.ReactNode;
}

export default function LocaleShell({ locale, messages, children }: LocaleShellProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen">
        <Navigation locale={locale} />
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
