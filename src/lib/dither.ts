const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export function sampleDither(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement,
  cols: number,
  rows: number,
  low = 0.42,
  high = 0.85,
  steps = 4
) {
  ctx.canvas.width = cols;
  ctx.canvas.height = rows;
  const iw = img instanceof HTMLImageElement ? img.naturalWidth : img.width;
  const ih = img instanceof HTMLImageElement ? img.naturalHeight : img.height;
  const s = Math.max(cols / iw, rows / ih);
  const w = iw * s;
  const h = ih * s;
  ctx.drawImage(img, (cols - w) / 2, (rows - h) / 2, w, h);
  const pixels = ctx.getImageData(0, 0, cols, rows).data;
  const levels = new Float32Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      const lum =
        (0.299 * pixels[i * 4] + 0.587 * pixels[i * 4 + 1] + 0.114 * pixels[i * 4 + 2]) / 255;
      const v = Math.min(1, Math.max(0, (lum - low) / (high - low)));
      const t = (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
      levels[i] = Math.min(steps - 1, Math.floor(v * (steps - 1) + t)) / (steps - 1);
    }
  }
  return levels;
}

export function cellRect(el: Element, origin: DOMRect, cellW: number, cellH: number) {
  const r = el.getBoundingClientRect();
  return {
    left: (r.left - origin.left) / cellW,
    top: (r.top - origin.top) / cellH,
    right: (r.right - origin.left) / cellW,
    bottom: (r.bottom - origin.top) / cellH,
  };
}
