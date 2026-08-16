import { NextRequest, NextResponse } from 'next/server';
import { readWlSession } from '@/lib/waitlist/session';
import { unlinkDiscord, unlinkTwitter } from '@/lib/waitlist/db';

/** DELETE /api/waitlist/unlink/[provider]
 *  Unlinks a social identity (discord | twitter) from the wallet session.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const session = await readWlSession(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 });
  }

  const { provider } = await params;

  if (provider === 'discord') {
    await unlinkDiscord(session.walletAddress);
  } else if (provider === 'twitter') {
    await unlinkTwitter(session.walletAddress);
  } else {
    return NextResponse.json({ success: false, message: 'Unknown provider.' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
