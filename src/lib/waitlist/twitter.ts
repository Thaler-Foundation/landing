/**
 * X (Twitter) OAuth2 with PKCE helpers.
 *
 * Required env vars (server-side only — never NEXT_PUBLIC_):
 *   TWITTER_CLIENT_ID
 *   TWITTER_CLIENT_SECRET
 *
 * Uses the OAuth 2.0 Authorization Code flow with PKCE as required
 * by the X API v2 for confidential clients.
 */

const X_API_BASE = 'https://api.x.com';
const REDIRECT_URI_PATH = '/api/waitlist/twitter/callback';

function getRedirectUri(baseUrl: string): string {
  return `${baseUrl}${REDIRECT_URI_PATH}`;
}

// ---------------------------------------------------------------------------
// PKCE helpers (Web Crypto — SHA-256 / base64url)
// ---------------------------------------------------------------------------

/** Generate a random 64-byte code verifier (base64url-encoded). */
export function generateCodeVerifier(): string {
  const bytes = new Uint8Array(64);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString('base64url');
}

/** Derive the code challenge: base64url(SHA-256(codeVerifier)). */
export async function deriveCodeChallenge(codeVerifier: string): Promise<string> {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Buffer.from(digest).toString('base64url');
}

// ---------------------------------------------------------------------------
// Auth URL
// ---------------------------------------------------------------------------

export async function buildTwitterAuthUrl(
  state: string,
  codeVerifier: string,
  baseUrl: string
): Promise<string> {
  const codeChallenge = await deriveCodeChallenge(codeVerifier);
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.TWITTER_CLIENT_ID!,
    redirect_uri: getRedirectUri(baseUrl),
    scope: 'users.read tweet.read offline.access',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  return `https://x.com/i/oauth2/authorize?${params}`;
}

// ---------------------------------------------------------------------------
// Token exchange
// ---------------------------------------------------------------------------

export interface TwitterUser {
  id: string;
  name: string;
  username: string;
}

export async function exchangeTwitterCode(
  code: string,
  codeVerifier: string,
  baseUrl: string
): Promise<{ accessToken: string }> {
  // X requires Basic auth for confidential clients
  const credentials = Buffer.from(
    `${process.env.TWITTER_CLIENT_ID!}:${process.env.TWITTER_CLIENT_SECRET!}`
  ).toString('base64');

  const res = await fetch(`${X_API_BASE}/2/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: getRedirectUri(baseUrl),
      code_verifier: codeVerifier,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`X token exchange failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as { access_token: string };
  return { accessToken: data.access_token };
}

export async function getTwitterUser(accessToken: string): Promise<TwitterUser> {
  const res = await fetch(`${X_API_BASE}/2/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`X user fetch failed: ${res.status} - ${body}`);
  }

  const json = (await res.json()) as { data: TwitterUser };
  return json.data;
}
