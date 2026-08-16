/**
 * Waitlist session cookie — a short-lived HMAC-signed token that proves
 * the current browser session has verified ownership of a Solana wallet.
 *
 * Uses the Web Crypto API (HMAC-SHA256) directly — no extra dependencies.
 * Reuses NEON_AUTH_COOKIE_SECRET with a "wl:" namespace prefix so the
 * two systems don't share key material.
 */

import { type NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'wl_session';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours
const NAMESPACE = 'wl:';

export interface WlSession {
  walletAddress: string;
  // Verified email (from Privy) used as the beta-gate lookup key. Older
  // pre-SP6 cookies deserialize with `email: ''` here, which fails the
  // allowlist check and forces a fresh sign-in — bounded by the 24h TTL.
  email: string;
  verifiedAt: string; // ISO string
  exp: number; // Unix epoch seconds
}

// ---------------------------------------------------------------------------
// Helpers — Buffer → plain ArrayBuffer for Web Crypto API (TS 5.9+ strictness)
// ---------------------------------------------------------------------------

function toArrayBuffer(buf: Buffer): ArrayBuffer {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

async function getKey(): Promise<CryptoKey> {
  const raw = Buffer.from(NAMESPACE + process.env.NEON_AUTH_COOKIE_SECRET!, 'utf8');
  return crypto.subtle.importKey(
    'raw',
    toArrayBuffer(raw),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

// ---------------------------------------------------------------------------
// Sign / verify
// ---------------------------------------------------------------------------

export async function signWlSession(payload: Omit<WlSession, 'exp'>): Promise<string> {
  const full: WlSession = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE,
  };
  // data = base64url(JSON) — the string we include verbatim in the token
  const data = Buffer.from(JSON.stringify(full), 'utf8').toString('base64url');
  const key = await getKey();
  // HMAC is computed over the UTF-8 bytes of the data string itself
  const sig = await crypto.subtle.sign('HMAC', key, toArrayBuffer(Buffer.from(data, 'utf8')));
  return `${data}.${Buffer.from(sig).toString('base64url')}`;
}

export async function verifyWlSession(token: string): Promise<WlSession | null> {
  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;

  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const key = await getKey();
  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    toArrayBuffer(Buffer.from(sig, 'base64url')),
    toArrayBuffer(Buffer.from(data, 'utf8'))
  );
  if (!valid) return null;

  let raw: Partial<WlSession>;
  try {
    raw = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  // Backwards-compat: pre-SP6 cookies have no `email` field. Default to ''
  // so the downstream allowlist check rejects them (the user re-signs in
  // and gets a fresh cookie with their Privy email).
  const payload: WlSession = {
    walletAddress: typeof raw.walletAddress === 'string' ? raw.walletAddress : '',
    email: typeof raw.email === 'string' ? raw.email : '',
    verifiedAt: typeof raw.verifiedAt === 'string' ? raw.verifiedAt : '',
    exp: typeof raw.exp === 'number' ? raw.exp : 0,
  };

  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

// ---------------------------------------------------------------------------
// Cookie read/write helpers
// ---------------------------------------------------------------------------

export async function readWlSession(request: NextRequest): Promise<WlSession | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyWlSession(token);
}

export function setWlSessionCookie(response: NextResponse, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production';
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export function clearWlSessionCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}
