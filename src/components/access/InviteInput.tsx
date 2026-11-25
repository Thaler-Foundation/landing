'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import config from '@/config';
import { cn } from '@/lib/utils/cn';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function requestInvite(email: string) {
  const res = await fetch('/api/waitlist/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data: { error?: string } = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Failed to save email (${res.status})`);
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6.5v7" />
      <circle cx="12" cy="17" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function InviteInput({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [invalid, setInvalid] = useState<string | null>(null);

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: requestInvite,
    onSuccess: (_, email) => onSuccess(email),
  });

  const message = invalid ?? error?.message ?? null;
  const filled = value.length > 0;

  const submit = () => {
    const email = value.trim().toLowerCase();
    if (!EMAIL.test(email)) return setInvalid('Enter a valid email address');
    mutate(email);
  };

  const clear = (
    <button
      type="button"
      aria-label="Clear email"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        setValue('');
        setInvalid(null);
        reset();
      }}
      className="shrink-0 text-white transition-opacity hover:opacity-70"
    >
      <ClearIcon />
    </button>
  );

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!isPending) submit();
      }}
      className={cn('w-full', isPending && 'opacity-40')}
    >
      <label htmlFor="invite-email" className="text-base text-white/60">
        Email
      </label>
      <div
        className={cn(
          'mt-2 flex h-12 items-center gap-3 border bg-background pr-2 pl-3 transition-[border-color,box-shadow] sm:h-14',
          message
            ? 'border-[#E5483B] shadow-[0_0_0_1px_#E5483B]'
            : focused
              ? 'border-[#5046E5] shadow-[0_0_0_1px_#5046E5]'
              : filled
                ? 'border-white'
                : 'border-white/70'
        )}
      >
        <input
          id="invite-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="email@email.com"
          value={value}
          disabled={isPending}
          aria-invalid={!!message}
          aria-describedby={message ? 'invite-error' : undefined}
          title={message ?? undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            setValue(e.target.value);
            setInvalid(null);
            reset();
          }}
          className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/50 sm:text-lg"
        />
        {focused && filled && !message && clear}
        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 bg-[#1F1F1F] px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#2A2A2A]"
        >
          Get Invite
        </button>
        {!focused && filled && !message && clear}
        {message && (
          <span className="shrink-0 text-[#E5483B]">
            <ErrorIcon />
          </span>
        )}
      </div>
      {message && (
        <p id="invite-error" role="alert" className="sr-only">
          {message}
        </p>
      )}
      <p className={cn('mt-2 text-base', message ? 'text-[#E5483B]' : 'text-white/60')}>
        Already approved?{' '}
        <a href={config.dashboard} className="underline underline-offset-4 hover:text-white">
          Login
        </a>
      </p>
    </form>
  );
}
