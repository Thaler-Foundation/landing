'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export function CopyButton({
  label,
  text,
  url,
  className,
  children,
}: {
  label: string;
  text?: string;
  url?: string;
  className?: string;
  children?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const value = url ? await fetch(url).then((r) => r.text()) : (text ?? '');
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button type="button" onClick={copy} className={className}>
      <span className={cn(copied && 'hidden')}>{label}</span>
      <span className={cn(!copied && 'hidden')}>Copied!</span>
      {children}
    </button>
  );
}
