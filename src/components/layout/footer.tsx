'use client';

import Link from 'next/link';
import { Inter } from 'next/font/google';
import { XTwitterIcon } from '@/components/icons/XTwitterIcon';
import { DiscordIcon } from '@/components/icons/DiscordIcon';
import config from '@/config';

import type { FC } from 'react';

const inter = Inter({ weight: '800', subsets: ['latin'] });

const footerColumns: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}[] = [
  {
    title: 'Product',
    links: [
      { href: '#how-it-works', label: 'How it works' },
      { href: '#roadmap', label: 'Roadmap' },
      { href: '#faq', label: 'FAQ' },
      { href: '/blog', label: 'Blog' },
      { href: config.docs ?? '#', label: 'Docs', external: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms and Conditions' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { href: config.socials.xTwitter!, label: 'X (Twitter)', external: true },
      { href: config.socials.discord!, label: 'Discord', external: true },
      { href: `https://${config.domainName}`, label: config.domainName, external: true },
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
    'text-foreground/55 hover:text-foreground text-[17px] font-normal leading-8 tracking-[-0.01em] transition duration-150 ease-out';
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
      className="bg-background flex w-full justify-center px-6 pb-10 pt-12 sm:px-8 lg:pb-10 lg:pt-12"
      id="footer"
    >
      <div className="flex w-full max-w-7xl flex-col gap-8 lg:gap-8">
        {/* Columns */}
        <div className="grid grid-cols-1 gap-10 pb-6 lg:grid-cols-12 lg:gap-6 lg:pb-6">
          <div className="lg:col-span-3" data-reveal="scale">
            <Link
              href="/"
              aria-label={`${config.appName} home`}
              className="group text-foreground inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" className="h-9 w-9">
                <g fill="currentColor" fillRule="evenodd">
                  <path d="M 513.5 131.5 A 378 378 0 1 1 513.5 887.5 A 378 378 0 1 1 513.5 131.5 M 513.5 173.5 A 336 336 0 1 0 513.5 845.5 A 336 336 0 1 0 513.5 173.5 Z" />
                  <path d="M 513 244 L 274 666 L 749 666 Z M 509 361 L 643 614 L 373 615 Z" />
                </g>
              </svg>
              <span
                className={`${inter.className} text-2xl tracking-[-0.03em] group-hover:opacity-70`}
              >
                {config.appName}.
              </span>
            </Link>
            <p className="text-foreground/45 mt-5 max-w-[220px] text-sm leading-relaxed">
              Earn consistent yield in any market condition, with full self-custody.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-3 lg:col-span-8 lg:col-start-5 lg:gap-6">
            {footerColumns.map((column, index) => (
              <div
                className="flex flex-col items-start"
                data-reveal="lift"
                data-reveal-delay={index + 1}
                key={column.title}
              >
                <h3 className="text-altitude-black dark:text-white text-lg font-medium tracking-[-0.01em]">
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

        {/* Meta row */}
        <div
          className="border-foreground/10 flex flex-col gap-6 border-t pt-8 lg:flex-row lg:items-center lg:justify-between lg:pt-8"
          data-reveal="fade"
        >
          <p className="text-foreground/40 text-[15px] tracking-[-0.01em]">
            © {new Date().getFullYear()}{' '}
            {config.appName.charAt(0).toUpperCase() + config.appName.slice(1)}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
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
      </div>
    </footer>
  );
};
