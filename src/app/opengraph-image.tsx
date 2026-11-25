import { ogSize, renderOg } from '@/lib/og';

export const alt = 'Thaler: Earn yield from market movement, on Solana';
export const size = ogSize;
export const contentType = 'image/png';

export default function Image() {
  return renderOg({
    title: ['Earn Yield From', 'Market Movement'],
    description: 'Earn consistent yield, regardless of market direction',
  });
}
