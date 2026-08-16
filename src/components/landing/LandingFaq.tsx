'use client';

import { useState } from 'react';

export type FaqItem = { question: string; answer: string };

export const LANDING_FAQS: FaqItem[] = [
  {
    question: 'What is Thaler?',
    answer:
      'Thaler is a non-custodial yield protocol on Solana. You deposit SOL, USDC, or other stablecoins into a vault that only you control, and it earns a consistent return whether the market rises or falls. Your keys and your funds never leave your custody.',
  },
  {
    question: 'How is the yield generated?',
    answer:
      'A single automated strategy combines three on-chain sources. Liquid staking provides a steady baseline, lending markets add carry income, and a hedged perpetual position captures funding while neutralizing price exposure. The yield comes from real market activity, not token incentives.',
  },
  {
    question: 'Is Thaler custodial?',
    answer:
      'No. Each vault is an independent Squads Smart Account owned entirely by your wallet, governed by policies enforced on-chain at creation. No party, including Thaler, can move, redirect, or freeze your funds.',
  },
  {
    question: 'What are the risk profiles?',
    answer:
      'At vault creation you select one of six risk profiles, from Conservative to Aggressive. Your choice sets how the strategy allocates capital across staking, lending, and perpetual markets, and it is fixed for the life of that vault. You can run several vaults with different profiles side by side.',
  },
  {
    question: 'How do I claim my yield?',
    answer:
      'Claim manually whenever it suits you, or schedule automatic claims on a weekly or monthly basis. Each claim settles to your wallet in full or not at all, so what you confirm is exactly what you receive.',
  },
  {
    question: 'What is the floor yield?',
    answer:
      'The strategy is built around a structural floor near 8% APY, drawn from its most stable components, staking and liquidity provision, which holds even when the broader market declines. Total yield typically ranges from 8.2% to 20% APY depending on the risk profile you choose.',
  },
  {
    question: 'Which assets can I deposit?',
    answer:
      'You can deposit SOL, USDC, or other supported stablecoins. Your position is then tracked transparently on-chain in real time.',
  },
  {
    question: 'Who is Thaler for?',
    answer:
      'Thaler serves anyone with idle capital to put to work, from individuals growing personal savings to DAOs, treasuries, wealth managers, and DeFi protocols. Every depositor keeps full self-custody and an isolated, independently verifiable vault.',
  },
];

export function LandingFaq({ items = LANDING_FAQS }: { items?: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <section
      className="bg-background flex w-full justify-center px-6 py-16 sm:px-8 lg:py-24"
      id="faq"
    >
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <div className="grid w-full max-w-7xl gap-8 lg:grid-cols-2 lg:gap-6">
        <div className="lg:pb-0" data-reveal="left">
          <h2 className="text-altitude-black dark:text-white text-[34px] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-[48px] lg:text-[56px]">
            Questions?
            <br />
            Answers.
          </h2>
        </div>

        <div data-reveal="right" data-reveal-delay="1">
          {items.map((faq, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;
            return (
              <div className="group border-b border-foreground/10" key={faq.question}>
                <button
                  aria-controls={answerId}
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  type="button"
                  className="flex w-full cursor-pointer gap-6 py-5 text-left transition-colors duration-200 ease-out hover:opacity-70 focus-visible:outline-none"
                >
                  <span className="text-foreground relative mt-0.5 h-6 w-6 shrink-0">
                    <span className="bg-current absolute left-[1.7px] top-[10.7px] h-[2.6px] w-[20.6px] rounded-full transition-transform duration-300 ease-out" />
                    <span
                      className={`bg-current absolute left-[10.7px] top-[1.7px] h-[20.6px] w-[2.6px] rounded-full transition duration-300 ease-out ${
                        isOpen ? 'scale-y-0 opacity-0' : 'scale-y-100 opacity-100'
                      }`}
                    />
                  </span>
                  <span className="text-altitude-black dark:text-white block min-w-0 text-xl font-medium leading-[1.15] sm:text-[22px]">
                    {faq.question}
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                  id={answerId}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="text-foreground/55 max-w-xl pb-6 pl-11 text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
