'use client';

import { useEffect, useRef } from 'react';

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const CELL = 2;
const LEVELS = 4;
const LOW = 0.42;
const HIGH = 0.85;
const GREY = [255, 255, 255];

const VAULTS = [
  { name: 'Safe', returns: '11%', color: [0, 255, 255] },
  { name: 'Balanced', returns: '13%', color: [255, 225, 0] },
  { name: 'Aggressive', returns: '16%', color: [255, 0, 0] },
];

export function VaultsStrip() {
  const stripRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vaultRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const strip = stripRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const desktop = matchMedia('(min-width: 768px)');
    const img = new Image();
    img.src = '/vaults-bg.webp';
    let levels = new Float32Array(0);
    let frame = 0;

    const sample = () => {
      if (!img.complete || !strip.clientWidth) return;
      const cols = Math.ceil(strip.clientWidth / CELL);
      const rows = Math.ceil(strip.clientHeight / CELL);
      canvas.width = cols;
      canvas.height = rows;
      const s = Math.max(cols / img.naturalWidth, rows / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.drawImage(img, (cols - w) / 2, (rows - h) / 2, w, h);
      const pixels = ctx.getImageData(0, 0, cols, rows).data;
      levels = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const lum =
            (0.299 * pixels[i * 4] + 0.587 * pixels[i * 4 + 1] + 0.114 * pixels[i * 4 + 2]) / 255;
          const v = Math.min(1, Math.max(0, (lum - LOW) / (HIGH - LOW)));
          const t = (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
          levels[i] = Math.min(LEVELS - 1, Math.floor(v * (LEVELS - 1) + t)) / (LEVELS - 1);
        }
      }
    };

    const draw = () => {
      frame = 0;
      const cols = canvas.width;
      const rows = canvas.height;
      if (levels.length !== cols * rows || !cols) return;
      const origin = strip.getBoundingClientRect();
      const cellW = origin.width / cols;
      const cellH = origin.height / rows;
      const tints = vaultRefs.current.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          left: (r.left - origin.left) / cellW,
          top: (r.top - origin.top) / cellH,
          right: (r.right - origin.left) / cellW,
          bottom: (r.bottom - origin.top) / cellH,
        };
      });

      const out = ctx.createImageData(cols, rows);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          out.data[i * 4 + 3] = 255;
          const q = levels[i];
          if (!q) continue;
          const t = tints.findIndex(
            (r) => x + 0.5 >= r.left && x + 0.5 < r.right && y + 0.5 >= r.top && y + 0.5 < r.bottom
          );
          if (t === -1 && !desktop.matches) continue;
          const color = t === -1 ? GREY : VAULTS[t].color;
          out.data[i * 4] = q * color[0];
          out.data[i * 4 + 1] = q * color[1];
          out.data[i * 4 + 2] = q * color[2];
        }
      }
      ctx.putImageData(out, 0, 0);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const stripObserver = new ResizeObserver(() => {
      sample();
      schedule();
    });
    const vaultObserver = new ResizeObserver(schedule);
    stripObserver.observe(strip);
    vaultRefs.current.forEach((el) => vaultObserver.observe(el));
    img.onload = () => {
      sample();
      schedule();
    };

    return () => {
      stripObserver.disconnect();
      vaultObserver.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={stripRef} className="vaults relative isolate">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full [image-rendering:pixelated]"
      />
      {VAULTS.map((vault, i) => (
        <div
          key={vault.name}
          ref={(el) => {
            if (el) vaultRefs.current[i] = el;
          }}
          className="vault"
        >
          <div className="vault-box flex flex-col items-center justify-center bg-black text-center">
            <p className="text-lg font-medium leading-none tracking-[-0.03em] md:text-[clamp(18px,2.3cqw,28px)]">
              {vault.name}
              <br />
              Vault
            </p>
            <p className="mt-[0.2em] text-5xl font-semibold leading-none tracking-[-0.06em] md:text-[clamp(40px,6.6cqw,80px)]">
              {vault.returns}
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
