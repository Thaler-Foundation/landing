import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { readWlSession } from '@/lib/waitlist/session';
import { insertWaitlistEmail } from '@/lib/waitlist/db';
import { scrubSecrets } from '@/lib/error/redact';

// Pin to Node runtime (neon HTTP driver + Buffer in session.ts need it) and
// disable static optimization so Vercel never tries to evaluate the module
// at build time when secrets aren't wired yet.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = 'alexandergrey@thaler.finance';

/** POST /api/waitlist/email
 *  Captures an access request from the landing-page "Request Access" form.
 *  Persists the address to the waitlist DB and forwards a notification to the
 *  Thaler founder inbox so requests surface in email even without DB access.
 *  Public — no wallet required. If a verified wallet session is present, the
 *  address is linked to that wallet.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Optionally link to wallet if session exists
    const session = await readWlSession(request);
    const walletAddress = session?.walletAddress ?? null;

    await insertWaitlistEmail(email, walletAddress);

    // Notify the founder inbox. We don't fail the request if Resend is
    // misconfigured — the DB row is the source of truth, the email is a
    // convenience signal.
    if (process.env.RESEND_API_KEY) {
      const emailBody = [
        'New Request Access from the landing page:',
        '',
        `Email:           ${email}`,
        `Wallet:          ${walletAddress ?? 'Not linked'}`,
        `Submitted:       ${new Date().toISOString()}`,
      ].join('\n');

      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Thaler Finance <onboarding@resend.dev>',
          to: ADMIN_EMAIL,
          replyTo: email,
          subject: `Request Access - ${email}`,
          text: emailBody,
        });
      } catch (emailErr) {
        console.error('[api/waitlist/email] notification send failed:', emailErr);
      }
    } else {
      console.warn('[api/waitlist/email] RESEND_API_KEY not set - skipping notification email');
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Scrub before logging in case err.message embeds a connection string or
    // other secret (Neon's own driver error does this). Belt + suspenders
    // with the generic client-facing reply below.
    const safeLog = err instanceof Error ? scrubSecrets(err.message) : String(err);
    console.error('[api/waitlist/email] error:', safeLog);
    return NextResponse.json({ error: 'Failed to save email' }, { status: 500 });
  }
}
