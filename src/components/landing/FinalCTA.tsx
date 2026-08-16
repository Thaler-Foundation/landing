'use client';

import config from '@/config';
import { useTranslations } from '@/lib/i18n/context';
import { HeroWaitlistForm } from '@/components/landing/HeroWaitlistForm';

export function FinalCTA() {
  const { t } = useTranslations('finalCta');
  const title = t('title').replace('{appName}', config.appName);

  return (
    <section
      id="get-started"
      className="bg-background flex w-full justify-center px-6 pt-16 pb-28 sm:px-8 lg:pt-24 lg:pb-36"
    >
      <div className="border-foreground/10 bg-foreground/[0.02] relative w-full max-w-5xl overflow-hidden rounded-[32px] border px-6 py-16 sm:px-12 lg:py-24">
        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <span
            data-reveal="scale"
            className="bg-foreground text-background grid h-16 w-16 place-items-center rounded-2xl"
          >
            <svg
              viewBox="0 0 1024 1024"
              className="h-9 w-9"
              fill="currentColor"
              fillRule="evenodd"
              aria-hidden
            >
              <path d="M 513.5 131.5 A 378 378 0 1 1 513.5 887.5 A 378 378 0 1 1 513.5 131.5 M 513.5 173.5 A 336 336 0 1 0 513.5 845.5 A 336 336 0 1 0 513.5 173.5 Z" />
              <path d="M 513 244 L 274 666 L 749 666 Z M 509 361 L 643 614 L 373 615 Z" />
            </svg>
          </span>

          <h2
            data-reveal="lift"
            data-reveal-delay="1"
            className="text-altitude-black dark:text-white text-[36px] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-[52px]"
          >
            {title}
          </h2>

          <p
            data-reveal="lift"
            data-reveal-delay="2"
            className="text-foreground/55 max-w-md text-base leading-relaxed sm:text-lg"
          >
            {t('subtitle')}
          </p>

          <div data-reveal="lift" data-reveal-delay="3" className="mt-2 flex w-full justify-center">
            <HeroWaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}
