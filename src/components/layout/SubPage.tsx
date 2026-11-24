import { Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import { poppins } from '@/lib/fonts';
import { LocaleProvider } from '@/lib/i18n/context';
import { cn } from '@/lib/utils/cn';

import type { ReactNode } from 'react';

export function SubPage({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <LocaleProvider>
      <div className="bg-background text-foreground min-h-screen overflow-x-hidden font-[family-name:var(--font-geist)]">
        <ScrollReveal />
        <Suspense>
          <Header />
        </Suspense>

        <main className={cn(poppins.className, 'pt-36 pb-28 text-white lg:pt-44')}>
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            {title && (
              <div className="pb-10 lg:pb-12" data-reveal="left">
                <h1 className="text-5xl font-semibold leading-none tracking-[-0.03em] sm:text-[64px]">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-4 text-base font-medium leading-snug tracking-[-0.02em] text-white/70 sm:text-lg">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </LocaleProvider>
  );
}
