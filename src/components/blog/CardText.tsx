'use client';

import { useEffect, useRef } from 'react';

export function CardText({ title, excerpt }: { title: string; excerpt: string }) {
  const box = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const text = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const fit = () => {
      const p = text.current;
      if (!box.current || !heading.current || !p) return;
      const style = getComputedStyle(p);
      const free =
        box.current.clientHeight - heading.current.offsetHeight - parseFloat(style.paddingTop);
      p.style.webkitLineClamp = String(
        Math.max(1, Math.floor(free / parseFloat(style.lineHeight)))
      );
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box.current!);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} className="mt-6 flex h-[148px] flex-col overflow-hidden sm:h-[178px] lg:mt-8">
      <h3
        ref={heading}
        className="line-clamp-2 shrink-0 text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-[40px]"
      >
        {title}
      </h3>
      <p
        ref={text}
        className="mt-auto line-clamp-3 pt-4 text-base leading-[1.75] text-white/80 sm:text-lg lg:text-xl"
      >
        {excerpt}
      </p>
    </div>
  );
}
