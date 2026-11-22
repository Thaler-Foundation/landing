'use client';

import { useEffect } from 'react';

export function ScrollReveal() {
  useEffect(() => {
    const revealElements = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealElements().forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const seen = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );

    const observe = (el: HTMLElement) => {
      if (seen.has(el)) return;
      seen.add(el);
      observer.observe(el);
    };

    revealElements().forEach(observe);

    const mutationObserver = new MutationObserver(() => {
      revealElements().forEach(observe);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const revealAtBottom = () => {
      if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 2) return;
      revealElements().forEach((el) => {
        el.classList.add('is-revealed');
        observer.unobserve(el);
      });
    };
    window.addEventListener('scroll', revealAtBottom, { passive: true });

    return () => {
      window.removeEventListener('scroll', revealAtBottom);
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
