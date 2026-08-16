'use client';

import { useMemo, useState } from 'react';
import { roadmapEvents, type RoadmapEvent } from '@/data/roadmap';
import { cn } from '@/lib/utils/cn';

const CARD_WIDTH = 360;
const CARD_GAP = 24;

function formatPeriod(item: RoadmapEvent) {
  if (item.periodType === 'Q') return `Q${item.periodNumber} ${item.year}`;
  if (item.periodType === 'H') return `H${item.periodNumber} ${item.year}`;
  return `${item.year}`;
}

function getStatus(item: RoadmapEvent) {
  if (item.isChecked) {
    return {
      label: 'Completed',
      dot: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-500/10',
    };
  }
  if (item.isActive || item.events.some((e) => e.isChecked)) {
    return {
      label: 'In progress',
      dot: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-500/10',
    };
  }
  return {
    label: 'Planned',
    dot: 'bg-foreground/30',
    text: 'text-foreground/45',
    badge: 'bg-foreground/[0.04]',
  };
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function LandingRoadmap() {
  const initialIndex = useMemo(() => {
    const i = roadmapEvents.findIndex((item) => item.isActive);
    return i >= 0 ? i : 0;
  }, []);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentItem = roadmapEvents[currentIndex];
  const currentStatus = getStatus(currentItem);

  const previous = () => setCurrentIndex((i) => (i === 0 ? roadmapEvents.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === roadmapEvents.length - 1 ? 0 : i + 1));

  return (
    <section className="bg-background w-full py-16 lg:py-24" id="roadmap">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 pb-8 sm:px-8 lg:pb-12">
        <h2
          className="text-altitude-black dark:text-white text-[34px] font-semibold leading-none tracking-[-0.02em] sm:text-[48px] lg:text-[56px]"
          data-reveal="left"
        >
          Roadmap
        </h2>
        <div className="flex shrink-0 items-center gap-2" data-reveal="right">
          <button
            aria-label="Previous roadmap item"
            onClick={previous}
            type="button"
            className="bg-foreground/[0.05] hover:bg-foreground/[0.1] grid h-11 w-11 place-items-center rounded-full transition duration-150 ease-out hover:-translate-x-0.5 active:translate-x-0 sm:h-12 sm:w-12"
          >
            <Arrow className="text-foreground" />
          </button>
          <button
            aria-label="Next roadmap item"
            onClick={next}
            type="button"
            className="bg-foreground/[0.05] hover:bg-foreground/[0.1] grid h-11 w-11 place-items-center rounded-full transition duration-150 ease-out hover:translate-x-0.5 active:translate-x-0 sm:h-12 sm:w-12"
          >
            <Arrow className="text-foreground rotate-180" />
          </button>
        </div>
      </div>

      <div
        className="bg-foreground/[0.03] relative h-[460px] overflow-hidden sm:h-[478px]"
        data-reveal="lift"
        data-reveal-delay="1"
      >
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-20 bg-gradient-to-r to-transparent lg:block" />
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-20 bg-gradient-to-l to-transparent lg:block" />

        <article className="bg-card mx-auto my-4 flex h-[calc(100%-32px)] w-[calc(100%-32px)] max-w-[528px] flex-col rounded-[24px] border border-foreground/10 p-6 lg:hidden">
          <RoadmapCardBody item={currentItem} status={currentStatus} />
        </article>

        <div
          className="absolute left-1/2 hidden h-full items-center gap-6 transition-transform duration-500 ease-out lg:flex"
          style={{
            transform: `translateX(-${currentIndex * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2}px)`,
          }}
        >
          {roadmapEvents.map((item, index) => {
            const status = getStatus(item);
            const isCurrent = index === currentIndex;
            return (
              <button
                aria-label={`Show ${formatPeriod(item)} roadmap item`}
                key={`${item.year}-${item.periodType}-${item.periodNumber}`}
                onClick={() => setCurrentIndex(index)}
                type="button"
                className={cn(
                  'bg-card flex h-[342px] w-[360px] shrink-0 cursor-pointer flex-col justify-between rounded-[24px] border border-foreground/10 p-6 text-left transition duration-500 ease-out',
                  isCurrent
                    ? 'scale-100 opacity-100'
                    : 'scale-[0.92] opacity-45 hover:scale-[0.95] hover:opacity-65'
                )}
              >
                <RoadmapCardBody item={item} status={status} />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RoadmapCardBody({
  item,
  status,
}: {
  item: RoadmapEvent;
  status: ReturnType<typeof getStatus>;
}) {
  return (
    <div>
      <span
        className={cn(
          'inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[13px] leading-4',
          status.badge,
          status.text
        )}
      >
        <span className={cn('h-2 w-2 rounded-full', status.dot)} />
        {status.label}
      </span>
      <h3 className="text-altitude-black dark:text-white mt-3 text-[44px] font-semibold leading-[44px] tracking-[-0.02em]">
        {formatPeriod(item)}
      </h3>
      <ul className="mt-7 grid gap-3">
        {item.events.map((event) => {
          const dot = event.isChecked
            ? 'bg-emerald-500'
            : status.label === 'In progress'
              ? 'bg-amber-500'
              : 'bg-foreground/25';
          return (
            <li className="flex items-start gap-3 text-[15px] leading-5" key={event.title}>
              <span className={cn('mt-[7px] h-2 w-2 shrink-0 rounded-full', dot)} />
              <span
                className={
                  event.isChecked ? 'text-altitude-black dark:text-white' : 'text-foreground/55'
                }
              >
                {event.title}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
