'use client';

import { useEffect, useRef } from 'react';
import { cellRect } from '@/lib/dither';

const GREY = [255, 255, 255];

const VAULTS = [
  { name: 'Safe', color: [128, 170, 255] },
  { name: 'Conservative', color: [128, 255, 213] },
  { name: 'Balanced', color: [170, 255, 128] },
];

export function VaultsStrip({ returns }: { returns: number[] }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vaultRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const strip = stripRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const desktop = matchMedia('(min-width: 768px)');
    const img = new Image();
    img.src = '/vaults-dither.png';
    let levels = new Uint8ClampedArray(0);
    let frame = 0;

    const draw = () => {
      frame = 0;
      const cols = canvas.width;
      const rows = canvas.height;
      if (!levels.length) return;
      const origin = strip.getBoundingClientRect();
      const scale = Math.max(origin.width / cols, origin.height / rows);
      const cover = {
        left: origin.left + (origin.width - cols * scale) / 2,
        top: origin.top + (origin.height - rows * scale) / 2,
      } as DOMRect;
      const tints = vaultRefs.current.map((el) => cellRect(el, cover, scale, scale));

      const out = ctx.createImageData(cols, rows);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          out.data[i * 4 + 3] = 255;
          const q = levels[i * 4] / 255;
          if (!q) continue;
          const t = tints.findIndex(
            (r) => x + 0.5 >= r.left && x + 0.5 < r.right && y + 0.5 >= r.top && y + 0.5 < r.bottom
          );
          if (t === -1 && !desktop.matches) continue;
          const color = t === -1 ? GREY : VAULTS[t].color;
          const level = t === -1 ? q : 0.8;
          out.data[i * 4] = level * color[0];
          out.data[i * 4 + 1] = level * color[1];
          out.data[i * 4 + 2] = level * color[2];
        }
      }
      ctx.putImageData(out, 0, 0);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(strip);
    vaultRefs.current.forEach((el) => observer.observe(el));
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      levels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      schedule();
    };

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={stripRef} className="vaults relative isolate bg-background">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full object-cover mix-blend-lighten"
      />
      {VAULTS.map((vault, i) => (
        <div
          key={vault.name}
          ref={(el) => {
            if (el) vaultRefs.current[i] = el;
          }}
          className="vault"
        >
          <div className="vault-box flex flex-col items-center justify-center bg-background text-center">
            <p className="text-lg font-medium leading-none tracking-[-0.03em] md:text-[clamp(18px,2.3cqw,28px)]">
              {vault.name}
              <br />
              Vault
            </p>
            <p className="mt-[0.2em] text-5xl font-semibold leading-none tracking-[-0.06em] md:text-[clamp(40px,6.6cqw,80px)]">
              {returns[i]}%<sup className="top-[0.65em] align-top text-[0.4em] font-medium">*</sup>
            </p>
            <p className="mt-[0.6em] text-lg font-medium leading-none tracking-[-0.03em] md:text-[clamp(18px,2.3cqw,28px)]">
              Returns
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
