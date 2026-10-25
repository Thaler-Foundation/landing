import Image from 'next/image';
import Link from 'next/link';
import { CardText } from '@/components/blog/CardText';
import { formatPostDate, type BlogPost } from '@/lib/blog';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block min-w-0 text-white">
      <time dateTime={post.date} className="block pb-4 text-center text-base sm:text-lg">
        {formatPostDate(post.date)}
      </time>
      <div className="relative aspect-[5/2] w-full overflow-hidden bg-white/5">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(min-width: 768px) 640px, 100vw"
          className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
          style={{ objectPosition: post.imagePosition ?? 'center' }}
        />
      </div>
      <CardText title={post.title} excerpt={post.excerpt} />
    </Link>
  );
}

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-24 lg:gap-x-12">
      {posts.map((post, index) => (
        <div key={post.slug} data-reveal="scale" data-reveal-delay={(index % 2) + 1}>
          <BlogCard post={post} />
        </div>
      ))}
    </div>
  );
}
