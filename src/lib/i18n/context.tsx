'use client';

import { createContext, useContext, useState } from 'react';
import enMessages from '@/messages/en.json';
import esMessages from '@/messages/es.json';

// ─── Locale registry ──────────────────────────────────────────────────────────

export const LOCALES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
] as const;

export type Locale = (typeof LOCALES)[number]['code'];

const MESSAGES: Record<Locale, Record<string, unknown>> = {
  en: enMessages,
  es: esMessages,
};

// ─── Translation context ──────────────────────────────────────────────────────

type Messages = Record<string, unknown>;

const I18nContext = createContext<Messages>({});

function TranslationProvider({
  messages,
  children,
}: {
  messages: Messages;
  children: React.ReactNode;
}) {
  return <I18nContext.Provider value={messages}>{children}</I18nContext.Provider>;
}

// ─── Locale context ───────────────────────────────────────────────────────────

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <TranslationProvider messages={MESSAGES[locale]}>{children}</TranslationProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}

// ─── Translation hook ─────────────────────────────────────────────────────────

function resolve(obj: unknown, keyPath: string): unknown {
  const parts = keyPath.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || typeof current !== 'object' || Array.isArray(current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/**
 * Access translations for a given namespace.
 *
 * t(key)  — returns a string value for a dot-notation key, falls back to the key itself.
 * ta(key) — returns a string array value for a dot-notation key, falls back to [].
 */
export function useTranslations(namespace: string) {
  const messages = useContext(I18nContext);
  const ns: unknown = messages[namespace] ?? {};

  function t(key: string): string {
    const value = resolve(ns, key);
    return typeof value === 'string' ? value : key;
  }

  function ta(key: string): string[] {
    const value = resolve(ns, key);
    if (Array.isArray(value)) {
      return (value as unknown[]).filter((v): v is string => typeof v === 'string');
    }
    return [];
  }

  return { t, ta };
}
