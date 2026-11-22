import { VaultsStrip } from '@/components/landing/VaultsStrip';
import { getAnalytics, getApyPct } from '@/lib/analytics';
import { poppins } from '@/lib/fonts';
import { cn } from '@/lib/utils/cn';

const FALLBACK = { A: 11, B: 13, C: 16 } as const;

export async function VaultsSection() {
  const data = await getAnalytics();
  const returns = (['A', 'B', 'C'] as const).map((mode) => getApyPct(data, mode) ?? FALLBACK[mode]);

  return (
    <section className={cn(poppins.className, 'flex justify-center py-28 text-white')}>
      <div className="w-full max-w-7xl px-6 sm:px-8" data-reveal="scale">
        <h2 className="text-4xl font-medium leading-none tracking-[-0.03em] sm:text-[48px]">
          Multiple vaults,
          <br className="md:hidden" /> one wallet
        </h2>
        <p className="mt-4 text-base font-medium leading-snug tracking-[-0.02em] sm:text-lg">
          Run different strategies side by side. Each vault is isolated, with its own risk profile
          and on-chain policies.
        </p>
        <div className="mt-10">
          <VaultsStrip returns={returns} />
        </div>
      </div>
    </section>
  );
}
