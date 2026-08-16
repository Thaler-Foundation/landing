import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { readWlSession } from '@/lib/waitlist/session';
import { getWaitlistEntry } from '@/lib/waitlist/db';

const ADMIN_EMAIL = 'alexandergrey@thaler.finance';

/** POST /api/waitlist
 *  Finalises a waitlist registration. Requires a valid wl_session cookie
 *  (wallet ownership must have been verified first). Discord and X are optional.
 *  Reads all verified identities from DB — never from the request body.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Require a verified wallet session — never trust client-side claims
    const session = await readWlSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Wallet not verified. Please sign the challenge first.' },
        { status: 401 }
      );
    }

    const { walletAddress } = session;

    // 2. Load the authoritative record from DB
    const entry = await getWaitlistEntry(walletAddress);
    if (!entry) {
      return NextResponse.json(
        { success: false, message: 'Wallet entry not found. Please retry verification.' },
        { status: 400 }
      );
    }

    // 3. Send admin notification email (non-blocking failure)
    const emailBody = [
      'New Waitlist Registration:',
      '',
      `Wallet:          ${walletAddress}`,
      `Verified At:     ${entry.wallet_verified_at?.toISOString() ?? 'n/a'}`,
      `Discord:         ${entry.discord_username ?? 'Not linked'} (${entry.discord_id ?? '-'})`,
      `X (Twitter):     ${entry.twitter_username ? '@' + entry.twitter_username : 'Not linked'} (${entry.twitter_id ?? '-'})`,
      '',
      `Submitted:       ${new Date().toISOString()}`,
    ].join('\n');

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'Thaler Finance <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: 'New Waitlist Registration - Thaler Protocol',
        text: emailBody,
      });
    } catch (emailErr) {
      console.error('[waitlist] email send failed:', emailErr);
    }

    console.log('=== WAITLIST SUBMISSION ===');
    console.log(emailBody);
    console.log('===========================');

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for waitlist!',
      data: {
        walletAddress,
        discordUsername: entry.discord_username,
        twitterUsername: entry.twitter_username,
        timestamp: Date.now(),
      },
    });
  } catch (err) {
    console.error('[waitlist/submit]', err);
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/waitlist',
    adminEmail: ADMIN_EMAIL,
  });
}
