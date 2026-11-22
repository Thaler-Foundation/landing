import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleGallery } from '@/components/blog/ArticleGallery';
import { MediaChrome } from '@/components/blog/MediaChrome';
import { XPost } from '@/components/blog/XPost';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import { formatPostDate, getPost, getPosts, renderPost } from '@/lib/blog';
import { poppins } from '@/lib/fonts';
import { LocaleProvider } from '@/lib/i18n/context';
import { getSEOTags } from '@/lib/seo';
import { cn } from '@/lib/utils/cn';

import type { Metadata } from 'next';

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};

  return getSEOTags({
    title: post.title,
    description: post.excerpt,
    canonicalUrlRelative: `/blog/${post.slug}`,
    openGraph: { url: `/blog/${post.slug}`, images: [{ url: post.image }] },
  });
}

export default async function BlogPostPage(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <LocaleProvider>
      <div className="bg-background text-foreground min-h-screen overflow-x-hidden font-[family-name:var(--font-geist)]">
        <ScrollReveal />
        <Suspense>
          <Header />
        </Suspense>

        <main className={cn(poppins.className, 'pt-36 pb-28 text-white lg:pt-44')}>
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <article className="mx-auto max-w-3xl">
              <Link
                href="/blog"
                className="text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                ← All blogs
              </Link>
              <p className="mt-10 text-sm text-white/60 sm:text-base">
                <time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.tag}
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[56px]">
                {post.title}
              </h1>
              <ArticleGallery>
                <div className="relative mt-12 aspect-[5/2] w-full overflow-hidden bg-white/5">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    priority
                    data-full={post.image}
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="object-cover"
                    style={{ objectPosition: post.imagePosition ?? 'center' }}
                  />
                </div>
                <div className="blog-prose mt-12">
                  {renderPost(post).map((part, i) =>
                    'tweet' in part ? (
                      <XPost key={i} id={part.tweet} />
                    ) : (
                      <div
                        key={i}
                        className="contents"
                        dangerouslySetInnerHTML={{ __html: part.html }}
                      />
                    )
                  )}
                </div>
                <MediaChrome />
              </ArticleGallery>
            </article>
          </div>
        </main>

        <Footer />
      </div>
    </LocaleProvider>
  );
}
