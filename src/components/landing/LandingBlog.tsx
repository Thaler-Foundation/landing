'use client';

import Link from 'next/link';
import { blogPosts } from '@/data/blog';

export function LandingBlog() {
  const posts = blogPosts.slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section
      className="bg-background flex w-full justify-center px-6 py-16 sm:px-8 lg:py-24"
      id="blog"
    >
      <div className="w-full max-w-7xl">
        <div className="flex items-end justify-between gap-6 pb-10 lg:pb-12" data-reveal="left">
          <h2 className="text-altitude-black dark:text-white max-w-[10ch] text-[34px] font-semibold leading-[1.02] tracking-[-0.02em] sm:max-w-none sm:text-[48px] lg:text-[56px]">
            Latest from our team
          </h2>
          <Link
            href="/blog"
            className="text-foreground/60 hover:text-foreground hidden shrink-0 items-center gap-2 text-sm font-medium transition-colors sm:inline-flex"
          >
            View all
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <a
              className="group block min-w-0 no-underline focus-visible:outline-none"
              data-reveal="scale"
              data-reveal-delay={index + 1}
              href={post.link}
              key={post.title}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className={`relative aspect-video w-full overflow-hidden rounded-[24px] ${
                  post.image ? '' : 'bg-foreground text-background p-6'
                }`}
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className={`absolute inset-0 h-full w-full transition duration-300 ease-out group-hover:scale-[1.03] ${
                      post.imageFit === 'contain' ? 'object-contain' : 'object-cover'
                    }`}
                  />
                ) : (
                  <>
                    <svg
                      viewBox="0 0 1024 1024"
                      className="absolute right-6 top-6 h-9 w-9"
                      fill="currentColor"
                      fillRule="evenodd"
                      aria-hidden
                    >
                      <path d="M 513.5 131.5 A 378 378 0 1 1 513.5 887.5 A 378 378 0 1 1 513.5 131.5 M 513.5 173.5 A 336 336 0 1 0 513.5 845.5 A 336 336 0 1 0 513.5 173.5 Z" />
                      <path d="M 513 244 L 274 666 L 749 666 Z M 509 361 L 643 614 L 373 615 Z" />
                    </svg>
                    <span className="absolute bottom-6 left-6 max-w-[300px] text-[26px] font-semibold leading-[1.05]">
                      {post.title}
                    </span>
                  </>
                )}
                <div className="pointer-events-none absolute inset-0 transition duration-300 ease-out group-hover:bg-background/[0.06]" />
              </div>
              <div className="flex flex-col gap-2 pb-4 pr-8 pt-5">
                <h3 className="text-altitude-black dark:text-white line-clamp-2 text-[22px] font-medium leading-[1.15]">
                  {post.title}
                </h3>
                <p className="text-foreground/50 text-base font-normal">{post.tag}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
