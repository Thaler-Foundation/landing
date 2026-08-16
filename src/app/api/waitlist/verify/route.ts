import { NextRequest, NextResponse } from 'next/server';
import { verifyWalletSignature } from '@/lib/waitlist/challenge';
import { consumeChallenge, upsertWaitlistEntry } from '@/lib/waitlist/db';
import { signWlSession, setWlSessionCookie } from '@/lib/waitlist/session';
import type { WalletVerifyPayload } from '@/types/waitlist';

/** POST /api/waitlist/verify
 *  Body: { walletAddress, nonce, message, signature (base64) }
 *  On success: sets wl_session HttpOnly cookie, returns { success: true }
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<WalletVerifyPayload>;
    const { walletAddress, nonce, message, signature } = body;

    if (!walletAddress || !nonce || !message || !signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Consume nonce — atomically marks it used; fails if expired or already used
    const challenge = await consumeChallenge(nonce, walletAddress);
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found, expired, or already used' },
        { status: 401 }
      );
    }

    // 2. Ensure the submitted message matches what the server stored
    if (challenge.message !== message) {
      return NextResponse.json({ error: 'Message mismatch' }, { status: 401 });
    }

    // 3. Verify Ed25519 signature
    const valid = await verifyWalletSignature(message, signature, walletAddress);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 4. Upsert the waitlist entry to record verification timestamp
    const verifiedAt = new Date();
    await upsertWaitlistEntry(walletAddress, verifiedAt);

    // 5. Issue a session cookie. Legacy waitlist verify predates the SP6
    //    email gate — the cookie carries `email: ''`, which the gate
    //    rejects. Real beta access flows through /api/auth/allowlist with
    //    a verified Privy email.
    const token = await signWlSession({
      walletAddress,
      email: '',
      verifiedAt: verifiedAt.toISOString(),
    });

    const response = NextResponse.json({ success: true });
    setWlSessionCookie(response, token);
    return response;
  } catch (err) {
    console.error('[verify]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
