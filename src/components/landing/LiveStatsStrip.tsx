'use client';

import { useEffect, useRef, useState } from 'react';
import { sampleDither } from '@/lib/dither';
import { cn } from '@/lib/utils/cn';

const CELL = 1;
const DOT = 150;
const EASE = 'duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]';

type Stat = { label: string; sol: number; usd: number };

export function LiveStatsStrip({ stats }: { stats: Stat[] }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const strip = stripRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.src = '/stats-bg.webp';

    const draw = () => {
      if (!img.complete || !strip.clientWidth) return;
      const cols = Math.ceil(strip.clientWidth / CELL);
      const rows = Math.ceil(strip.clientHeight / CELL);
      const dither = sampleDither(ctx, img, cols, rows, 0.1, 0.5, 2);
      const out = ctx.createImageData(cols, rows);
      for (let i = 0; i < cols * rows; i++) {
        const v = dither[i] * DOT;
        out.data[i * 4] = v;
        out.data[i * 4 + 1] = v;
        out.data[i * 4 + 2] = v;
        out.data[i * 4 + 3] = 255;
      }
      ctx.putImageData(out, 0, 0);
    };

    const observer = new ResizeObserver(draw);
    observer.observe(strip);
    img.onload = draw;
    return () => observer.disconnect();
  }, []);

  const toggle = (i: number) => setActive((a) => (a === i ? null : i));

  return (
    <div
      ref={stripRef}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setActive(null)}
      className="@container relative isolate aspect-square bg-background md:aspect-[1070/368]"
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full mix-blend-lighten [image-rendering:pixelated]"
      />
      <div className="absolute inset-0 flex flex-col gap-[4cqw] p-[5cqw] [--bar:3cqw] md:gap-[1.87cqw] md:p-[2.8cqw] md:[--bar:1.87cqw]">
        {stats.map((stat, i) => {
          const open = active === i;
          const collapsed = active !== null && !open;
          return (
            <button
              key={stat.label}
              type="button"
              onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
              onPointerUp={(e) => e.pointerType !== 'mouse' && toggle(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className={cn(
                'flex min-h-0 basis-(--bar) flex-col items-center justify-center overflow-hidden transition-[flex-grow,background-color]',
                EASE,
                collapsed ? 'grow-0 bg-white' : 'grow bg-black/65'
              )}
            >
              <p
                className={cn(
                  'flex items-baseline gap-[2cqw] leading-none transition-[opacity,translate]',
                  EASE,
                  collapsed && 'opacity-0',
                  collapsed && (i === 0 ? '-translate-y-1/2' : 'translate-y-1/2')
                )}
              >
                <span className="text-[6cqw] md:text-[4.5cqw]">{stat.label}</span>
                <span className="text-[16cqw] font-medium md:text-[12cqw]">
                  {Math.round(stat.sol).toLocaleString('en-US')} SOL
                </span>
              </p>
              <div
                className={cn(
                  'grid transition-[grid-template-rows]',
                  EASE,
                  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <p
                    className={cn(
                      'pt-[2cqw] text-[4cqw] font-normal leading-none transition-[translate,opacity] md:text-[2.25cqw]',
                      EASE,
                      open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                    )}
                  >
                    Total Value{' '}
                    <span className="font-semibold">
                      <CountUp value={stat.usd} run={open} />
                    </span>
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CountUp({ value, run }: { value: number; run: boolean }) {
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!run) return;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / 1000);
      setShown(value * (1 - (1 - t) ** 3));
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [run, value]);

  return <span className="tabular-nums">${Math.round(shown).toLocaleString('en-US')}</span>;
}
