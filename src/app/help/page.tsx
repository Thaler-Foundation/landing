import { LandingFaq } from '@/components/landing/LandingFaq';
import { SubPage } from '@/components/layout/SubPage';
import config from '@/config';
import { getSEOTags } from '@/lib/seo';

import type { Metadata } from 'next';

export const metadata: Metadata = getSEOTags({
  title: 'Help & Support',
  description: 'Guides, answers, and ways to reach the Thaler team.',
  canonicalUrlRelative: '/help',
});

const docs = (slug: string) => `${config.docs}${slug}`;

const topics = [
  {
    title: 'Getting started',
    text: 'Meet Thaler, sign in with a social account, and make your first vault.',
    href: docs(''),
  },
  {
    title: 'Deposits & withdrawals',
    text: 'Move SOL or USDC into and out of your vault.',
    href: docs('create-vault'),
  },
  {
    title: 'Vaults & yield',
    text: 'Understand how vaults work and where returns come from.',
    href: docs('yield'),
  },
  {
    title: 'Wallet & security',
    text: 'Stay in control of your wallet and protect your funds.',
    href: docs('safety'),
  },
];

const contact = [
  { label: 'Contact support', href: 'mailto:support@thaler.finance' },
  { label: 'Read the docs', href: docs('') },
];

export default function HelpPage() {
  return (
    <SubPage>
      <section data-reveal="left">
        <h1 className="text-[52px] font-medium leading-[0.85] tracking-[-0.06em] sm:text-[clamp(52px,10.5vw,128px)]">
          <span className="tracking-[-0.0477em]">Help</span>
          <br />& Support
        </h1>
      </section>

      <section className="mt-28 lg:mt-40">
        <h2
          className="text-4xl font-medium leading-none tracking-[-0.03em] sm:text-[48px]"
          data-reveal="left"
        >
          Find the right place to start.
        </h2>
        <div className="mt-12 grid gap-x-12 gap-y-14 md:grid-cols-2 lg:mt-16" data-reveal="fade">
          {topics.map((t) => (
            <a
              key={t.title}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-see-all block"
            >
              <span className="flex items-center gap-[0.5em] text-2xl font-medium tracking-[-0.03em] sm:text-[32px]">
                <span className="cta-early-access-label">{t.title}</span>
                <span aria-hidden className="cta-early-access-arrow h-[0.9em] w-[0.9em] bg-current" />
              </span>
              <span className="mt-4 block text-base font-medium tracking-[-0.02em] text-white/70 sm:text-lg">
                {t.text}
              </span>
            </a>
          ))}
        </div>
      </section>

      <div className="-mx-6 mt-16 sm:-mx-8 lg:mt-24">
        <LandingFaq />
      </div>

      <section className="mt-16 lg:mt-24">
        <h2
          className="text-5xl font-medium leading-none tracking-[-0.03em] sm:text-[64px]"
          data-reveal="left"
        >
          Still need a hand?
        </h2>
        <p
          className="mt-8 max-w-2xl text-base font-medium leading-snug tracking-[-0.02em] sm:text-lg"
          data-reveal="left"
        >
          For a question about your vault or a transaction, reach out to the team. Have your public
          wallet address and transaction signature ready to share.
        </p>
        <div className="mt-10 flex flex-wrap gap-x-24 gap-y-6" data-reveal="left">
          {contact.map((c) => (
            <a
              key={c.label}
              href={c.href}
              {...(c.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
              className="cta-early-access flex items-center gap-[0.55em] text-xl font-semibold leading-none tracking-[-0.05em] sm:text-2xl"
            >
              <span aria-hidden className="cta-early-access-arrow h-[1.1em] w-[1.1em] bg-current" />
              <span className="cta-early-access-label">{c.label}</span>
            </a>
          ))}
        </div>
      </section>
    </SubPage>
  );
}
