import { YieldSourcesStrip } from '@/components/landing/YieldSourcesStrip';
import { poppins } from '@/lib/fonts';
import { cn } from '@/lib/utils/cn';

export function YieldSourcesSection() {
  return (
    <section
      id="strategy"
      className={cn(poppins.className, 'flex justify-center py-28 text-white')}
    >
      <div className="w-full max-w-7xl px-6 sm:px-8" data-reveal="scale">
        <h2 className="text-4xl font-medium leading-[1.07] tracking-[-0.05em] lg:text-[48px]">
          Yield you control, generated on-chain
        </h2>
        <p className="mt-2 text-lg font-medium leading-none tracking-[-0.03em] sm:text-2xl">
          Staking, lending, and perpetual markets combine into one automated strategy
          <br className="hidden lg:block" /> that runs continuously.
        </p>
        <div className="mt-10">
          <YieldSourcesStrip />
        </div>
      </div>
    </section>
  );
}
