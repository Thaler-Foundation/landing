import { NextRequest, NextResponse } from 'next/server';
import { generateNonce, buildChallengeMessage, challengeExpiresAt } from '@/lib/waitlist/challenge';
import { createChallenge } from '@/lib/waitlist/db';

/** POST /api/waitlist/challenge
 *  Body: { walletAddress: string }
 *  Returns: { nonce: string; message: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = (await request.json()) as { walletAddress?: string };

    if (!walletAddress || typeof walletAddress !== 'string') {
      return NextResponse.json({ error: 'walletAddress is required' }, { status: 400 });
    }

    // Basic Solana address sanity check (base58, 32–44 chars)
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }

    const nonce = generateNonce();
    const message = buildChallengeMessage(walletAddress, nonce);
    const expiresAt = challengeExpiresAt();

    await createChallenge(walletAddress, nonce, message, expiresAt);

    return NextResponse.json({ nonce, message });
  } catch (err) {
    console.error('[challenge]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
