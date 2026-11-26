'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { ComponentProps, FC, MouseEvent } from 'react';

export const HomeLink: FC<Omit<ComponentProps<typeof Link>, 'href'>> = ({ onClick, ...props }) => {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (pathname !== '/' || event.defaultPrevented) return;
    event.preventDefault();
    window.history.replaceState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <Link href="/" onClick={handleClick} {...props} />;
};
