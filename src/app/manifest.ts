import type { MetadataRoute } from 'next';
import config from '@/config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Thaler Finance',
    short_name: 'Thaler',
    description: config.appDescription,
    start_url: '/',
    scope: '/',
    id: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
