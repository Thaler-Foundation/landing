import { NextRequest, NextResponse } from 'next/server';
import { consumeOAuthState, updateWaitlistTwitter } from '@/lib/waitlist/db';
import { exchangeTwitterCode, getTwitterUser } from '@/lib/waitlist/twitter';

/** GET /api/waitlist/twitter/callback?code=...&state=...
 *  Validates state + PKCE verifier, exchanges code, saves X identity to DB,
 *  then redirects back to the waitlist page.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const waitlistUrl = `${origin}/waitlist`;

  if (error) {
    console.warn('[twitter/callback] OAuth error from X:', error);
    return NextResponse.redirect(`${waitlistUrl}?twitter_error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${waitlistUrl}?twitter_error=missing_params`);
  }

  try {
    // 1. Validate and consume the CSRF state; also retrieves the PKCE code_verifier
    let oauthState;
    try {
      oauthState = await consumeOAuthState(state, 'twitter');
    } catch (err) {
      console.error('[twitter/callback] consumeOAuthState failed:', err);
      return NextResponse.redirect(`${waitlistUrl}?twitter_error=db_state_error`);
    }

    if (!oauthState || !oauthState.code_verifier) {
      return NextResponse.redirect(`${waitlistUrl}?twitter_error=invalid_state`);
    }

    // 2. Exchange code with PKCE verifier
    let accessToken: string;
    try {
      ({ accessToken } = await exchangeTwitterCode(code, oauthState.code_verifier, origin));
    } catch (err) {
      console.error('[twitter/callback] token exchange failed:', err);
      return NextResponse.redirect(`${waitlistUrl}?twitter_error=token_exchange_failed`);
    }

    // 3. Fetch X user identity
    let xUser;
    try {
      xUser = await getTwitterUser(accessToken);
    } catch (err) {
      console.error('[twitter/callback] getTwitterUser failed:', err);
      return NextResponse.redirect(`${waitlistUrl}?twitter_error=user_fetch_failed`);
    }

    // 4. Persist twitter_id linked to this wallet
    try {
      await updateWaitlistTwitter(oauthState.wallet_address, xUser.id, xUser.username);
    } catch (err) {
      console.error('[twitter/callback] updateWaitlistTwitter failed:', err);
      return NextResponse.redirect(`${waitlistUrl}?twitter_error=db_update_failed`);
    }

    return NextResponse.redirect(`${waitlistUrl}?twitter=linked`);
  } catch (err) {
    console.error('[twitter/callback] unexpected error:', err);
    return NextResponse.redirect(`${waitlistUrl}?twitter_error=server_error`);
  }
}
