'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

const COLS = [18, 50, 82];
const SLOTS = [0, 1, 2, 3].flatMap((r) => COLS.map((x) => [x, 14 + r * 24]));

type Logo = {
  name: string;
  by: string;
  about: string;
  href?: string;
  src: string;
  x: number;
  y: number;
  w: number;
  h?: number;
  m?: number;
};

const lst = ([name, by, file, about, href]: string[], i: number): Logo => ({
  name,
  by,
  about,
  href,
  src: `/venues/lst/${file}.png`,
  x: SLOTS[i][0],
  y: SLOTS[i][1],
  w: 24,
});

const BOXES: {
  name: string;
  bg: string;
  left: number;
  width: number;
  cols: number;
  logos: Logo[];
}[] = [
  {
    name: 'Liquid staking',
    bg: '/yield-box-top.png',
    left: 0,
    width: 46,
    cols: 4,
    logos: [
      [
        'jitoSOL',
        'Jito',
        'jitosol',
        "Jito's staking token. Earns MEV tips on top of staking rewards.",
        'https://www.jito.network/staking/',
      ],
      [
        'mSOL',
        'Marinade',
        'msol',
        "Marinade's staking token, delegated across hundreds of validators.",
        'https://marinade.finance',
      ],
      [
        'PSOL',
        'Phantom',
        'psol',
        "Phantom's staking token, with MEV and fee rewards included.",
        'https://phantom.com/learn/blog/phantom-staked-sol-psol',
      ],
      [
        'lanternSOL',
        'Lantern',
        'lanternsol',
        'Staked with the Lantern validator.',
        'https://lantern.one',
      ],
      [
        'STKESOL',
        'SOL Strategies',
        'stkesol',
        "SOL Strategies' token, staked across dozens of validators ranked by Stakewiz.",
        'https://solstrategies.io',
      ],
      [
        'hSOL',
        'Helius',
        'hsol',
        "Staked with Helius, the RPC provider's own validator.",
        'https://www.helius.dev/staking',
      ],
      [
        'bSOL',
        'BlazeStake',
        'blazesol',
        "BlazeStake's token, spread across a wide validator set.",
        'https://stake.solblaze.org',
      ],
      ['jupSOL', 'Jupiter', 'jupsol', "Staked with Jupiter's validator.", 'https://jup.ag'],
      [
        'INF',
        'Sanctum',
        'infsol',
        "Sanctum's basket of staking tokens. Also earns fees from swaps between them.",
        'https://sanctum.so',
      ],
      [
        'rkuSOL',
        'Raiku',
        'rkusol',
        "Raiku's token. Adds blockspace auction revenue to staking rewards.",
        'https://raiku.com',
      ],
      [
        'strongSOL',
        'Stronghold',
        'strongsol',
        'Staked with the Stronghold validator.',
        'https://www.strongholdsol.com',
      ],
      [
        'vSOL',
        'The Vault',
        'vsol',
        "The Vault's staking token, spread across validators.",
        'https://thevault.finance',
      ],
    ].map(lst),
  },
  {
    name: 'Perpetuals',
    bg: '/yield-box-center.png',
    left: 50.5,
    width: 20,
    cols: 4,
    logos: [
      {
        name: 'Pacifica',
        by: 'Perps exchange',
        about: 'Solana perps with a fast, exchange-style order book.',
        href: 'https://pacifica.fi',
        src: '/venues/perps/pacifica.png',
        x: 50,
        y: 12,
        w: 41,
        m: 0.65,
      },
      {
        name: 'Phoenix',
        by: 'Perps exchange',
        about: 'A fully on-chain order book on Solana.',
        href: 'https://phoenix.trade',
        src: '/venues/perps/phoenix.svg',
        x: 50,
        y: 37.5,
        w: 60,
        m: 1.08,
      },
      {
        name: 'Bulk',
        by: 'Perps exchange',
        about: 'A perps order book that runs inside Solana validators.',
        href: 'https://bulk.trade',
        src: '/venues/perps/bulk.svg',
        x: 50,
        y: 62.5,
        w: 60,
        m: 1.3,
      },
      {
        name: 'Bullet',
        by: 'Perps exchange',
        about: 'Solana perps from the Zeta Markets team, running on a fast network extension.',
        href: 'https://bullet.xyz',
        src: '/venues/perps/bullet.png',
        x: 50,
        y: 88,
        w: 60,
      },
    ],
  },
  {
    name: 'Lending',
    bg: '/yield-box-bottom.png',
    left: 75,
    width: 25,
    cols: 2,
    logos: [
      {
        name: 'Kamino',
        by: 'Lending',
        about: 'Lending, borrowing, and leveraged loops on Solana.',
        href: 'https://kamino.com/multiply',
        src: '/venues/lending/kamino.png',
        x: 50,
        y: 28,
        w: 57,
        h: 164 / 115,
      },
      {
        name: 'Jupiter Lend',
        by: 'Lending',
        about: "Jupiter's lending and borrowing markets.",
        href: 'https://jup.ag/lend/borrow/multiply',
        src: '/venues/lending/juplend.png',
        x: 50,
        y: 72,
        w: 80,
      },
    ],
  },
];

const align = (i: number, cols: number) =>
  i % cols === 0 ? 'start' : i % cols === cols - 1 ? 'end' : 'center';

export function YieldSourcesStrip() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!(e.target as Element).closest('.yield-logo')) setActive(null);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  return (
    <div className="yield-sources relative">
      {BOXES.map((box, i) => (
        <div
          key={box.name}
          role="group"
          aria-label={box.name}
          className="yield-box bg-cover bg-center"
          style={
            {
              backgroundImage: `url(${box.bg})`,
              '--left': `${box.left}%`,
              '--width': `${box.width}%`,
              '--cols': box.cols,
            } as React.CSSProperties
          }
        >
          {box.logos.map((logo, j) => (
            <div
              key={logo.name}
              data-active={active === logo.name || undefined}
              className="yield-logo"
              style={
                {
                  '--x': `${logo.x}%`,
                  '--y': `${logo.y}%`,
                  '--w': `${logo.w}%`,
                  '--m': logo.m,
                } as React.CSSProperties
              }
            >
              <button
                type="button"
                aria-label={`${logo.name}, ${logo.by}`}
                onClick={() => setActive((a) => (a === logo.name ? null : logo.name))}
                className="block h-full w-full cursor-pointer"
              >
                <Image
                  src={logo.src}
                  alt=""
                  width={256}
                  height={Math.round(256 * (logo.h ?? 1))}
                  className={cn(i === 0 && 'rounded-full')}
                />
              </button>
              <span data-align={align(j, box.cols)} className="yield-tip">
                <span className="block font-medium text-white">
                  {logo.name} <span className="text-white/50">· {logo.by}</span>
                </span>
                <span className="mt-1 block text-white/70">{logo.about}</span>
                {logo.href && (
                  <a
                    href={logo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-early-access mt-2 flex items-center gap-[0.45em] font-medium leading-none text-white"
                  >
                    <span
                      aria-hidden
                      className="cta-early-access-arrow h-[0.75em] w-[0.75em] bg-current"
                    />
                    <span className="cta-early-access-label">
                      {new URL(logo.href).hostname.replace(/^www\./, '')}
                    </span>
                  </a>
                )}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
