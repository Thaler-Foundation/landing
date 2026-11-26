'use client';

import { useEffect, useRef } from 'react';
import { sampleDither } from '@/lib/dither';

const CELL = 1;
const DOT = 100;
const CROP = { x: 440, y: 40, w: 560, h: 432 };

export function InviteDither() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const source = document.createElement('canvas');
    const img = new window.Image();
    img.src = '/cloud-bg-center.webp';

    const draw = () => {
      if (!source.width || !canvas.clientWidth) return;
      const cols = Math.ceil(canvas.clientWidth / CELL);
      const rows = Math.ceil(canvas.clientHeight / CELL);
      const levels = sampleDither(ctx, source, cols, rows, 0, 1, 2);
      const out = ctx.createImageData(cols, rows);
      levels.forEach((v, i) => {
        out.data.fill(v * DOT, i * 4, i * 4 + 3);
        out.data[i * 4 + 3] = 255;
      });
      ctx.putImageData(out, 0, 0);
    };

    img.onload = () => {
      source.width = CROP.w;
      source.height = CROP.h;
      source
        .getContext('2d')!
        .drawImage(img, CROP.x, CROP.y, CROP.w, CROP.h, 0, 0, CROP.w, CROP.h);
      draw();
    };
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full [image-rendering:pixelated]"
    />
  );
}
