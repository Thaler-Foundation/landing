'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import config from '@/config';
import { cn } from '@/lib/utils/cn';
import { poppins } from '@/lib/fonts';
import { AccessDrawerTrigger } from '@/components/access/AccessDrawer';

function Logo() {
  return (
    <Link
      href="/"
      title={`${config.appName} homepage`}
      className="shrink-0 justify-self-start transition-opacity hover:opacity-70"
    >
      <Image
        src="/logo.svg"
        alt={config.appName}
        width={102}
        height={24}
        priority
        className="h-7 w-auto"
      />
    </Link>
  );
}

function EarlyAccessCta({ className }: { className?: string }) {
  return (
    <AccessDrawerTrigger
      className={cn(
        'cta-early-access inline-flex items-center gap-[0.55em] text-[18px]',
        className
      )}
    >
      <span aria-hidden className="cta-early-access-arrow h-[1.1em] w-[1.1em] bg-current" />
      <span className="cta-early-access-label">
        <span className="hidden sm:inline">Join </span>Early Access
      </span>
    </AccessDrawerTrigger>
  );
}

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      data-header-reveal
      className={cn(
        poppins.className,
        'fixed inset-x-0 top-0 z-50 w-full font-semibold leading-none tracking-[-0.05em] text-white transition-colors duration-300',
        scrolled
          ? 'bg-background border-b border-white/[0.07]'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <nav
        className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 py-5 sm:px-8"
        aria-label="Global"
      >
        <Logo />
        <a
          href={config.docs}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden text-[18px] transition-opacity hover:opacity-70 md:block"
        >
          Docs
        </a>
        <div className="col-start-3 flex items-center gap-5 justify-self-end md:gap-8">
          <a
            href={config.dashboard}
            className="text-[18px] text-white/60 transition-colors hover:text-white"
          >
            Login
          </a>
          <EarlyAccessCta />
        </div>
      </nav>
    </header>
  );
};
