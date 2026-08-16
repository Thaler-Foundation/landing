/**
 * Neon database connection and typed query helpers for the waitlist feature.
 * Uses @neondatabase/serverless HTTP driver — works in serverless & Node.js runtimes.
 */
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import { notifyDbChange } from '@/lib/discord/notify';

// Lazy singleton — neon() is called on first use, not at module load. A
// malformed or missing NEON_CONNECTION_STRING used to crash the entire
// route module at import time on Vercel, causing Vercel to fall back to
// its static /500 page for every request (x-matched-path=/500). Deferring
// the call moves any failure into the per-request try/catch so the route
// can return a clean JSON error instead.
let _sql: NeonQueryFunction<false, false> | null = null;

function getSql(): NeonQueryFunction<false, false> {
  if (_sql) return _sql;
  const url = process.env.NEON_CONNECTION_STRING;
  if (!url) {
    // No URL value to leak — safe to surface this generic message.
    throw new Error('Database not configured');
  }
  try {
    _sql = neon(url);
  } catch (originalErr) {
    // CRITICAL: neon()'s own validator includes the connection string in
    // its thrown message. Re-throw a redacted error so the URL never
    // escapes server logs into HTTP responses. Log the original for ops.
    console.error('[waitlist/db] neon() init failed:', originalErr);
    throw new Error('Database connection unavailable');
  }
  return _sql;
}

// Proxy so existing tagged-template usages (`sql\`...\``) keep working.
// The proxy resolves to the real `neon()` instance on first invocation.
export const sql: NeonQueryFunction<false, false> = new Proxy(
  // Underlying target is just a callable shell; the apply trap forwards
  // everything to the real query function returned by neon().
  function placeholder() {} as unknown as NeonQueryFunction<false, false>,
  {
    apply(_target, thisArg, args: unknown[]) {
      return Reflect.apply(getSql() as unknown as (...a: unknown[]) => unknown, thisArg, args);
    },
  }
);

// ---------------------------------------------------------------------------
// DDL — run once (e.g. via `pnpm db:migrate` or the Neon console).
// Exported so callers can run it programmatically during local dev.
// ---------------------------------------------------------------------------

export const SCHEMA_SQL = /* sql */ `
CREATE TABLE IF NOT EXISTS waitlist_entries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address    TEXT,
  wallet_verified_at TIMESTAMPTZ,
  email             TEXT,
  discord_id        TEXT,
  discord_username  TEXT,
  twitter_id        TEXT,
  twitter_username  TEXT,
  has_access        BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_wallet_unique
  ON waitlist_entries (wallet_address)
  WHERE wallet_address IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_unique
  ON waitlist_entries (email)
  WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_discord_unique
  ON waitlist_entries (discord_id)
  WHERE discord_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_twitter_unique
  ON waitlist_entries (twitter_id)
  WHERE twitter_id IS NOT NULL;

-- Short-lived nonces for wallet ownership proof (prevent replay)
CREATE TABLE IF NOT EXISTS wallet_challenges (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nonce          TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  message        TEXT NOT NULL,
  expires_at     TIMESTAMPTZ NOT NULL,
  used_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS wallet_challenges_nonce_unique
  ON wallet_challenges (nonce);

-- Short-lived OAuth state tokens (CSRF protection + code_verifier for PKCE)
CREATE TABLE IF NOT EXISTS oauth_states (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state          TEXT NOT NULL,
  provider       TEXT NOT NULL,        -- 'discord' | 'twitter'
  wallet_address TEXT NOT NULL,
  code_verifier  TEXT,                 -- PKCE only (Twitter/X)
  expires_at     TIMESTAMPTZ NOT NULL,
  used_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS oauth_states_state_unique
  ON oauth_states (state);
`;

// ---------------------------------------------------------------------------
// Typed row helpers
// ---------------------------------------------------------------------------

