'use client';

import Link from 'next/link';
import Image from 'next/image';
import { XTwitterIcon } from '@/components/icons/XTwitterIcon';
import { DiscordIcon } from '@/components/icons/DiscordIcon';
import { FooterWordmark } from '@/components/layout/FooterWordmark';
import config from '@/config';
import { poppins } from '@/lib/fonts';
import { cn } from '@/lib/utils/cn';

import type { FC } from 'react';

const footerColumns: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}[] = [
  {
    title: 'Products',
    links: [
      { href: 'https://thaler.finance', label: 'Thaler', external: true },
      { href: 'https://dns.thaler.finance', label: 'DNS', external: true },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '#faq', label: 'FAQ' },
      { href: '/blog', label: 'Blog' },
      { href: config.docs ?? '#', label: 'Docs', external: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { href: config.socials.xTwitter!, label: 'X (Twitter)', external: true },
      { href: config.socials.discord!, label: 'Discord', external: true },
    ],
  },
];

const socialIcons = [
  { icon: <XTwitterIcon className="size-4" />, href: config.socials.xTwitter, label: 'X' },
  { icon: <DiscordIcon className="size-5" />, href: config.socials.discord, label: 'Discord' },
];

function FooterLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const className =
    'text-foreground/55 hover:text-foreground text-[17px] font-medium leading-8 tracking-[-0.03em] transition duration-150 ease-out';
  if (external) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }
  // Section anchors: home-relative so they work from any page; native CSS
  // smooth-scroll + scroll-margin-top handles the rest (no JS).
  if (href.startsWith('#')) {
    return (
      <Link className={className} href={`/${href}`}>
        {label}
      </Link>
    );
  }
  return (
    <Link className={className} href={href}>
      {label}
    </Link>
  );
}

export const Footer: FC = () => {
  return (
    <footer
      className={cn(
        poppins.className,
        'bg-background flex w-full justify-center px-6 pt-12 pb-10 sm:px-8 md:pb-0 lg:pt-12'
      )}
      id="footer"
    >
      <div className="flex w-full max-w-7xl flex-col gap-8 lg:gap-8">
        {/* Columns */}
        <div className="grid grid-cols-1 gap-10 pb-6 lg:grid-cols-12 lg:gap-6 lg:pb-6">
          <div className="lg:col-span-3" data-reveal="scale">
            <Link
              href="/"
              aria-label={`${config.appName} home`}
              className="group inline-flex items-center transition-opacity"
            >
              <Image
                src="/logo.svg"
                alt={config.appName}
                width={102}
                height={24}
                className="h-7 w-auto group-hover:opacity-70"
              />
            </Link>
            <p className="text-foreground/45 mt-5 max-w-[220px] text-base leading-relaxed font-medium tracking-[-0.03em]">
              Earn consistent yield, regardless of market direction
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:col-span-8 lg:col-start-5 lg:gap-6">
            {footerColumns.map((column, index) => (
              <div
                className="flex flex-col items-start"
                data-reveal="lift"
                data-reveal-delay={index + 1}
                key={column.title}
              >
                <h3 className="text-lg font-semibold tracking-[-0.05em] text-white">
                  {column.title}
                </h3>
                <div className="mt-5 flex flex-col items-start">
                  {column.links.map((link) => (
                    <FooterLink key={`${column.title}-${link.label}`} {...link} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8" data-reveal="fade">
          {/* Meta row */}
          <div className="border-foreground/10 flex flex-col gap-6 md:border-t md:pt-8 lg:flex-row lg:items-center lg:justify-between lg:pt-8">
            <p className="text-foreground/40 text-[15px] font-medium tracking-[-0.03em]">
              © {new Date().getFullYear()} Thaler Finance. All rights reserved.
            </p>
            <div className="hidden items-center gap-3 md:flex">
              {socialIcons.map((s) => (
                <a
                  key={s.label}
                  href={s.href!}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-foreground/[0.05] hover:bg-foreground/[0.1] text-foreground flex h-11 w-11 items-center justify-center rounded-full transition duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <FooterWordmark />
        </div>
      </div>
    </footer>
  );
};
