import Image from 'next/image';
import { CopyButton } from '@/components/brand/CopyButton';
import { SubPage } from '@/components/layout/SubPage';
import { getSEOTags } from '@/lib/seo';
import { cn } from '@/lib/utils/cn';

import type { Metadata } from 'next';

export const metadata: Metadata = getSEOTags({
  title: 'Brand',
  description: 'The Thaler logo, wordmark, and logomark.',
  canonicalUrlRelative: '/brand',
});

const logos = [
  { title: 'Full Logo', name: 'logo', width: 102 },
  { title: 'Wordmark', name: 'wordmark', width: 66.5 },
  { title: 'Logomark', name: 'logomark', width: 24 },
];

const themes = [
  { label: 'Dark', suffix: '', tile: 'border-white/15 bg-black text-white' },
  { label: 'Light', suffix: '-black', tile: 'border-transparent bg-white text-black' },
];

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-[1.1em] w-[1.1em] fill-none stroke-current"
      strokeWidth={1.75}
    >
      <rect x="8" y="3" width="12" height="15" rx="2.5" />
      <path d="M5 7v11.5A2.5 2.5 0 0 0 7.5 21H16" />
    </svg>
  );
}

export default function BrandPage() {
  return (
    <SubPage>
      <div
        className="flex flex-col gap-8 pb-16 sm:flex-row sm:items-center sm:justify-between lg:pb-20"
        data-reveal="left"
      >
        <h1 className="text-5xl font-semibold leading-none tracking-[-0.03em] sm:text-[64px]">
          Thaler Brand
        </h1>
        <a
          href="/brand/thaler-brand-kit.zip"
          download
          className="group flex w-fit items-center gap-4 rounded-full bg-white py-2 pl-7 pr-2 text-black transition-opacity hover:opacity-90"
        >
          <span className="text-lg font-semibold tracking-[-0.03em] sm:text-xl">Download Kit</span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10">
            <span
              aria-hidden
              className="h-5 w-5 rotate-45 bg-current [mask:url(/cta-arrow.svg)_center/contain_no-repeat] transition-[translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0.5 group-focus-visible:translate-y-0.5 motion-reduce:transition-none"
            />
          </span>
        </a>
      </div>

      <section className="space-y-16 lg:space-y-20">
        {logos.map((l) => (
          <div
            key={l.title}
            className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:items-center"
            data-reveal="fade"
          >
            <h2 className="text-xl font-medium tracking-[-0.05em] sm:text-2xl">{l.title}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {themes.map((t) => {
                const src = `/brand/${l.name}${t.suffix}.svg`;
                return (
                  <div
                    key={t.label}
                    className={cn(
                      'relative flex aspect-[16/9] items-center justify-center rounded-3xl border',
                      t.tile
                    )}
                  >
                    <Image
                      src={src}
                      alt={`${l.title}, ${t.label.toLowerCase()}`}
                      width={l.width}
                      height={24}
                      className="h-10 w-auto sm:h-12"
                    />
                    <CopyButton
                      label="Copy SVG"
                      url={src}
                      className="absolute right-4 bottom-4 flex items-center gap-1.5 text-sm font-medium opacity-60 transition-opacity hover:opacity-100"
                    >
                      <CopyIcon />
                    </CopyButton>
                    <span className="absolute bottom-4 left-4 text-sm font-medium opacity-60">
                      {t.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </SubPage>
  );
}
