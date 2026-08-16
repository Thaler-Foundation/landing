/**
 * Belt-and-suspenders safety: scrubs strings that look like database
 * connection strings, secrets, or Neon driver error messages before they
 * leave the process. Used by route handlers as a last line of defense in
 * case some upstream code echoes err.message without thinking.
 */

const REDACTED = '[REDACTED]';

// Patterns that should never appear in an HTTP response body.
const SECRET_PATTERNS: RegExp[] = [
  /postgres(?:ql)?:\/\/[^\s'"<>]+/gi, // postgres connection URLs
  /neon:\/\/[^\s'"<>]+/gi,
  /connection string:?\s*\S+/gi, // Neon driver's exact error preamble
  /sk_(?:live|test)_[a-zA-Z0-9_-]+/g, // generic provider secret keys
  /\bnpg_[a-zA-Z0-9]+\b/g, // Neon password tokens
];

export function scrubSecrets(input: string): string {
  let out = input;
  for (const re of SECRET_PATTERNS) {
    out = out.replace(re, REDACTED);
  }
  return out;
}
