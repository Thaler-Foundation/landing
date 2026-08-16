'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollToId = (id: string, smooth = true) => {
      if (!id) return;
      const el = document.getElementById(decodeURIComponent(id));
      if (el) {
        el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
      }
    };

    if (window.location.hash) {
      requestAnimationFrame(() => scrollToId(window.location.hash.slice(1)));
    }

    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const anchor = (e.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;

      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;

      e.preventDefault();
      history.pushState(null, '', url.hash);
      el.scrollIntoView({ behavior: 'smooth' });
    };

    const onHashChange = () => scrollToId(window.location.hash.slice(1));

    document.addEventListener('click', onClick);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [pathname]);

  return null;
}