export interface WaitlistRow {
  id: string;
  wallet_address: string;
  wallet_verified_at: Date | null;
  email: string | null;
  discord_id: string | null;
  discord_username: string | null;
  twitter_id: string | null;
  twitter_username: string | null;
  has_access: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface WalletChallengeRow {
  id: string;
  nonce: string;
  wallet_address: string;
  message: string;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
}

export interface OAuthStateRow {
  id: string;
  state: string;
  provider: string;
  wallet_address: string;
  code_verifier: string | null;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

export async function getWaitlistEntry(walletAddress: string): Promise<WaitlistRow | null> {
  const rows = (await sql`
    SELECT * FROM waitlist_entries WHERE wallet_address = ${walletAddress} LIMIT 1
  `) as unknown as WaitlistRow[];
  return rows[0] ?? null;
}

export async function upsertWaitlistEntry(
  walletAddress: string,
  verifiedAt: Date
): Promise<WaitlistRow> {
  // xmax = 0 on INSERT, non-zero on UPDATE (Postgres internal tid)
  const rows = (await sql`
    INSERT INTO waitlist_entries (wallet_address, wallet_verified_at, updated_at)
    VALUES (${walletAddress}, ${verifiedAt.toISOString()}, now())
    ON CONFLICT (wallet_address)
    DO UPDATE SET
      wallet_verified_at = EXCLUDED.wallet_verified_at,
      updated_at = now()
    RETURNING *, (xmax::text != '0') AS _updated
  `) as unknown as (WaitlistRow & { _updated: boolean })[];
  const row = rows[0];
  notifyDbChange(
    'waitlist_entries',
    row._updated ? 'UPDATE' : 'INSERT',
    row as unknown as Record<string, unknown>
  );
  return row;
}

export async function updateWaitlistDiscord(
  walletAddress: string,
  discordId: string,
  discordUsername: string
): Promise<void> {
  await sql`
    INSERT INTO waitlist_entries (wallet_address, discord_id, discord_username, updated_at)
    VALUES (${walletAddress}, ${discordId}, ${discordUsername}, now())
    ON CONFLICT (wallet_address)
    DO UPDATE SET
      discord_id = EXCLUDED.discord_id,
      discord_username = EXCLUDED.discord_username,
      updated_at = now()
  `;
  notifyDbChange('waitlist_entries', 'UPDATE', {
    wallet_address: walletAddress,
    discord_id: discordId,
    discord_username: discordUsername,
  });
}

export async function updateWaitlistTwitter(
  walletAddress: string,
  twitterId: string,
  twitterUsername: string
): Promise<void> {
  await sql`
    INSERT INTO waitlist_entries (wallet_address, twitter_id, twitter_username, updated_at)
    VALUES (${walletAddress}, ${twitterId}, ${twitterUsername}, now())
    ON CONFLICT (wallet_address)
    DO UPDATE SET
      twitter_id = EXCLUDED.twitter_id,
      twitter_username = EXCLUDED.twitter_username,
      updated_at = now()
  `;
  notifyDbChange('waitlist_entries', 'UPDATE', {
    wallet_address: walletAddress,
    twitter_id: twitterId,
    twitter_username: twitterUsername,
  });
}

export async function insertWaitlistEmail(
  email: string,
  walletAddress?: string | null
): Promise<void> {
  if (walletAddress) {
    // Session present — attach email to the wallet row (or create it).
    await sql`
      INSERT INTO waitlist_entries (wallet_address, email, updated_at)
      VALUES (${walletAddress}, ${email}, now())
      ON CONFLICT (wallet_address) WHERE wallet_address IS NOT NULL
      DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = now()
    `;
  } else {
    // Email-only signup (e.g. landing hero form).
    await sql`
      INSERT INTO waitlist_entries (email, updated_at)
      VALUES (${email}, now())
      ON CONFLICT (email) WHERE email IS NOT NULL
      DO UPDATE SET updated_at = now()
    `;
  }
  notifyDbChange('waitlist_entries', 'UPDATE', {
    email,
    wallet_address: walletAddress ?? null,
  });
}

export async function unlinkDiscord(walletAddress: string): Promise<void> {
  await sql`
    UPDATE waitlist_entries
    SET discord_id = NULL, discord_username = NULL, updated_at = now()
    WHERE wallet_address = ${walletAddress}
  `;
  notifyDbChange('waitlist_entries', 'UPDATE', { wallet_address: walletAddress, discord_id: null });
}

export async function unlinkTwitter(walletAddress: string): Promise<void> {
  await sql`
    UPDATE waitlist_entries
    SET twitter_id = NULL, twitter_username = NULL, updated_at = now()
    WHERE wallet_address = ${walletAddress}
  `;
  notifyDbChange('waitlist_entries', 'UPDATE', { wallet_address: walletAddress, twitter_id: null });
}

// --- Challenges ---

export async function createChallenge(
  walletAddress: string,
  nonce: string,
  message: string,
  expiresAt: Date
): Promise<void> {
  await sql`
    INSERT INTO wallet_challenges (nonce, wallet_address, message, expires_at)
    VALUES (${nonce}, ${walletAddress}, ${message}, ${expiresAt.toISOString()})
  `;
  notifyDbChange('wallet_challenges', 'INSERT', {
    wallet_address: walletAddress,
    nonce,
    message,
    expires_at: expiresAt.toISOString(),
  });
}

export async function consumeChallenge(
  nonce: string,
  walletAddress: string
): Promise<WalletChallengeRow | null> {
  // Atomically retrieve + mark used in one query; returns null if expired, used, or not found
  const rows = (await sql`
    UPDATE wallet_challenges
    SET used_at = now()
    WHERE nonce = ${nonce}
      AND wallet_address = ${walletAddress}
      AND expires_at > now()
      AND used_at IS NULL
    RETURNING *
  `) as unknown as WalletChallengeRow[];
  const row = rows[0] ?? null;
  if (row) notifyDbChange('wallet_challenges', 'UPDATE', row as unknown as Record<string, unknown>);
  return row;
}

// --- OAuth states ---

export async function createOAuthState(
  state: string,
  provider: string,
  walletAddress: string,
  expiresAt: Date,
  codeVerifier?: string
): Promise<void> {
  await sql`
    INSERT INTO oauth_states (state, provider, wallet_address, code_verifier, expires_at)
    VALUES (
      ${state},
      ${provider},
      ${walletAddress},
      ${codeVerifier ?? null},
      ${expiresAt.toISOString()}
    )
  `;
  notifyDbChange('oauth_states', 'INSERT', {
    state,
    provider,
    wallet_address: walletAddress,
    code_verifier: codeVerifier ?? null,
    expires_at: expiresAt.toISOString(),
  });
}

export async function checkHasAccess(walletAddress: string): Promise<boolean> {
  const rows = (await sql`
    SELECT has_access FROM waitlist_entries
    WHERE wallet_address = ${walletAddress} LIMIT 1
  `) as unknown as { has_access: boolean }[];
  return rows[0]?.has_access === true;
}

export async function consumeOAuthState(
  state: string,
  provider: string
): Promise<OAuthStateRow | null> {
  const rows = (await sql`
    UPDATE oauth_states
    SET used_at = now()
    WHERE state = ${state}
      AND provider = ${provider}
      AND expires_at > now()
      AND used_at IS NULL
    RETURNING *
  `) as unknown as OAuthStateRow[];
  const row = rows[0] ?? null;
  if (row) notifyDbChange('oauth_states', 'UPDATE', row as unknown as Record<string, unknown>);
  return row;
}
