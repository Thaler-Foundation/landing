import { describe, it, expect, afterEach } from 'bun:test';
import { getCoingeckoUrl, getHermesEndpoint, getThalerApiBaseUrl } from '../external-urls';

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  // Restore env to avoid cross-test pollution.
  for (const k of Object.keys(process.env)) {
    if (!(k in ORIGINAL_ENV)) delete process.env[k];
    else process.env[k] = ORIGINAL_ENV[k];
  }
});

describe('getCoingeckoUrl', () => {
  it('returns the default when env is unset', () => {
    delete process.env.COINGECKO_URL;
    expect(getCoingeckoUrl()).toMatch(/^https:\/\/api\.coingecko\.com/);
  });

  it('returns the env override when set', () => {
    process.env.COINGECKO_URL = 'https://custom.example.com/api';
    expect(getCoingeckoUrl()).toBe('https://custom.example.com/api');
  });
});

describe('getHermesEndpoint', () => {
  it('returns the default when env is unset', () => {
    delete process.env.NEXT_PUBLIC_HERMES_ENDPOINT;
    expect(getHermesEndpoint()).toBe('https://hermes.pyth.network');
  });

  it('returns the env override when set', () => {
    process.env.NEXT_PUBLIC_HERMES_ENDPOINT = 'https://custom.hermes.dev';
    expect(getHermesEndpoint()).toBe('https://custom.hermes.dev');
  });
});

describe('getThalerApiBaseUrl', () => {
  it('returns the env override when set', () => {
    process.env.THALER_API_BASE_URL = 'https://api.example.com';
    expect(getThalerApiBaseUrl()).toBe('https://api.example.com');
  });

  it('falls back to NEXT_PUBLIC_API_BASE_URL when THALER_API_BASE_URL is unset', () => {
    delete process.env.THALER_API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.public.com';
    expect(getThalerApiBaseUrl()).toBe('https://api.public.com');
  });

  it('falls back to localhost when nothing is set', () => {
    delete process.env.THALER_API_BASE_URL;
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
    expect(getThalerApiBaseUrl()).toBe('http://localhost:4001');
  });
});
