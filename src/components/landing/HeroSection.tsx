'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/lib/i18n/context';
import { HeroWaitlistForm } from '@/components/landing/HeroWaitlistForm';
import LineWaves from '@/components/LineWaves';

const FALLBACK_APY = 12.4;
const FALLBACK_TVL = 4_200_000;

type LiveStats = { tvlUsd: number; apy: number };

function formatTvl(usd: number): string {
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}k`;
  return `$${Math.round(usd)}`;
}

function toThirtyDayApy(annualApyPercent: number): number {
  return (Math.pow(1 + annualApyPercent / 100, 30 / 365) - 1) * 100;
}

function useLiveStats(): LiveStats | null {
  const [stats, setStats] = useState<LiveStats | null>(null);
  useEffect(() => {
    let alive = true;
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d: { ok?: boolean; tvlUsd?: number; apy?: number }) => {
        if (!alive) return;
        setStats(
          d?.ok
            ? { tvlUsd: d.tvlUsd ?? 0, apy: d.apy ?? 0 }
            : { tvlUsd: FALLBACK_TVL, apy: FALLBACK_APY }
        );
      })
      .catch(() => {
        if (alive) setStats({ tvlUsd: FALLBACK_TVL, apy: FALLBACK_APY });
      });
    return () => {
      alive = false;
    };
  }, []);
  return stats;
}

function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return value;
}

export function HeroSection() {
  const { t } = useTranslations('hero');
  const stats = useLiveStats();
  const apy = useCountUp(stats ? toThirtyDayApy(stats.apy) : 0);
  const tvl = useCountUp(stats?.tvlUsd ?? 0);

  return (
    <section
      id="hero"
      className="bg-background text-foreground relative flex min-h-screen w-full justify-center overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 z-0 w-full"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 25%, black 50%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 25%, black 50%)',
        }}
      >
        <LineWaves
          speed={0.12}
          innerLineCount={32}
          outerLineCount={36}
          warpIntensity={1}
          rotation={-45}
          edgeFadeWidth={0}
          colorCycleSpeed={1}
          brightness={0.12}
          color1="#ffffff"
          color2="#ffffff"
          color3="#ffffff"
          enableMouseInteraction
          mouseInfluence={2}
        />
      </div>
      <div
        aria-hidden
        className="from-background pointer-events-none absolute inset-y-0 left-0 z-[1] w-2/3 bg-gradient-to-r to-transparent"
      />
      <div
        aria-hidden
        className="from-background pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-48 bg-gradient-to-t to-transparent"
      />

      <div className="pointer-events-none relative z-10 flex w-full max-w-7xl flex-col justify-center px-6 pt-36 pb-20 sm:px-8 lg:pt-44 lg:pb-28">
        <div className="flex max-w-3xl flex-col gap-10 lg:max-w-4xl lg:pr-12">
          <div className="flex flex-col gap-6" data-hero-reveal="left">
            <h1 className="text-[52px] font-bold leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-[64px]">
              {t('title1')}
              <br />
              {t('title2')}
            </h1>
            <p className="text-foreground/55 max-w-lg text-base leading-relaxed whitespace-pre-line sm:text-lg">
              {t('subtitle')}
            </p>
          </div>

          <div className="flex flex-col gap-7" data-hero-reveal="left" data-hero-reveal-delay="1">
            <div className="pointer-events-auto flex max-w-md flex-col gap-3">
              <span className="text-foreground/45 text-xs font-medium tracking-wide uppercase">
                Get early access
              </span>
              <HeroWaitlistForm />
              <p className="text-foreground/45 text-xs">
                Already approved?{' '}
                <Link
                  href="/auth/sign-in"
                  className="text-foreground/70 hover:text-foreground underline underline-offset-2 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
            {/* TVL + 30d APY hidden for now (kept for later). Wrapped in {false && ...}
                so `apy`/`tvl` stay referenced and the stats hooks keep compiling.
                To re-enable: remove the `{false && (` wrapper and its closing `)}`. */}
            {false && (
              <div className="flex gap-12">
                <Stat value={formatTvl(tvl)} label="TVL" />
                <Stat value={`${apy.toFixed(1)}%`} label="30d APY" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-4xl font-semibold tracking-[-0.04em] tabular-nums sm:text-5xl">
        {value}
      </span>
      <div className="text-foreground/55 mt-1.5 text-xs leading-tight font-medium">{label}</div>
    </div>
  );
}
