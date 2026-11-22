import { Geist } from 'next/font/google';
import Script from 'next/script';
import config from '@/config';
import { Providers } from '@/components/providers';
import { cn } from '@/lib/utils/cn';
import { getSEOTags } from '@/lib/seo';

import type { Metadata } from 'next';

import '@/styles/globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  ...getSEOTags({
    title: 'Thaler: Earn from market movement, not price direction',
    description:
      'Thaler gives every depositor an isolated, self-custodied vault on Solana, earning automated, verified yield from market volatility, not price direction.',
    keywords: [
      'Thaler',
      'DeFi yield',
      'Solana vault',
      'market-neutral yield',
      'volatility yield',
      'stablecoin yield',
      'self-custody',
      'Squads Smart Account',
    ],
    canonicalUrlRelative: '/',
    openGraph: {
      images: [
        {
          url: '/images/home.png',
          width: 1200,
          height: 630,
          alt: 'Thaler: isolated, self-custodied yield vaults on Solana',
        },
      ],
    },
  }),
  // Title template: the home keeps its full value-prop title, while every
  // sub-page (Blog, Terms, …) is branded as e.g. "Blog | Thaler".
  title: {
    default: 'Thaler: Earn from market movement, not price direction',
    template: '%s | Thaler',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(geist.className, 'font-sans')}
      style={{ '--background': config.background } as React.CSSProperties}
    >
      <head>
        <meta
          name="google-site-verification"
          content="EhkcOIOBBa1zs4hy9BYFVW_HvO8DDOEY3ydTDJYFWFk"
        />
        {process.env.NODE_ENV === 'development' && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
