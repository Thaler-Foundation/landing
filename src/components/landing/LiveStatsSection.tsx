import { LiveStatsStrip } from '@/components/landing/LiveStatsStrip';
import { getAnalytics, getLiveStats } from '@/lib/analytics';
import { poppins } from '@/lib/fonts';
import { cn } from '@/lib/utils/cn';

const FALLBACK = { tvlSol: 1000, tvlUsd: 200000, yieldSol: 50, yieldUsd: 10000 };

export async function LiveStatsSection() {
  const live = getLiveStats(await getAnalytics());
  const { tvlSol, tvlUsd, yieldSol, yieldUsd } = Object.values(live).every((v) => v !== null)
    ? (live as typeof FALLBACK)
    : FALLBACK;
  const stats = [
    { label: 'TVL', sol: tvlSol, usd: tvlUsd },
    { label: 'Yield', sol: yieldSol, usd: yieldUsd },
  ];

  return (
    <section className={cn(poppins.className, 'flex justify-center py-12 text-white md:py-28')}>
      <div className="w-full max-w-7xl px-6 sm:px-8" data-reveal="scale">
        <h2 className="text-4xl font-medium leading-none tracking-[-0.03em] sm:text-[48px]">
          Live Stats
        </h2>
        <div className="mt-10">
          <LiveStatsStrip stats={stats} />
        </div>
      </div>
    </section>
  );
}
