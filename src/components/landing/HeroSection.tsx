import { HeroCta } from '@/components/landing/HeroCta';
import { poppins } from '@/lib/fonts';
import { cn } from '@/lib/utils/cn';

export function HeroSection() {
  return (
    <section
      id="hero"
      className={cn(poppins.className, 'flex min-h-screen items-center justify-center text-white')}
    >
      <div className="w-full max-w-7xl px-6 pt-24 sm:px-8">
        <div data-hero-reveal="left">
          <h1 className="text-[clamp(44px,10.5vw,128px)] font-medium leading-[0.85] tracking-[-0.06em]">
            Earn Yield From
            <br />
            Market Movement
          </h1>
          <p className="mt-10 text-lg font-medium leading-none tracking-[-0.03em] sm:text-2xl">
            Earn consistent yield, regardless of market direction
          </p>
        </div>

        <div data-hero-reveal="left" data-hero-reveal-delay="1" className="relative mt-10 h-20">
          <HeroCta />
        </div>
      </div>
    </section>
  );
}
