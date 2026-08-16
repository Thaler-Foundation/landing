import { NextRequest, NextResponse } from 'next/server';
import { readWlSession } from '@/lib/waitlist/session';
import { getWaitlistEntry } from '@/lib/waitlist/db';
import type { WaitlistStatus } from '@/types/waitlist';

/** GET /api/waitlist/status
 *  Reads wl_session cookie → returns current registration state from DB.
 *  Used by the client on mount to hydrate after OAuth redirects.
 */
export async function GET(request: NextRequest) {
  const session = await readWlSession(request);

  if (!session) {
    const empty: WaitlistStatus = {
      walletAddress: null,
      walletVerified: false,
      email: null,
      discordId: null,
      discordUsername: null,
      twitterId: null,
      twitterUsername: null,
    };
    return NextResponse.json(empty);
  }

  const row = await getWaitlistEntry(session.walletAddress);

  const status: WaitlistStatus = {
    walletAddress: session.walletAddress,
    walletVerified: true,
    email: row?.email ?? null,
    discordId: row?.discord_id ?? null,
    discordUsername: row?.discord_username ?? null,
    twitterId: row?.twitter_id ?? null,
    twitterUsername: row?.twitter_username ?? null,
  };

  return NextResponse.json(status);
}
