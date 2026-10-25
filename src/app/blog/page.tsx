import { Suspense } from 'react';
import { BlogGrid } from '@/components/blog/BlogCard';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import { getPosts } from '@/lib/blog';
import { poppins } from '@/lib/fonts';
import { LocaleProvider } from '@/lib/i18n/context';
import { getSEOTags } from '@/lib/seo';
import { cn } from '@/lib/utils/cn';

import type { Metadata } from 'next';

export const metadata: Metadata = getSEOTags({
  title: 'Blog',
  description: 'Updates, guides, and protocol notes from the Thaler team.',
  canonicalUrlRelative: '/blog',
});

export default function BlogPage() {
  return (
    <LocaleProvider>
      <div className="bg-background text-foreground min-h-screen overflow-x-hidden font-[family-name:var(--font-geist)]">
        <ScrollReveal />
        <Suspense>
          <Header />
        </Suspense>

        <main className={cn(poppins.className, 'pt-36 pb-28 text-white lg:pt-44')}>
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="pb-10 lg:pb-12" data-reveal="left">
              <h1 className="text-5xl font-semibold leading-none tracking-[-0.03em] sm:text-[64px]">
                All Blogs
              </h1>
              <p className="mt-4 text-base font-medium leading-snug tracking-[-0.02em] text-white/70 sm:text-lg">
                Updates, guides, and protocol notes from the Thaler team.
              </p>
            </div>
            <BlogGrid posts={getPosts()} />
          </div>
        </main>

        <Footer />
      </div>
    </LocaleProvider>
  );
}
