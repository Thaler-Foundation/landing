import { NextRequest, NextResponse } from 'next/server';
import { consumeOAuthState } from '@/lib/waitlist/db';
import { exchangeDiscordCode, getDiscordUser, discordDisplayName } from '@/lib/waitlist/discord';
import { updateWaitlistDiscord } from '@/lib/waitlist/db';

/** GET /api/waitlist/discord/callback?code=...&state=...
 *  Validates CSRF state, exchanges code, saves Discord identity to DB,
 *  then redirects back to the waitlist page.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const waitlistUrl = `${origin}/waitlist`;

  if (error) {
    console.warn('[discord/callback] OAuth error from Discord:', error);
    return NextResponse.redirect(`${waitlistUrl}?discord_error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${waitlistUrl}?discord_error=missing_params`);
  }

  try {
    // 1. Validate and consume the CSRF state (one-time, expiry-checked in DB)
    const oauthState = await consumeOAuthState(state, 'discord');
    if (!oauthState) {
      return NextResponse.redirect(`${waitlistUrl}?discord_error=invalid_state`);
    }

    // 2. Exchange authorization code for access token (server-side)
    const { accessToken } = await exchangeDiscordCode(code, origin);

    // 3. Fetch Discord user identity — never trust client claims
    const discordUser = await getDiscordUser(accessToken);
    const displayName = discordDisplayName(discordUser);

    // 4. Persist discord_id linked to this wallet
    await updateWaitlistDiscord(oauthState.wallet_address, discordUser.id, displayName);

    return NextResponse.redirect(`${waitlistUrl}?discord=linked`);
  } catch (err) {
    console.error('[discord/callback]', err);
    return NextResponse.redirect(`${waitlistUrl}?discord_error=server_error`);
  }
}
