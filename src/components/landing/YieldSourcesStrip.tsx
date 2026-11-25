'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { cellRect, sampleDither } from '@/lib/dither';
import { cn } from '@/lib/utils/cn';

const CELL = { desktop: 1.5, mobile: 0.5 };
const CROP = { x: 0.08, y: 0.2, w: 0.64, h: 0.52 };
const DOT = 150;
const COLS = [18, 50, 82];
const SLOTS = [0, 1, 2, 3].flatMap((r) => COLS.map((x) => [x, 14 + r * 24]));

type Logo = {
  name: string;
  by: string;
  about: string;
  src: string;
  x: number;
  y: number;
  w: number;
  h?: number;
  m?: number;
};

const lst = ([name, by, file, about]: string[], i: number): Logo => ({
  name,
  by,
  about,
  src: `/venues/lst/${file}.png`,
  x: SLOTS[i][0],
  y: SLOTS[i][1],
  w: 24,
});

const BOXES: { name: string; left: number; width: number; cols: number; logos: Logo[] }[] = [
  {
    name: 'Liquid staking',
    left: 0,
    width: 46,
    cols: 4,
    logos: [
      ['jitoSOL', 'Jito', 'jitosol', 'Staked SOL that also earns MEV rewards.'],
      ['mSOL', 'Marinade', 'msol', 'Staked SOL spread across hundreds of validators.'],
      ['PSOL', 'Phantom', 'psol', 'Staked SOL from the Phantom wallet, with MEV and fee rewards.'],
      ['lanternSOL', 'Lantern', 'lanternsol', 'Staked SOL from the Lantern validator.'],
      ['STKESOL', 'SOL Strategies', 'stkesol', 'Staked SOL across top-ranked validators.'],
      ['hSOL', 'Helius', 'hsol', 'Staked SOL with the Helius validator.'],
      ['bSOL', 'BlazeStake', 'blazesol', 'Staked SOL delegated across many validators.'],
      ['jupSOL', 'Jupiter', 'jupsol', 'Staked SOL with the Jupiter validator.'],
      ['INF', 'Sanctum', 'infsol', 'A basket of staked SOL tokens that also earns swap fees.'],
      ['rkuSOL', 'Raiku', 'rkusol', 'Staked SOL that adds blockspace auction revenue.'],
      ['strongSOL', 'Stronghold', 'strongsol', 'Staked SOL from the Stronghold validator.'],
      ['vSOL', 'The Vault', 'vsol', 'Staked SOL from The Vault, spread across validators.'],
    ].map(lst),
  },
  {
    name: 'Perpetuals',
    left: 50.5,
    width: 20,
    cols: 4,
    logos: [
      {
        name: 'Pacifica',
        by: 'Perps exchange',
        about: 'Perpetual futures on Solana with exchange-speed matching.',
        src: '/venues/perps/pacifica.png',
        x: 50,
        y: 12,
        w: 41,
        m: 0.65,
      },
      {
        name: 'Phoenix',
        by: 'Perps exchange',
        about: 'Fully on-chain order book exchange on Solana.',
        src: '/venues/perps/phoenix.svg',
        x: 50,
        y: 37.5,
        w: 60,
        m: 1.08,
      },
      {
        name: 'Bulk',
        by: 'Perps exchange',
        about: 'Perps order book built into Solana validators.',
        src: '/venues/perps/bulk.svg',
        x: 50,
        y: 62.5,
        w: 60,
        m: 1.3,
      },
      {
        name: 'Bullet',
        by: 'Perps exchange',
        about: 'Perpetual futures on Solana with zero trading fees.',
        src: '/venues/perps/bullet.png',
        x: 50,
        y: 88,
        w: 60,
      },
    ],
  },
  {
    name: 'Lending',
    left: 75,
    width: 25,
    cols: 2,
    logos: [
      {
        name: 'Kamino',
        by: 'Lending',
        about: 'Lending and liquidity markets on Solana.',
        src: '/venues/lending/kamino.png',
        x: 50,
        y: 28,
        w: 57,
        h: 164 / 115,
      },
      {
        name: 'Jupiter Lend',
        by: 'Lending',
        about: 'Lending markets from Jupiter.',
        src: '/venues/lending/juplend.png',
        x: 50,
        y: 72,
        w: 80,
      },
    ],
  },
];

