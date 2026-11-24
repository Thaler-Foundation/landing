import Image from 'next/image';
import config from '@/config';

function AndroidIcon() {
  return (
    <svg viewBox="0 -960 960 960" aria-hidden className="h-[1em] w-[1em] fill-current">
      <path d="M40-240q9-107 65.5-197T256-580l-74-128q-6-9-3-19t13-15q8-5 18-2t16 12l74 128q86-36 180-36t180 36l74-128q6-9 16-12t18 2q10 5 13 15t-3 19l-74 128q94 53 150.5 143T920-240H40Zm240-110q21 0 35.5-14.5T330-400q0-21-14.5-35.5T280-450q-21 0-35.5 14.5T230-400q0 21 14.5 35.5T280-350Zm400 0q21 0 35.5-14.5T730-400q0-21-14.5-35.5T680-450q-21 0-35.5 14.5T630-400q0 21 14.5 35.5T680-350Z" />
    </svg>
  );
}

export function SeedVaultBanner() {
  const content = (
    <>
      <Image
        src="/mobile/seed-vault.webp"
        alt=""
        fill
        priority
        unoptimized
        className="-z-10 object-cover"
      />
      <span className="flex items-center gap-[0.4em] text-xl font-semibold leading-none tracking-[-0.05em] sm:text-[40px]">
        <span aria-hidden className="cta-early-access-arrow h-[1.1em] w-[1.1em] bg-current" />
        <span className="cta-early-access-label">Download Now</span>
        <img src="/mobile/seeker-s.svg" alt="Seeker" className="ml-[0.2em] h-[0.8em] w-auto" />
        <AndroidIcon />
      </span>
    </>
  );
  const className =
    'cta-early-access relative isolate flex h-60 items-center justify-center overflow-hidden sm:h-auto sm:aspect-[1070/250]';

  if (!config.seekerApp) return <div className={className}>{content}</div>;
  return (
    <a href={config.seekerApp} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  );
}
