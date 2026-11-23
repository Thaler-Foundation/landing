import { LiveStatsStrip } from '@/components/landing/LiveStatsStrip';
import { getAnalytics, getLiveStats } from '@/lib/analytics';
import { poppins } from '@/lib/fonts';
import { cn } from '@/lib/utils/cn';

export async function LiveStatsSection() {
  const { tvlSol, tvlUsd, yieldSol, yieldUsd } = getLiveStats(await getAnalytics());
  if (tvlSol === null || tvlUsd === null || yieldSol === null || yieldUsd === null) return null;
  const stats = [
    { label: 'TVL', sol: tvlSol, usd: tvlUsd },
    { label: 'Yield', sol: yieldSol, usd: yieldUsd },
  ];

  return (
    <section className={cn(poppins.className, 'flex justify-center py-28 text-white')}>
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
