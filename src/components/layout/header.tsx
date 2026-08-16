'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import config from '@/config';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils/cn';
import { ThemeSwitcher } from './theme-switcher';

const inter = Inter({ weight: '800', subsets: ['latin'] });

type DropdownItem = { label: string; description: string; href: string };
type NavItem =
  | { kind: 'dropdown'; label: string; items: DropdownItem[] }
  | { kind: 'anchor'; label: string; href: string };

const navItems: NavItem[] = [
  {
    kind: 'dropdown',
    label: 'Product',
    items: [
      {
        label: 'How it works',
        description: 'Vaults, strategy, and yield settlement',
        href: '/#how-it-works',
      },
      { label: 'Roadmap', description: 'What we are shipping next', href: '/#roadmap' },
      { label: 'FAQ', description: 'Answers to common questions', href: '/#faq' },
    ],
  },
  { kind: 'anchor', label: 'Blog', href: '/#blog' },
  { kind: 'anchor', label: 'Links', href: '/#footer' },
];

function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      title={`${config.appName} homepage`}
      className={cn('group flex shrink-0 items-center gap-2', className)}
    >
      <span className="text-foreground group-hover:opacity-70 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" className="h-8 w-8">
          <g fill="currentColor" fillRule="evenodd">
            <path d="M 513.5 131.5 A 378 378 0 1 1 513.5 887.5 A 378 378 0 1 1 513.5 131.5 M 513.5 173.5 A 336 336 0 1 0 513.5 845.5 A 336 336 0 1 0 513.5 173.5 Z" />
            <path d="M 513 244 L 274 666 L 749 666 Z M 509 361 L 643 614 L 373 615 Z" />
          </g>
        </svg>
      </span>
      <span
        className={cn(
          inter.className,
          'text-foreground text-xl tracking-[-0.03em] group-hover:opacity-70'
        )}
      >
        {config.appName}.
      </span>
    </Link>
  );
}

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onResize = () => window.innerWidth >= 1024 && setIsOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isOpen]);

  return (
    <header
      data-header-reveal
      className={cn(
        'fixed inset-x-0 top-0 z-50 w-full transition-colors duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-foreground/[0.07]'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <nav
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3.5 sm:px-8"
        aria-label="Global"
      >
        <div className="flex items-center gap-6">
          <Logo />
          <div className="hidden items-center lg:flex">
            {navItems.map((item) =>
              item.kind === 'dropdown' ? (
                <FeaturesDropdown key={item.label} label={item.label} items={item.items} />
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-foreground/70 hover:text-foreground rounded-full px-3.5 py-2 text-[15px] font-medium transition duration-150 ease-out"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />

          <Link
            href="/#hero"
            className="bg-foreground text-background hidden rounded-full px-5 py-2 text-[15px] font-medium transition duration-150 ease-out hover:opacity-90 lg:inline-flex"
          >
            Get early access
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((o) => !o)}
            className="bg-foreground text-background relative flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
          >
            <span
              className={cn(
                'absolute h-[2px] w-[18px] rounded-full bg-current transition duration-200 ease-out',
                isOpen ? 'rotate-45' : '-translate-y-1'
              )}
            />
            <span
              className={cn(
                'absolute h-[2px] w-[18px] rounded-full bg-current transition duration-200 ease-out',
                isOpen ? '-rotate-45' : 'translate-y-1'
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <div
        className={cn(
          'bg-foreground text-background absolute inset-x-4 top-[calc(100%+8px)] z-50 overflow-hidden rounded-[24px] shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition duration-200 ease-out lg:hidden',
          isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        )}
      >
        <nav aria-label="Mobile navigation" className="grid p-2">
          {navItems.flatMap((item) =>
            item.kind === 'dropdown'
              ? item.items.map((sub) => (
                  <Link
                    key={sub.href + sub.label}
                    href={sub.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-[18px] px-4 py-3 text-lg font-normal transition duration-150 ease-out hover:bg-background/10"
                  >
                    {sub.label}
                  </Link>
                ))
              : [
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-[18px] px-4 py-3 text-lg font-normal transition duration-150 ease-out hover:bg-background/10"
                  >
                    {item.label}
                  </Link>,
                ]
          )}
          <Link
            href="/#hero"
            onClick={() => setIsOpen(false)}
            className="bg-background text-foreground mt-2 rounded-[18px] px-4 py-3 text-center text-lg font-medium"
          >
            Get early access
          </Link>
        </nav>
      </div>
    </header>
  );
};

function FeaturesDropdown({ label, items }: { label: string; items: DropdownItem[] }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const clear = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openNow = () => {
    clear();
    setOpen(true);
  };
  const scheduleClose = () => {
    clear();
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };
  useEffect(() => () => clear(), []);

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
      onFocus={openNow}
      onBlur={(e) => !ref.current?.contains(e.relatedTarget as Node | null) && scheduleClose()}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        className="text-foreground/70 hover:text-foreground flex items-center gap-1 rounded-full px-3.5 py-2 text-[15px] font-medium transition duration-150 ease-out"
      >
        {label}
        <svg
          className={cn('h-3.5 w-3.5 transition-transform duration-150', open && 'rotate-180')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        role="menu"
        className={cn(
          'bg-card text-card-foreground border-foreground/10 absolute left-0 top-full z-50 mt-2 w-[300px] overflow-hidden rounded-3xl border p-2 shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition duration-150 ease-out',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        )}
      >
        {items.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="hover:bg-foreground/[0.05] flex flex-col gap-1 rounded-[18px] px-4 py-3 transition duration-150 ease-out"
          >
            <span className="text-[15px] font-medium">{item.label}</span>
            <span className="text-foreground/55 text-[13px] leading-[1.3]">{item.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
