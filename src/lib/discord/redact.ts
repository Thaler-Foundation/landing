/**
 * Redaction helpers.
 *
 * Any field listed in SENSITIVE_FIELDS is replaced with [REDACTED] before
 * an embed is built. This prevents OAuth tokens, PKCE verifiers, nonces,
 * and wallet-signing challenges from ever appearing in Discord.
 */

const SENSITIVE_FIELDS = new Set([
  'state', // oauth_states: OAuth2 CSRF token
  'code_verifier', // oauth_states: PKCE code verifier
  'nonce', // wallet_challenges: replay-prevention nonce
  'message', // wallet_challenges: wallet signing challenge body
]);

export const REDACTED = '[REDACTED]';

/** Max character length for any single field value in an embed. */
const MAX_VALUE_LEN = 100;

export function isSensitive(fieldName: string): boolean {
  return SENSITIVE_FIELDS.has(fieldName);
}

/**
 * Returns a copy of a DB row with sensitive fields replaced and long values
 * truncated. All values are coerced to strings for embed rendering.
 */
export function sanitizeRow(row: Record<string, unknown> | null): Record<string, string> | null {
  if (row === null) return null;
  return Object.fromEntries(
    Object.entries(row).map(([key, val]) => {
      if (isSensitive(key)) return [key, REDACTED];
      const str = val === null || val === undefined ? 'null' : String(val);
      return [key, str.length > MAX_VALUE_LEN ? str.slice(0, MAX_VALUE_LEN) + '…' : str];
    })
  );
}
