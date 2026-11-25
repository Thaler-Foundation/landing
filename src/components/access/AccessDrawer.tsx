'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '@/components/ui/drawer';
import { InviteInput } from '@/components/access/InviteInput';
import { InviteDither } from '@/components/access/InviteDither';
import { poppins } from '@/lib/fonts';
import { cn } from '@/lib/utils/cn';

const AccessDrawerContext = createContext<(open: boolean) => void>(() => {});

export function useAccessDrawer() {
  return useContext(AccessDrawerContext);
}

export function AccessDrawerTrigger(props: React.ComponentProps<'button'>) {
  const setOpen = useAccessDrawer();
  return (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        setOpen(true);
      }}
    />
  );
}

function Invite({ setOpen }: { setOpen: (open: boolean) => void }) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;
    const timer = setTimeout(() => setOpen(false), 2000);
    return () => clearTimeout(timer);
  }, [email, setOpen]);

  return (
    <div className="w-full">
      <DrawerTitle
        className={cn(
          poppins.className,
          'text-[32px] leading-none font-semibold tracking-[-0.05em] text-white lg:text-[40px] xl:text-[48px]'
        )}
      >
        {email ? 'You’re on the list' : 'Get Your Invite'}
      </DrawerTitle>
      {email ? (
        <DrawerDescription className="mt-4 text-base text-white/60">
          We’ll email <span className="text-white">{email}</span> when your invite is ready.
        </DrawerDescription>
      ) : (
        <>
          <DrawerDescription className="sr-only">
            Enter your email to request an invite to Thaler.
          </DrawerDescription>
          <div className="mt-5 lg:mt-6">
            <InviteInput onSuccess={setEmail} />
          </div>
        </>
      )}
    </div>
  );
}

export function AccessDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <AccessDrawerContext.Provider value={setOpen}>
      {children}
      <Drawer open={open} onOpenChange={setOpen} direction="top">
        <DrawerContent className="h-dvh overflow-y-auto">
          <div
            onClick={(e) => {
              if (!(e.target as Element).closest('[data-keep-open]')) setOpen(false);
            }}
            className="flex min-h-full items-center justify-center px-6 py-16 sm:px-10"
          >
            <div className="flex w-full max-w-[460px] flex-col gap-8 md:max-w-[1190px] md:flex-row md:items-center md:gap-[8%] lg:w-[60vw]">
              <div
                data-keep-open
                className="relative aspect-[635/490] w-full shrink-0 overflow-hidden md:w-[53%]"
              >
                <InviteDither />
                <Image
                  src="/logo.svg"
                  alt="thaler"
                  width={102}
                  height={24}
                  className="absolute top-1/2 left-1/2 h-auto w-[63%] -translate-x-1/2 -translate-y-1/2"
                />
              </div>
              <div data-keep-open className="min-w-0 flex-1">
                <Invite setOpen={setOpen} />
              </div>
            </div>
          </div>
          <DrawerClose
            aria-label="Close"
            className="absolute top-3 right-3 p-2 text-white transition-opacity hover:opacity-70 md:top-5 md:right-5"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-6"
            >
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </DrawerClose>
          <div
            aria-hidden
            className="absolute bottom-2 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-white/25 [@media(hover:hover)]:hidden"
          />
        </DrawerContent>
      </Drawer>
    </AccessDrawerContext.Provider>
  );
}
