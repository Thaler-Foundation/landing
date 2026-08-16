'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from '@/lib/i18n/context';
import { cn } from '@/lib/utils/cn';

interface HeroWaitlistFormProps {
  className?: string;
}

export function HeroWaitlistForm({ className }: HeroWaitlistFormProps) {
  const { t } = useTranslations('hero');
  const { t: tw } = useTranslations('waitlist');
  const [inputValue, setInputValue] = useState('');
  const [saved, setSaved] = useState<string | null>(null);

  const {
    mutate: submit,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/waitlist/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputValue }),
      });
      const text = await res.text();
      let data: { ok?: boolean; error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }
      if (!res.ok) {
        throw new Error(data.error ?? `Failed to save email (${res.status})`);
      }
    },
    onSuccess: () => {
      setSaved(inputValue.trim().toLowerCase());
    },
  });

  if (saved) {
    return (
      <div className={cn('w-full max-w-sm', className)}>
        <div className="border-foreground/10 bg-foreground/[0.03] flex items-center gap-3 rounded-full border px-5 py-3">
          <span className="bg-foreground text-background grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px]">
            ✓
          </span>
          <span className="text-foreground/70 truncate text-sm">{saved}</span>
        </div>
        <p className="text-foreground/45 mt-2.5 text-xs leading-relaxed">
          You&rsquo;re on the list — we&rsquo;ll email you when your vault is ready.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('w-full max-w-sm', className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (inputValue.trim() && !isPending) submit();
        }}
        className="border-foreground/15 focus-within:border-foreground/40 bg-background flex items-center gap-2 rounded-full border py-1.5 pr-1.5 pl-5 transition-colors"
      >
        <input
          type="email"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={tw('email.placeholder')}
          disabled={isPending}
          className={cn(
            'min-w-0 flex-1 bg-transparent outline-none',
            'text-sm text-foreground',
            'placeholder:text-foreground/30',
            'disabled:opacity-50'
          )}
        />
        <button
          type="submit"
          className={cn(
            'bg-foreground text-background shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap',
            'transition duration-150 ease-out hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0',
            'disabled:cursor-not-allowed disabled:opacity-40',
            'focus-visible:outline-none'
          )}
          disabled={isPending}
        >
          {isPending ? tw('email.saving') : t('cta')}
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-red-500">{error.message}</p>}
    </div>
  );
}
