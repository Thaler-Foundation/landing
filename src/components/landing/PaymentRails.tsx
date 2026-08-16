'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { useTranslations } from '@/lib/i18n/context';
import { SectionBackdrop } from '@/components/landing/SectionBackdrop';

type RailKey = 'accounts' | 'payments' | 'stablecoin';

const ROTATE_MS = 4000;
const RAIL_ORDER: RailKey[] = ['accounts', 'payments', 'stablecoin'];

interface Rail {
  key: RailKey;
  label: string;
  description: string;
}

export function PaymentRails() {
  const { t } = useTranslations('paymentRails');
  const reduce = useReducedMotion();
  const [active, setActive] = useState<RailKey>('accounts');
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [solPriceUsd, setSolPriceUsd] = useState<number | null>(null);
  const progressRef = useRef(0);
  const activeRef = useRef<RailKey>('accounts');

  // Live SOL price for the Yield Settlement card's USD value (reuses the public
  // /api/stats proxy the hero already consumes). Fetched once; null until ready.
  useEffect(() => {
    let alive = true;
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d: { solPriceUsd?: number }) => {
        if (alive && typeof d?.solPriceUsd === 'number' && d.solPriceUsd > 0) {
          setSolPriceUsd(d.solPriceUsd);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const rails: Rail[] = [
    {
      key: 'accounts',
      label: t('rails.accounts.label'),
      description: t('rails.accounts.description'),
    },
    {
      key: 'payments',
      label: t('rails.payments.label'),
      description: t('rails.payments.description'),
    },
    {
      key: 'stablecoin',
      label: t('rails.stablecoin.label'),
      description: t('rails.stablecoin.description'),
    },
  ];

  useEffect(() => {
    if (paused || reduce) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      let p = progressRef.current + dt / ROTATE_MS;
      if (p >= 1) {
        p = 0;
        const nextIdx = (RAIL_ORDER.indexOf(activeRef.current) + 1) % RAIL_ORDER.length;
        activeRef.current = RAIL_ORDER[nextIdx];
        setActive(activeRef.current);
      }
      progressRef.current = p;
      setProgress(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, reduce]);

  return (
    <section
      id="how-it-works"
      className="bg-background px-6 sm:px-8 py-20 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-24"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div data-reveal="fade" className="grid lg:grid-cols-2 gap-8 mb-12 lg:mb-14">
          <h2 className="dark:text-white text-altitude-black text-4xl sm:text-5xl font-semibold leading-[1.02] tracking-[-0.02em]">
            {t('header.title')}
          </h2>
          <p className="text-zinc-500 text-base leading-relaxed lg:pt-2">{t('header.subtitle')}</p>
        </div>

        <div
          data-reveal="fade"
          data-reveal-delay="1"
          className="grid lg:grid-cols-2 gap-6 items-stretch overflow-hidden"
        >
          <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-foreground/10 p-6 lg:h-[500px] lg:p-8">
            <div className="mb-10 flex items-start justify-between gap-4">
              <h3 className="dark:text-white text-altitude-black text-2xl sm:text-3xl font-semibold">
                {t('section.title')}
              </h3>
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'Play' : 'Pause'}
                aria-pressed={paused}
                className="bg-foreground/[0.06] text-foreground hover:bg-foreground/10 mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full transition duration-150 ease-out"
              >
                {paused ? <PlayIcon /> : <PauseIcon />}
              </button>
            </div>

            <ul className="flex flex-1 flex-col justify-start gap-8">
              {rails.map((r) => {
                const isActive = r.key === active;
                return (
                  <li key={r.key} className="relative pl-6 py-1">
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-zinc-200 dark:bg-zinc-800"
                    />
                    {isActive && (
                      <span
                        aria-hidden
                        style={{
                          transform: `scaleY(${reduce ? 1 : progress})`,
                          transformOrigin: 'top',
                        }}
                        className="bg-foreground absolute left-0 top-0 bottom-0 w-1 origin-top rounded-full"
                      />
                    )}
                    <div
                      className={cn(
                        'text-base sm:text-lg font-medium transition-colors',
                        isActive ? 'dark:text-white text-altitude-black' : 'text-zinc-500'
                      )}
                    >
                      {r.label}
                    </div>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm text-zinc-500 mt-2 overflow-hidden"
                        >
                          {r.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative rounded-[24px] overflow-hidden aspect-[5/4] lg:aspect-auto lg:h-[500px] min-w-0">
            <SectionBackdrop variant="invert" />

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="absolute inset-0 flex items-center justify-center p-6"
              >
                {active === 'accounts' && <AccountsCard t={t} />}
                {active === 'payments' && <PaymentsCard t={t} />}
                {active === 'stablecoin' && <StablecoinCard t={t} solPriceUsd={solPriceUsd} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

type T = (key: string) => string;

function AccountsCard({ t }: { t: T }) {
  const rows = [
    { label: t('cards.accounts.row1Label'), value: t('cards.accounts.row1Value') },
    { label: t('cards.accounts.row2Label'), value: t('cards.accounts.row2Value') },
    { label: t('cards.accounts.row3Label'), value: t('cards.accounts.row3Value') },
  ];
  return (
    <div className="w-full max-w-xs sm:max-w-sm bg-card text-card-foreground border border-foreground/[0.06] rounded-2xl shadow-[0_20px_44px_-20px_rgba(0,0,0,0.35)] p-6">
      <img src="/logo.svg" alt="Thaler" className="w-10 h-10 mb-6 dark:invert" />
      <ul className="space-y-4 mb-6">
        {rows.map((r, i) => (
          <li
            key={i}
            className="flex items-center justify-between text-sm border-b border-foreground/[0.06] pb-3 last:border-0"
          >
            <span className="text-foreground/50">{r.label}</span>
            <span className="font-medium tabular-nums">{r.value}</span>
          </li>
        ))}
      </ul>
      <button className="w-full bg-foreground text-background rounded-lg py-2.5 text-sm font-medium">
        {t('cards.accounts.cta')}
      </button>
    </div>
  );
}

function PaymentsCard({ t }: { t: T }) {
  const rails = [
    { label: t('cards.payments.ach'), meta: t('cards.payments.achMeta') },
    { label: t('cards.payments.sepa'), meta: t('cards.payments.sepaMeta') },
    { label: t('cards.payments.swift'), meta: t('cards.payments.swiftMeta') },
    { label: t('cards.payments.stablecoin'), meta: t('cards.payments.stablecoinMeta') },
  ];
  return (
    <div className="w-full max-w-xs sm:max-w-sm bg-card text-card-foreground border border-foreground/[0.06] rounded-2xl shadow-[0_20px_44px_-20px_rgba(0,0,0,0.35)] p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-semibold">{t('cards.payments.title')}</span>
        <span className="text-xs text-foreground/45">{t('cards.payments.badge')}</span>
      </div>
      <ul className="space-y-2">
        {rails.map((r, i) => (
          <li
            key={i}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-foreground/[0.04] text-sm"
          >
            <span className="font-medium">{r.label}</span>
            <span className="text-xs text-foreground/45">{r.meta}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StablecoinCard({ t, solPriceUsd }: { t: T; solPriceUsd: number | null }) {
  // The claim amount is denominated in SOL ("254.31 SOL"); show its live USD
  // value beneath it. Empty until the price loads, so nothing stale is shown.
  const amountSol = Number.parseFloat(t('cards.stablecoin.amount'));
  const usdValue =
    solPriceUsd && Number.isFinite(amountSol)
      ? `≈ $${(amountSol * solPriceUsd).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} USD`
      : '';
  return (
    <div className="w-full max-w-xs sm:max-w-sm bg-card text-card-foreground border border-foreground/[0.06] rounded-2xl shadow-[0_20px_44px_-20px_rgba(0,0,0,0.35)] p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs text-foreground/50 mb-1">{t('cards.stablecoin.label')}</div>
          <div className="text-2xl font-semibold tabular-nums">{t('cards.stablecoin.amount')}</div>
        </div>
        <span className="text-xs bg-foreground/[0.08] text-foreground px-2 py-1 rounded-md">
          {t('cards.stablecoin.status')}
        </span>
      </div>
      <div className="text-xs text-foreground/50 mb-4 tabular-nums">{usdValue}</div>
      <div className="pt-4 border-t border-foreground/[0.06] space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground/50">{t('cards.stablecoin.fromLabel')}</span>
          <span>{t('cards.stablecoin.fromValue')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/50">{t('cards.stablecoin.toLabel')}</span>
          <span>{t('cards.stablecoin.toValue')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/50">{t('cards.stablecoin.bankLabel')}</span>
          <span>{t('cards.stablecoin.bankValue')}</span>
        </div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="ml-0.5"
    >
      <path d="M7 4.5v15l13-7.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="5.5" y="4" width="4.5" height="16" rx="1.4" />
      <rect x="14" y="4" width="4.5" height="16" rx="1.4" />
    </svg>
  );
}
