'use client';

import { cn } from '@/lib/utils/cn';

type Tone = 'dark' | 'muted' | 'outline';

interface Card {
  key: string;
  tone: Tone;
  visual: React.ReactNode;
  caption: string;
}

const cards: Card[] = [
  {
    key: 'yield',
    tone: 'dark',
    visual: <YieldVisual />,
    caption:
      'Your idle capital earns across every market condition, from 8.2% and up to 20% APY.',
  },
  {
    key: 'strategy',
    tone: 'muted',
    visual: <StrategyVisual />,
    caption:
      'Staking, lending, and perpetual markets combine into one automated strategy that runs continuously.',
  },
  {
    key: 'controls',
    tone: 'outline',
    visual: <ControlsVisual />,
    caption:
      'Choose your risk profile at vault creation, then claim your yield manually or on a schedule.',
  },
];

export function StrategyShowcase() {
  return (
    <section
      id="strategy"
      className="bg-background flex w-full justify-center px-6 py-20 sm:px-8 lg:py-28"
    >
      <div className="w-full max-w-7xl">
        <div className="mb-12 max-w-2xl" data-reveal="fade">
          <h2 className="text-altitude-black dark:text-white text-[34px] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-[48px] lg:text-[56px]">
            Yield you control, generated on-chain
          </h2>
          <p className="text-foreground/55 mt-5 text-base leading-relaxed sm:text-lg">
            Select your risk profile once, and the strategy across staking, lending, and
            perpetual markets will work for you, with full transparency and self-custody.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <article
              key={card.key}
              data-reveal="scale"
              data-reveal-delay={i + 1}
              className="flex min-w-0 flex-col gap-5"
            >
              <div
                className={cn(
                  'relative aspect-square w-full select-none overflow-hidden rounded-[24px]',
                  card.tone === 'dark' && 'bg-foreground',
                  card.tone === 'muted' && 'bg-foreground/[0.05]',
                  card.tone === 'outline' && 'bg-card border-foreground/10 border'
                )}
              >
                {card.visual}
              </div>
              <p className="text-foreground/70 max-w-sm text-[17px] leading-[1.35]">
                {card.caption}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function YieldVisual() {
  return (
    <div className="absolute inset-0">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 400"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <path
          d="M-20 300 C 120 200, 180 120, 420 40"
          stroke="currentColor"
          className="text-background/10"
          strokeWidth="64"
          strokeLinecap="round"
        />
        <path
          d="M-20 360 C 120 300, 200 220, 420 140"
          stroke="currentColor"
          className="text-background/[0.06]"
          strokeWidth="40"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute left-1/2 top-1/2 w-[86%] -translate-x-1/2 -translate-y-1/2">
        <div className="bg-card text-card-foreground rounded-2xl p-4 shadow-[0_24px_50px_-18px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <span className="bg-foreground text-background grid h-9 w-9 shrink-0 place-items-center rounded-xl">
              <svg
                viewBox="0 0 1024 1024"
                className="h-5 w-5"
                fill="currentColor"
                fillRule="evenodd"
              >
                <path d="M 513.5 131.5 A 378 378 0 1 1 513.5 887.5 A 378 378 0 1 1 513.5 131.5 M 513.5 173.5 A 336 336 0 1 0 513.5 845.5 A 336 336 0 1 0 513.5 173.5 Z" />
                <path d="M 513 244 L 274 666 L 749 666 Z M 509 361 L 643 614 L 373 615 Z" />
              </svg>
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold">SOL Vault</span>
                <span className="bg-foreground/[0.08] rounded px-1.5 py-0.5 text-[11px] font-medium tabular-nums">
                  12.1% APY
                </span>
              </div>
              <div className="text-foreground/50 text-xs">+12.54 SOL earned</div>
            </div>
            <div className="ml-auto text-sm font-semibold tabular-nums">1,254.31 SOL</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const COMPONENTS = [
  { label: 'Liquid Staking', meta: 'Jito, Marinade' },
  { label: 'Lending Market', meta: 'Kamino, Jupiter' },
  { label: 'Perpetual Market', meta: 'Pacifica, Phoenix, Hyperliquid' },
  { label: 'Liquidity Provision', meta: 'Raydium, Orca, Meteora' },
];
function StrategyVisual() {
  return (
    <div className="absolute inset-0 grid place-items-center p-6">
      <div className="bg-card text-card-foreground border-foreground/[0.06] w-full max-w-[280px] rounded-2xl border p-4 shadow-[0_20px_44px_-20px_rgba(0,0,0,0.35)]">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold">Strategy</span>
          <span className="text-foreground/45 text-xs">Components</span>
        </div>
        <ul className="space-y-2">
          {COMPONENTS.map((c) => (
            <li
              key={c.label}
              className="bg-foreground/[0.04] flex items-center justify-between rounded-lg px-3 py-2 text-xs"
            >
              <span className="font-medium">{c.label}</span>
              <span className="text-foreground/45">{c.meta}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const MODES = ['Conservative', 'Balanced', 'Aggressive'];
function ControlsVisual() {
  return (
    <div className="absolute inset-0 grid place-items-center p-6">
      <div className="w-full max-w-[280px] space-y-3">
        <div className="bg-background/60 border-foreground/[0.06] rounded-2xl border p-4 shadow-[0_16px_40px_-22px_rgba(0,0,0,0.3)]">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="text-foreground/50">Risk mode</span>
            <span className="font-medium">Balanced</span>
          </div>
          <ul className="space-y-2">
            {MODES.map((m) => {
              const selected = m === 'Balanced';
              return (
                <li key={m} className="flex items-center justify-between text-xs">
                  <span className={selected ? 'font-medium' : 'text-foreground/55'}>{m}</span>
                  <span
                    className={cn(
                      'grid h-4 w-4 place-items-center rounded-full border',
                      selected ? 'border-foreground' : 'border-foreground/25'
                    )}
                  >
                    {selected && <span className="bg-foreground h-2 w-2 rounded-full" />}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bg-background/60 border-foreground/[0.06] rounded-2xl border p-4 shadow-[0_16px_40px_-22px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground/50">Claimable yield</span>
            <span className="text-foreground/45">Claim</span>
          </div>
          <div className="mt-1.5 text-lg font-semibold tabular-nums">254.31 SOL</div>
          <div className="bg-foreground/[0.08] mt-3 h-1.5 w-full overflow-hidden rounded-full">
            <div className="bg-foreground h-full rounded-full" style={{ width: '72%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
