/**
 * Wallet ownership challenge: generate a human-readable sign-in message,
 * verify the returned Ed25519 signature server-side using the Web Crypto API.
 *
 * No extra dependencies — relies on Node.js 18+ crypto.subtle (Ed25519).
 */

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'thaler.finance';
const CHALLENGE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ---------------------------------------------------------------------------
// Nonce helpers
// ---------------------------------------------------------------------------

/** Generate a cryptographically random nonce (hex string, 32 bytes). */
export function generateNonce(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function challengeExpiresAt(): Date {
  return new Date(Date.now() + CHALLENGE_TTL_MS);
}

// ---------------------------------------------------------------------------
// Message building
// ---------------------------------------------------------------------------

/**
 * Build the human-readable message the wallet owner must sign.
 * Follows a SIWS-inspired (Sign-In With Solana) format.
 */
export function buildChallengeMessage(walletAddress: string, nonce: string): string {
  const issuedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS).toISOString();

  return [
    `${APP_DOMAIN} wants you to register for the waitlist.`,
    '',
    'Statement: By signing this message you prove ownership of this wallet.',
    'This request does not grant any permissions and is not a transaction.',
    '',
    `URI: https://${APP_DOMAIN}/waitlist`,
    `Address: ${walletAddress}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
    `Expiration Time: ${expiresAt}`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Ed25519 signature verification (Web Crypto API — Node.js 18+)
// ---------------------------------------------------------------------------

/**
 * Decode a Base58-encoded Solana wallet address into its raw 32-byte public key.
 * Pure implementation — no external dependencies.
 */
function decodeBase58(input: string): Uint8Array {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let num = 0n;
  for (const char of input) {
    const idx = ALPHABET.indexOf(char);
    if (idx < 0) throw new Error(`Invalid base58 character: ${char}`);
    num = num * 58n + BigInt(idx);
  }

  let leadingZeros = 0;
  for (const char of input) {
    if (char !== '1') break;
    leadingZeros++;
  }

  const bytes: number[] = [];
  while (num > 0n) {
    bytes.unshift(Number(num & 0xffn));
    num >>= 8n;
  }

  const result = new Uint8Array(leadingZeros + bytes.length);
  for (let i = 0; i < bytes.length; i++) result[leadingZeros + i] = bytes[i];
  return result;
}

/**
 * Verify an Ed25519 signature produced by a Solana wallet's `signMessage`.
 *
 * @param message   - The original UTF-8 message string that was signed.
 * @param signatureBase64 - Base64-encoded 64-byte signature from the wallet.
 * @param walletAddress   - Base58-encoded Solana public key.
 */
export async function verifyWalletSignature(
  message: string,
  signatureBase64: string,
  walletAddress: string
): Promise<boolean> {
  try {
    const publicKeyBytes = decodeBase58(walletAddress);
    if (publicKeyBytes.length !== 32) return false;

    const sigBuf = Buffer.from(signatureBase64, 'base64');
    if (sigBuf.length !== 64) return false;

    // Ensure concrete ArrayBuffer backing for Web Crypto API (TS 5.9+ strictness)
    const sigArray = new Uint8Array(sigBuf).buffer as ArrayBuffer;
    const keyArray = new Uint8Array(publicKeyBytes).buffer as ArrayBuffer;
    const msgArray = new Uint8Array(Buffer.from(message, 'utf8')).buffer as ArrayBuffer;

    const cryptoKey = await crypto.subtle.importKey('raw', keyArray, { name: 'Ed25519' }, false, [
      'verify',
    ]);

    return await crypto.subtle.verify('Ed25519', cryptoKey, sigArray, msgArray);
  } catch {
    return false;
  }
}
