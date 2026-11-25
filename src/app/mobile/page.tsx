import { SubPage } from '@/components/layout/SubPage';
import { SeedVaultBanner } from '@/components/mobile/SeedVaultBanner';
import { getSEOTags } from '@/lib/seo';

import type { Metadata } from 'next';

export const metadata: Metadata = getSEOTags({
  title: 'Mobile App',
  description: 'Your personal yield vault, on the go. Built for Solana Mobile.',
  canonicalUrlRelative: '/mobile',
});

export default function MobilePage() {
  return (
    <SubPage>
      <div className="pb-12 lg:pb-16">
        <section data-reveal="left">
          <h1 className="text-[52px] font-medium leading-[0.85] tracking-[-0.06em] sm:text-[clamp(52px,10.5vw,128px)]">
            Thaler,
            <br />
            in your pocket
          </h1>
          <p className="mt-10 text-lg font-medium leading-none tracking-[-0.03em] sm:text-2xl">
            Deposit SOL or USDC into a vault only you control. Earn from market volatility.
          </p>
        </section>

        <div className="mt-14 lg:mt-16" data-reveal="fade">
          <SeedVaultBanner />
        </div>
      </div>
    </SubPage>
  );
}
