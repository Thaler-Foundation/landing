/**
 * Discord webhook sender.
 *
 * Retries up to MAX_RETRIES times with exponential back-off.
 * Respects the Discord 429 Retry-After header.
 * Never throws — a delivery failure is logged but does NOT crash the caller.
 *
 * Per-table webhook URLs (checked first):
 *   DISCORD_WEBHOOK_URL_WAITLIST_ENTRIES
 *   DISCORD_WEBHOOK_URL_OAUTH_STATES
 *   DISCORD_WEBHOOK_URL_WALLET_CHALLENGES
 *
 * Fallback (used when no per-table URL is set):
 *   DISCORD_WEBHOOK_URL
 *
 * Other:
 *   DISCORD_NOTIFICATIONS_ENABLED    — set to 'false' to silence all notifications
 */

import type { DiscordEmbed, WatchedTable } from './types';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

const TABLE_ENV: Record<WatchedTable, string> = {
  waitlist_entries: 'DISCORD_WEBHOOK_URL_WAITLIST_ENTRIES',
  oauth_states: 'DISCORD_WEBHOOK_URL_OAUTH_STATES',
  wallet_challenges: 'DISCORD_WEBHOOK_URL_WALLET_CHALLENGES',
};

function resolveWebhookUrl(table: WatchedTable): string | null {
  return process.env[TABLE_ENV[table]] ?? process.env.DISCORD_WEBHOOK_URL ?? null;
}

function isEnabled(): boolean {
  return process.env.DISCORD_NOTIFICATIONS_ENABLED !== 'false';
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendDiscordEmbed(embed: DiscordEmbed, table: WatchedTable): Promise<void> {
  if (!isEnabled()) return;

  const url = resolveWebhookUrl(table);
  if (!url) {
    console.warn(`[discord] no webhook URL configured for "${table}" - notification skipped`);
    return;
  }

  const body = JSON.stringify({ embeds: [embed] });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      // 204 No Content is Discord's success response for webhooks
      if (res.status === 204 || res.ok) return;

      if (res.status === 429) {
        // Respect Discord's rate-limit header (value is in seconds)
        const retryAfterSec = Number(res.headers.get('retry-after') ?? 1);
        const wait = retryAfterSec * 1000;
        console.warn(`[discord] rate limited - waiting ${wait}ms before retry`);
        await sleep(wait);
        continue;
      }

      const text = await res.text().catch(() => '');
      console.error(`[discord] HTTP ${res.status} - ${text.slice(0, 200)}`);
    } catch (err) {
      console.error(`[discord] network error (attempt ${attempt}/${MAX_RETRIES}):`, err);
    }

    if (attempt < MAX_RETRIES) {
      await sleep(BASE_DELAY_MS * 2 ** (attempt - 1));
    }
  }

  console.error('[discord] all retries exhausted - notification dropped');
}
