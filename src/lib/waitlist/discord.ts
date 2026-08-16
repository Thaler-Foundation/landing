/**
 * Discord OAuth2 helpers.
 *
 * Required env vars (server-side only — never NEXT_PUBLIC_):
 *   DISCORD_CLIENT_ID
 *   DISCORD_CLIENT_SECRET
 */

const DISCORD_API = 'https://discord.com/api/v10';
const REDIRECT_URI_PATH = '/api/waitlist/discord/callback';

function getRedirectUri(baseUrl: string): string {
  return `${baseUrl}${REDIRECT_URI_PATH}`;
}

/** Generate the Discord OAuth2 authorization URL. */
export function buildDiscordAuthUrl(state: string, baseUrl: string): string {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    redirect_uri: getRedirectUri(baseUrl),
    response_type: 'code',
    scope: 'identify',
    state,
  });
  return `https://discord.com/api/oauth2/authorize?${params}`;
}

/** Exchange authorization code for tokens. */
export async function exchangeDiscordCode(
  code: string,
  baseUrl: string
): Promise<{ accessToken: string }> {
  const res = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code,
      redirect_uri: getRedirectUri(baseUrl),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Discord token exchange failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as { access_token: string };
  return { accessToken: data.access_token };
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
}

/** Retrieve the authenticated Discord user's identity. */
export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const res = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Discord user fetch failed: ${res.status}`);
  }

  return res.json() as Promise<DiscordUser>;
}

/** Returns the display name: global_name if set, otherwise username#discriminator. */
export function discordDisplayName(user: DiscordUser): string {
  if (user.global_name) return user.global_name;
  return user.discriminator === '0' ? user.username : `${user.username}#${user.discriminator}`;
}
