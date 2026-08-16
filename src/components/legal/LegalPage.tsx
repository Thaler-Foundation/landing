import Link from 'next/link';
import { Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import { LocaleProvider } from '@/lib/i18n/context';

export type LegalSection = { heading: string; body: string[] };

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <LocaleProvider>
      <div className="bg-background text-foreground min-h-screen overflow-x-hidden font-[family-name:var(--font-geist)]">
        <ScrollReveal />
        <Suspense>
          <Header />
        </Suspense>

        <main className="flex w-full justify-center px-6 pt-36 pb-24 sm:px-8 lg:pt-44">
          <div className="w-full max-w-3xl">
            <header className="border-foreground/10 border-b pb-10" data-reveal="fade">
              <Link
                href="/"
                className="text-foreground/55 hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Back to home
              </Link>
              <h1 className="text-altitude-black dark:text-white mt-6 text-4xl font-bold leading-[0.98] tracking-[-0.03em] sm:text-6xl">
                {title}
              </h1>
              <p className="text-foreground/40 mt-4 text-sm">Last updated {updated}</p>
              <p className="text-foreground/60 mt-6 max-w-2xl text-base leading-relaxed">{intro}</p>
            </header>

            <div className="mt-12 space-y-10">
              {sections.map((section) => (
                <section key={section.heading} data-reveal="fade">
                  <h2 className="text-altitude-black dark:text-white text-xl font-semibold tracking-tight sm:text-2xl">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {section.body.map((paragraph, i) => (
                      <p key={i} className="text-foreground/60 text-[15px] leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </LocaleProvider>
  );
}
