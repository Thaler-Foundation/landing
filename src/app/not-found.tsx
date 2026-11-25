import Link from 'next/link';
import { SubPage } from '@/components/layout/SubPage';

const links = [
  { label: 'Back to home', href: '/' },
  { label: 'Get help', href: '/help' },
];

export default function NotFound() {
  return (
    <SubPage>
      <div className="pb-12 lg:pb-16">
        <section data-reveal="left">
          <p className="text-lg font-medium leading-none tracking-[-0.03em] text-white/50 sm:text-2xl">
            404
          </p>
          <h1 className="mt-6 text-[52px] font-medium leading-[0.85] tracking-[-0.06em] sm:text-[clamp(52px,10.5vw,128px)]">
            Page
            <br />
            not found
          </h1>
          <p className="mt-10 max-w-2xl text-lg font-medium leading-snug tracking-[-0.03em] sm:text-2xl">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </section>

        <div className="mt-12 flex flex-wrap gap-x-24 gap-y-6" data-reveal="left">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="cta-early-access flex items-center gap-[0.55em] text-xl font-semibold leading-none tracking-[-0.05em] sm:text-2xl"
            >
              <span aria-hidden className="cta-early-access-arrow h-[1.1em] w-[1.1em] bg-current" />
              <span className="cta-early-access-label">{l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </SubPage>
  );
}
