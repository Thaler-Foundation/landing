import { NextRequest, NextResponse } from 'next/server';
import { readWlSession } from '@/lib/waitlist/session';
import { buildDiscordAuthUrl } from '@/lib/waitlist/discord';
import { createOAuthState } from '@/lib/waitlist/db';

const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function generateState(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString('base64url');
}

/** GET /api/waitlist/discord/start
 *  Requires a valid wl_session cookie (wallet must be verified first).
 *  Redirects the browser to Discord's authorization page.
 */
export async function GET(request: NextRequest) {
  const session = await readWlSession(request);
  if (!session) {
    return NextResponse.json(
      { error: 'Wallet not verified. Complete wallet signing first.' },
      {
        status: 401,
      }
    );
  }

  const state = generateState();
  const expiresAt = new Date(Date.now() + STATE_TTL_MS);
  const baseUrl = new URL(request.url).origin;

  await createOAuthState(state, 'discord', session.walletAddress, expiresAt);

  const authUrl = buildDiscordAuthUrl(state, baseUrl);
  return NextResponse.redirect(authUrl);
}
