import { HeroSection } from '@/components/landing/HeroSection';
import { VaultsSection } from '@/components/landing/VaultsSection';
import { YieldSourcesSection } from '@/components/landing/YieldSourcesSection';
import { LandingFaq } from '@/components/landing/LandingFaq';
import { LandingBlog } from '@/components/landing/LandingBlog';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import { HashScroll } from '@/components/landing/HashScroll';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LocaleProvider } from '@/lib/i18n/context';
import { renderSchemaTags } from '@/lib/seo';
import { Suspense } from 'react';

export default function LandingPage() {
  return (
    <LocaleProvider>
      {renderSchemaTags({
        name: 'Thaler',
        description:
          'Thaler gives every depositor an isolated, self-custodied vault on Solana, earning automated, verified yield from market volatility, not price direction.',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { price: 0, priceCurrency: 'USD' },
      })}
      <div className="bg-background text-foreground min-h-screen overflow-x-hidden font-[family-name:var(--font-geist)]">
        <ScrollReveal />
        <HashScroll />
        <Suspense>
          <Header />
        </Suspense>
        <HeroSection />
        <VaultsSection />
        <YieldSourcesSection />
        <LandingBlog />
        <LandingFaq />
        <FinalCTA />
        <Footer />
      </div>
    </LocaleProvider>
  );
}
