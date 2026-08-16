import Link from 'next/link';
import { Suspense } from 'react';
import { blogPosts } from '@/data/blog';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import { LocaleProvider } from '@/lib/i18n/context';
import { getSEOTags } from '@/lib/seo';

import type { Metadata } from 'next';

export const metadata: Metadata = getSEOTags({
  title: 'Blog',
  description: 'Updates, guides, and protocol notes from the Thaler team.',
});

export default function BlogPage() {
  return (
    <LocaleProvider>
      <div className="bg-background text-foreground min-h-screen overflow-x-hidden font-[family-name:var(--font-geist)]">
        <ScrollReveal />
        <Suspense>
          <Header />
        </Suspense>

        <main className="flex w-full justify-center px-6 pt-36 pb-24 sm:px-8 lg:pt-44">
          <div className="w-full max-w-7xl">
            <header className="border-foreground/10 border-b pb-12" data-reveal="left">
              <span className="text-foreground/50 inline-flex items-center gap-2 text-sm font-medium tracking-tight">
                <span className="bg-foreground/40 h-1.5 w-1.5 rounded-full" />
                Thaler Blog
              </span>
              <h1 className="text-altitude-black dark:text-white mt-5 max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.03em] sm:text-7xl">
                Latest from
                <br />
                our team
              </h1>
              <p className="text-foreground/55 mt-6 max-w-md text-base leading-relaxed sm:text-lg">
                Protocol updates, strategy deep-dives, and notes on building non-custodial yield on
                Solana.
              </p>
            </header>

            <div className="grid gap-x-6 gap-y-12 pt-14 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post, index) => (
                <a
                  key={post.title}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block min-w-0 no-underline focus-visible:outline-none"
                  data-reveal="scale"
                  data-reveal-delay={(index % 3) + 1}
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
                    <h2 className="text-altitude-black dark:text-white line-clamp-2 text-[22px] font-medium leading-[1.15]">
                      {post.title}
                    </h2>
                    <p className="text-foreground/50 text-base">{post.tag}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="pt-16" data-reveal="fade">
              <Link
                href="/"
                className="text-foreground/60 hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
              >
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
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Back to home
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </LocaleProvider>
  );
}