const align = (i: number, cols: number) =>
  i % cols === 0 ? 'start' : i % cols === cols - 1 ? 'end' : 'center';

export function YieldSourcesStrip() {
  const stripRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRefs = useRef<HTMLDivElement[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!(e.target as Element).closest('.yield-logo')) setActive(null);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  useEffect(() => {
    const strip = stripRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const scratch = document.createElement('canvas').getContext('2d', {
      willReadFrequently: true,
    })!;
    const desktop = matchMedia('(min-width: 768px)');
    let frame = 0;

    const draw = () => {
      frame = 0;
      const cell = desktop.matches ? CELL.desktop : CELL.mobile;
      if (!source.width || !strip.clientWidth) return;
      const cols = Math.ceil(strip.clientWidth / cell);
      const rows = Math.ceil(strip.clientHeight / cell);
      canvas.width = cols;
      canvas.height = rows;
      const origin = strip.getBoundingClientRect();
      const cellW = origin.width / cols;
      const cellH = origin.height / rows;
      const out = ctx.createImageData(cols, rows);
      for (const el of boxRefs.current) {
        const r = cellRect(el, origin, cellW, cellH);
        const left = Math.max(0, Math.ceil(r.left));
        const top = Math.max(0, Math.ceil(r.top));
        const w = Math.min(cols, Math.floor(r.right)) - left;
        const h = Math.min(rows, Math.floor(r.bottom)) - top;
        if (w <= 0 || h <= 0) continue;
        const levels = sampleDither(scratch, source, w, h, 0.2, 0.6, 2);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (top + y) * cols + left + x;
            const v = levels[y * w + x] * DOT;
            out.data[i * 4] = v;
            out.data[i * 4 + 1] = v;
            out.data[i * 4 + 2] = v;
            out.data[i * 4 + 3] = 255;
          }
        }
      }
      ctx.putImageData(out, 0, 0);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const source = document.createElement('canvas');
    const img = new window.Image();
    img.src = '/yield-sources-box-bg-mobile.webp';
    img.onload = () => {
      const sw = Math.round(img.naturalWidth * CROP.w);
      const sh = Math.round(img.naturalHeight * CROP.h);
      source.width = sw;
      source.height = sh;
      const sctx = source.getContext('2d')!;
      sctx.filter = 'blur(2px)';
      sctx.drawImage(
        img,
        img.naturalWidth * CROP.x,
        img.naturalHeight * CROP.y,
        sw,
        sh,
        0,
        0,
        sw,
        sh
      );
      schedule();
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(strip);
    boxRefs.current.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={stripRef} className="yield-sources relative isolate">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full [image-rendering:pixelated]"
      />
      {BOXES.map((box, i) => (
        <div
          key={box.name}
          ref={(el) => {
            if (el) boxRefs.current[i] = el;
          }}
          role="group"
          aria-label={box.name}
          className="yield-box bg-black/65"
          style={
            {
              '--left': `${box.left}%`,
              '--width': `${box.width}%`,
              '--cols': box.cols,
            } as React.CSSProperties
          }
        >
          {box.logos.map((logo, j) => (
            <button
              key={logo.name}
              type="button"
              aria-label={`${logo.name}, ${logo.by}. ${logo.about}`}
              data-active={active === logo.name || undefined}
              onClick={() => setActive((a) => (a === logo.name ? null : logo.name))}
              className="yield-logo cursor-pointer"
              style={
                {
                  '--x': `${logo.x}%`,
                  '--y': `${logo.y}%`,
                  '--w': `${logo.w}%`,
                  '--m': logo.m,
                } as React.CSSProperties
              }
            >
              <Image
                src={logo.src}
                alt=""
                width={256}
                height={Math.round(256 * (logo.h ?? 1))}
                className={cn(i === 0 && 'rounded-full')}
              />
              <span aria-hidden data-align={align(j, box.cols)} className="yield-tip">
                <span className="block font-medium text-white">
                  {logo.name} <span className="text-white/50">· {logo.by}</span>
                </span>
                <span className="mt-1 block text-white/70">{logo.about}</span>
              </span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
