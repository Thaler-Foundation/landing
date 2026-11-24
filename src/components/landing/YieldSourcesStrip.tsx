'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { cellRect, sampleDither } from '@/lib/dither';
import { cn } from '@/lib/utils/cn';

const CELL = { desktop: 1.5, mobile: 0.75 };
const DOT = 150;
const ROWS = [
  [14.75, 38.25, 61.75, 85.25],
  [26.5, 50, 73.5],
  [14.75, 38.25, 61.75, 85.25],
];
const SLOTS = ROWS.flatMap((xs, r) => xs.map((x) => [x, 26.5 + r * 23.5]));

type Logo = { name: string; src: string; x: number; y: number; w: number; h?: number };

const lst = (name: string, file: string, i: number): Logo => ({
  name,
  src: `/venues/lst/${file}.png`,
  x: SLOTS[i][0],
  y: SLOTS[i][1],
  w: 20,
});

const BOXES: { name: string; left: number; width: number; cols: number; logos: Logo[] }[] = [
  {
    name: 'Liquid staking',
    left: 6.6,
    width: 45.8,
    cols: 3,
    logos: [
      ['jitoSOL', 'jitosol'],
      ['mSOL', 'msol'],
      ['pSOL', 'psol'],
      ['lanternSOL', 'lanternsol'],
      ['stkeSOL', 'stkesol'],
      ['hSOL', 'hsol'],
      ['blazeSOL', 'blazesol'],
      ['jupSOL', 'jupsol'],
      ['INF', 'infsol'],
      ['rkuSOL', 'rkusol'],
      ['strongSOL', 'strongsol'],
    ].map(([name, file], i) => lst(name, file, i)),
  },
  {
    name: 'Perpetuals',
    left: 56.8,
    width: 13.2,
    cols: 2,
    logos: [
      { name: 'Pacifica', src: '/venues/perps/pacifica.png', x: 50, y: 12, w: 60 },
      { name: 'Phoenix', src: '/venues/perps/phoenix.svg', x: 50, y: 37.5, w: 88 },
      { name: 'Bulk', src: '/venues/perps/bulk.svg', x: 50, y: 62.5, w: 88 },
      { name: 'Bullet', src: '/venues/perps/bullet.png', x: 50, y: 88, w: 88 },
    ],
  },
  {
    name: 'Lending',
    left: 74.3,
    width: 19.1,
    cols: 2,
    logos: [
      { name: 'Kamino', src: '/venues/lending/kamino.png', x: 50, y: 28, w: 57, h: 164 / 115 },
      { name: 'Jupiter Lend', src: '/venues/lending/juplend.png', x: 50, y: 72, w: 80 },
    ],
  },
];

export function YieldSourcesStrip() {
  const stripRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRefs = useRef<HTMLDivElement[]>([]);

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
      const img = desktop.matches ? wide : narrow;
      const cell = desktop.matches ? CELL.desktop : CELL.mobile;
      if (!img.complete || !strip.clientWidth) return;
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
        const levels = sampleDither(scratch, img, w, h, 0.1, 0.5, 2);
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

    const [wide, narrow] = ['/yield-sources-box-bg.webp', '/yield-sources-box-bg-mobile.webp'].map(
      (src) => {
        const img = new window.Image();
        img.src = src;
        img.onload = schedule;
        return img;
      }
    );
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
      <Image
        src="/yield-sources-bg.webp"
        alt=""
        fill
        sizes="(min-width: 1280px) 1216px, 100vw"
        className="-z-20 hidden object-cover md:block"
      />
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
          {box.logos.map((logo) => (
            <Image
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              title={logo.name}
              width={256}
              height={Math.round(256 * (logo.h ?? 1))}
              className={cn('yield-logo', i === 0 && 'rounded-full')}
              style={
                {
                  '--x': `${logo.x}%`,
                  '--y': `${logo.y}%`,
                  '--w': `${logo.w}%`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
