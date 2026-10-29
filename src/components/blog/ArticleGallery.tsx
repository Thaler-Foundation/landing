'use client';

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';

type Img = { src: string; alt: string };

function Icon({ d }: { d: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

const button =
  'absolute z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20';

const dotSizes = [
  'h-2 w-2 bg-white',
  'h-1.5 w-1.5 bg-white/50',
  'h-1.5 w-1.5 bg-white/50',
  'h-1 w-1 bg-white/40',
];

function Dots({ count, index }: { count: number; index: number }) {
  return (
    <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-1.5 md:hidden">
      {Array.from({ length: count }, (_, i) => {
        const distance = Math.abs(i - index);
        if (distance > 3) return null;
        return <span key={i} className={`rounded-full transition-all ${dotSizes[distance]}`} />;
      })}
    </div>
  );
}

export function ArticleGallery({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const start = useRef(0);
  const [images, setImages] = useState<Img[]>([]);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined);

  const loop = images.length > 1;
  const slides = loop ? [images[images.length - 1], ...images, images[0]] : images;
  const offset = loop ? 1 : 0;

  const slot = () => {
    const el = track.current;
    return el ? Math.round(el.scrollLeft / el.clientWidth) : 0;
  };

  const goTo = (i: number, behavior: ScrollBehavior = 'smooth') => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior });
  };

  const step = (by: number) => goTo(slot() + by);

  useEffect(() => {
    if (!open) return dialog.current?.close();
    dialog.current?.showModal();
    const el = track.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollTo({ left: (start.current + offset) * el.clientWidth, behavior: 'instant' });
  }, [open]);

  const onClick = (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof HTMLImageElement) || target.closest('a, media-controller, .blog-tweet'))
      return;
    const all = [
      ...root.current!.querySelectorAll<HTMLImageElement>(
        'img:not(a img, media-controller img, .blog-tweet img)'
      ),
    ];
    setImages(
      all.map((img) => ({ src: img.dataset.full || img.currentSrc || img.src, alt: img.alt }))
    );
    start.current = all.indexOf(target);
    setIndex(start.current);
    setOpen(true);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  };

  const onScroll = () => {
    const n = images.length;
    setIndex((((slot() - offset) % n) + n) % n);
    if (!loop) return;
    clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      if (slot() === 0) goTo(n, 'instant');
      if (slot() === n + 1) goTo(1, 'instant');
    }, 120);
  };

  const close = () => setOpen(false);
  const closeOnSelf = (e: MouseEvent) => e.target === e.currentTarget && close();

  return (
    <>
      <div ref={root} onClick={onClick} className="article-gallery">
        {children}
      </div>
      <dialog
        ref={dialog}
        onClose={close}
        onKeyDown={onKeyDown}
        className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-background p-0 text-white backdrop:bg-black/60 md:bg-background/90"
      >
        {open && (
          <div
            ref={track}
            tabIndex={-1}
            onScroll={onScroll}
            className="flex h-full outline-none snap-x snap-mandatory overflow-x-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {slides.map((img, i) => (
              <div
                key={i}
                onClick={closeOnSelf}
                className="flex h-full w-full shrink-0 snap-center items-center justify-center md:p-16"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  draggable={false}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className={`${button} top-4 left-4`}
        >
          <span className="md:hidden">
            <Icon d="M19 12H5M12 19l-7-7 7-7" />
          </span>
          <span className="hidden md:block">
            <Icon d="M18 6 6 18M6 6l12 12" />
          </span>
        </button>
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => step(-1)}
              className={`${button} top-1/2 left-4 hidden -translate-y-1/2 md:flex`}
            >
              <Icon d="M19 12H5M12 19l-7-7 7-7" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => step(1)}
              className={`${button} top-1/2 right-4 hidden -translate-y-1/2 md:flex`}
            >
              <Icon d="M5 12h14M12 5l7 7-7 7" />
            </button>
            <span className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 text-sm text-white/70 md:block">
              {index + 1} / {images.length}
            </span>
            <Dots count={images.length} index={index} />
          </>
        )}
      </dialog>
    </>
  );
}
