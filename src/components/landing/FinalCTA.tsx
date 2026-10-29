import Image from 'next/image';
import { poppins } from '@/lib/fonts';
import { cn } from '@/lib/utils/cn';
import { AccessDrawerTrigger } from '@/components/access/AccessDrawer';

export function FinalCTA() {
  return (
    <section
      className={cn(
        poppins.className,
        'mx-auto w-full max-w-7xl px-6 pt-16 pb-28 sm:px-8 lg:pt-24 lg:pb-36'
      )}
    >
      <div
        data-reveal="lift"
        className="cta-early-access relative isolate flex aspect-[4/5] flex-col justify-between overflow-hidden bg-background p-6 md:aspect-auto md:flex-row md:items-center md:p-[3%]"
      >
        <div className="absolute inset-x-0 bottom-0 -z-10 aspect-[8/5] overflow-hidden mix-blend-lighten md:top-0 md:left-[26.5%] md:aspect-auto">
          <Image
            src="/final-cta-bg.webp"
            alt=""
            width={1760}
            height={1760}
            sizes="(min-width: 768px) 175vw, 295vw"
            className="absolute top-0 left-0 h-auto w-[293.3%] max-w-none -translate-x-[25%] -translate-y-[23.86%] md:w-[234%] md:-translate-x-[19.43%] md:-translate-y-[27.27%]"
          />
        </div>

        <h2 className="text-[40px] leading-[0.8] font-medium tracking-[-0.05em] text-white sm:text-[52px] md:text-[44px] lg:text-[64px]">
          The verified
          <br />
          infrastructure
          <br />
          that your
          <br />
          capital
          <br />
          deserves
        </h2>

        <AccessDrawerTrigger className="cursor-pointer self-start text-white after:absolute after:inset-0">
          <span className="flex items-center gap-[0.55em] whitespace-nowrap text-xl leading-none font-semibold tracking-[-0.05em] sm:text-[28px] md:absolute md:top-1/2 md:right-[6.5%] md:-translate-y-1/2 md:text-xl lg:text-[28px]">
            <span aria-hidden className="cta-early-access-arrow h-[1.1em] w-[1.1em] bg-current" />
            <span className="cta-early-access-label">Join Early Access</span>
          </span>
        </AccessDrawerTrigger>
      </div>
    </section>
  );
}
