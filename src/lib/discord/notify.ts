/**
 * Fire-and-forget Discord notification helper.
 *
 * Call notifyDbChange() right after any DB mutation — it builds the embed and
 * dispatches the webhook without blocking or throwing. Mirrors the existing
 * pattern used for email notifications in /api/waitlist/route.ts.
 */

import type { DbOperation, DbChangePayload, WatchedTable } from './types';
import { buildEmbed } from './embeds';
import { sendDiscordEmbed } from './webhook';

export function notifyDbChange(
  table: WatchedTable,
  op: DbOperation,
  newRow: Record<string, unknown> | null,
  oldRow: Record<string, unknown> | null = null
): void {
  const payload: DbChangePayload = {
    table,
    op,
    ts: Math.floor(Date.now() / 1000),
    new: newRow,
    old: oldRow,
  };

  // Intentionally not awaited — never block or surface errors to the caller
  void buildAndSend(payload);
}

async function buildAndSend(payload: DbChangePayload): Promise<void> {
  try {
    const embed = buildEmbed(payload);
    await sendDiscordEmbed(embed, payload.table);
  } catch (err) {
    console.error('[discord] notification error:', err);
  }
}
