import Link from 'next/link';
import { BlogGrid } from '@/components/blog/BlogCard';
import { getPosts } from '@/lib/blog';
import { poppins } from '@/lib/fonts';
import { cn } from '@/lib/utils/cn';

export function LandingBlog() {
  const posts = getPosts().slice(0, 2);
  if (posts.length === 0) return null;

  return (
    <section className={cn(poppins.className, 'py-28 text-white')} id="blog">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex items-center justify-between gap-6 pb-10 lg:pb-12" data-reveal="left">
          <h2 className="text-4xl font-semibold leading-none tracking-[-0.03em] sm:text-[48px]">
            Latest Blogs
          </h2>
          <Link
            href="/blog"
            className="cta-early-access cta-see-all inline-flex shrink-0 items-center gap-[0.55em] text-base font-semibold uppercase sm:text-lg"
          >
            <span className="cta-early-access-label">See all</span>
            <span aria-hidden className="cta-early-access-arrow h-[1.1em] w-[1.1em] bg-current" />
          </Link>
        </div>
        <BlogGrid posts={posts} />
      </div>
    </section>
  );
}
