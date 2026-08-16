'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { SectionBackdrop } from '@/components/landing/SectionBackdrop';

export function SplitFeature() {
  return (
    <section className="bg-background flex w-full justify-center px-6 py-28 sm:px-8">
      <div className="grid w-full max-w-7xl gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="flex items-center lg:col-span-4" data-reveal="left">
          <h2 className="text-altitude-black dark:text-white text-[36px] font-semibold leading-[0.98] tracking-[-0.02em] whitespace-nowrap sm:text-[46px]">
            Multiple vaults,
            <br />
            one wallet
          </h2>
        </div>

        <div className="lg:col-span-5 lg:col-start-5" data-reveal="scale" data-reveal-delay="1">
          <div className="relative aspect-[400/440] w-full overflow-hidden rounded-[24px] border border-foreground/10">
            <SectionBackdrop variant="mirror" />
            <StackedVaults />
          </div>
        </div>

        <div
          className="flex flex-col items-start justify-center gap-7 lg:col-span-3 lg:col-start-10"
          data-reveal="right"
          data-reveal-delay="2"
        >
          <p className="text-foreground/60 max-w-xs text-xl leading-[1.15] sm:text-2xl">
            Run different strategies side by side. Each vault is isolated, with its own risk profile
            and on-chain policies.
          </p>
          <Link
            href="#hero"
            className="bg-foreground text-background inline-flex items-center justify-center rounded-full px-5 py-3 text-base font-medium transition duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0"
          >
            Get early access
          </Link>
        </div>
      </div>
    </section>
  );
}

const VAULTS = [
  { mode: 'Conservative', apy: '8.4%' },
  { mode: 'Balanced', apy: '12.1%' },
  { mode: 'Aggressive', apy: '19.6%' },
];

const CYCLE_MS = 4000;
const EASE = [0.22, 1, 0.36, 1] as const;

function StackedVaults() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const progressRef = useRef(0);
  const indexRef = useRef(0);

  useEffect(() => {
    if (reduce || paused) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      let p = progressRef.current + dt / CYCLE_MS;
      if (p >= 1) {
        p = 0;
        indexRef.current = (indexRef.current + 1) % VAULTS.length;
        setIndex(indexRef.current);
      }
      progressRef.current = p;
      setProgress(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, paused]);

  const vault = VAULTS[index];

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 flex items-center justify-center pb-14">
        <div className="relative h-[230px] w-[260px]">
          <Silhouette className="bg-card/40 -translate-y-7 h-[116px] w-[224px]" />
          <Silhouette className="bg-card/70 -translate-y-3.5 h-[118px] w-[238px]" />

          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={vault.mode}
                initial={reduce ? false : { opacity: 0, scale: 0.86, y: -26, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={
                  reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 40, filter: 'blur(3px)' }
                }
                transition={{ duration: 0.5, ease: EASE }}
                className="bg-card text-card-foreground border-foreground/[0.06] relative z-10 w-[252px] rounded-[18px] border p-5"
                style={{ boxShadow: '0 20px 44px -20px rgba(0,0,0,0.35)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-foreground/50 text-xs font-medium">
                    Vault · {vault.mode}
                  </span>
                  <span className="bg-foreground/30 h-1.5 w-1.5 rounded-full" />
                </div>
                <div className="mt-2 flex items-end justify-between">
                  <span className="text-[28px] font-semibold leading-none tracking-tight tabular-nums">
                    {vault.apy}
                  </span>
                  <span className="text-foreground/40 text-xs">APY</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 p-5">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play animation' : 'Pause animation'}
          aria-pressed={paused}
          className="bg-foreground/10 text-foreground hover:bg-foreground/20 grid h-9 w-9 shrink-0 place-items-center rounded-full transition duration-150 ease-out"
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>
        <div className="grid flex-1 grid-cols-3 gap-2">
          {VAULTS.map((v, i) => (
            <Segment
              key={v.mode}
              value={i < index ? 1 : i === index ? (reduce ? 1 : progress) : 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Segment({ value }: { value: number }) {
  return (
    <div className="bg-foreground/15 h-1.5 overflow-hidden rounded-full">
      <div
        className="bg-foreground h-full origin-left rounded-full"
        style={{ transform: `scaleX(${Math.min(Math.max(value, 0), 1)})` }}
      />
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

function Silhouette({ className }: { className: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden
    >
      <div className={`border-foreground/10 rounded-[18px] border ${className}`} />
    </div>
  );
}
