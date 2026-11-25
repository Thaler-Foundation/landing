'use client';

import { useEffect, useRef } from 'react';
import { sampleDither } from '@/lib/dither';

const CELL = 0.5;
const BRIGHTNESS = 80;

export function InviteDither() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const img = new window.Image();
    img.src = '/invite-bg.webp';

    const draw = () => {
      if (!img.complete || !canvas.clientWidth) return;
      const cols = Math.ceil(canvas.clientWidth / CELL);
      const rows = Math.ceil(canvas.clientHeight / CELL);
      const levels = sampleDither(ctx, img, cols, rows, 0.2, 0.95, 2);
      const out = ctx.createImageData(cols, rows);
      levels.forEach((v, i) => {
        out.data.fill(v * BRIGHTNESS, i * 4, i * 4 + 3);
        out.data[i * 4 + 3] = 255;
      });
      ctx.putImageData(out, 0, 0);
    };

    img.onload = draw;
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
