/**
 * Discord embed builders.
 *
 * buildEmbed(payload) is the single public entry point. It delegates to a
 * per-table formatter that knows which fields are meaningful for each table,
 * and — for UPDATE — computes a field-level diff so the embed only shows
 * what actually changed.
 */

import type { DbChangePayload, DiscordEmbed, DiscordEmbedField } from './types';
import { sanitizeRow, REDACTED } from './redact';

// ---------------------------------------------------------------------------
// Embed color by operation
// ---------------------------------------------------------------------------

const COLORS: Record<string, number> = {
  INSERT: 0x57f287, // green
  UPDATE: 0xfee75c, // yellow
  DELETE: 0xed4245, // red
};

// ---------------------------------------------------------------------------
// Diff helpers
// ---------------------------------------------------------------------------

/**
 * Returns only the fields that differ between two sanitized rows.
 * Both-sides-redacted changes (REDACTED → REDACTED) are skipped since they
 * carry no useful signal.
 */
function diffFields(
  oldRow: Record<string, string>,
  newRow: Record<string, string>
): DiscordEmbedField[] {
  const keys = new Set([...Object.keys(oldRow), ...Object.keys(newRow)]);
  const fields: DiscordEmbedField[] = [];

  for (const key of keys) {
    const before = oldRow[key] ?? 'null';
    const after = newRow[key] ?? 'null';
    if (before === after) continue;
    if (before === REDACTED && after === REDACTED) continue;
    fields.push({ name: key, value: `${before} → ${after}`, inline: false });
  }

  return fields;
}

// ---------------------------------------------------------------------------
// Per-table formatters
// ---------------------------------------------------------------------------

function formatWaitlistEntries(payload: DbChangePayload): DiscordEmbedField[] {
  const cleanNew = sanitizeRow(payload.new);
  const cleanOld = sanitizeRow(payload.old);

  if (payload.op === 'INSERT' && cleanNew) {
    return [
      { name: 'wallet', value: cleanNew.wallet_address, inline: false },
      { name: 'verified_at', value: cleanNew.wallet_verified_at ?? 'null', inline: true },
      { name: 'email', value: cleanNew.email ?? 'null', inline: true },
      { name: 'discord', value: cleanNew.discord_username ?? 'null', inline: true },
      { name: 'twitter', value: cleanNew.twitter_username ?? 'null', inline: true },
    ];
  }

  if (payload.op === 'DELETE' && cleanOld) {
    return [
      { name: 'wallet', value: cleanOld.wallet_address, inline: false },
      { name: 'email', value: cleanOld.email ?? 'null', inline: true },
      { name: 'discord', value: cleanOld.discord_username ?? 'null', inline: true },
      { name: 'twitter', value: cleanOld.twitter_username ?? 'null', inline: true },
    ];
  }

  if (payload.op === 'UPDATE' && cleanNew) {
    // If we have both rows, show only what changed; otherwise show current state
    if (cleanOld) {
      const diff = diffFields(cleanOld, cleanNew);
      return [
        { name: 'wallet', value: cleanNew.wallet_address, inline: false },
        ...(diff.length > 0 ? diff : [{ name: '(no visible changes)', value: '-', inline: false }]),
      ];
    }
    return [
      { name: 'wallet', value: cleanNew.wallet_address, inline: false },
      { name: 'verified_at', value: cleanNew.wallet_verified_at ?? 'null', inline: true },
      { name: 'email', value: cleanNew.email ?? 'null', inline: true },
      { name: 'discord', value: cleanNew.discord_username ?? 'null', inline: true },
      { name: 'twitter', value: cleanNew.twitter_username ?? 'null', inline: true },
    ];
  }

  return [];
}

function formatOAuthStates(payload: DbChangePayload): DiscordEmbedField[] {
  const cleanNew = sanitizeRow(payload.new);
  const cleanOld = sanitizeRow(payload.old);
  const row = cleanNew ?? cleanOld;

  if (!row) return [];

  if (payload.op === 'INSERT') {
    return [
      { name: 'provider', value: row.provider, inline: true },
      { name: 'wallet', value: row.wallet_address, inline: false },
      { name: 'expires_at', value: row.expires_at, inline: true },
    ];
  }

  if (payload.op === 'DELETE') {
    return [
      { name: 'provider', value: row.provider, inline: true },
      { name: 'wallet', value: row.wallet_address, inline: false },
      { name: 'used_at', value: row.used_at ?? 'unused', inline: true },
    ];
  }

  if (payload.op === 'UPDATE' && cleanNew) {
    if (cleanOld) {
      const diff = diffFields(cleanOld, cleanNew);
      return [
        { name: 'provider', value: cleanNew.provider, inline: true },
        { name: 'wallet', value: cleanNew.wallet_address, inline: false },
        ...(diff.length > 0 ? diff : [{ name: '(no visible changes)', value: '-', inline: false }]),
      ];
    }
    return [
      { name: 'provider', value: cleanNew.provider, inline: true },
      { name: 'wallet', value: cleanNew.wallet_address, inline: false },
      { name: 'used_at', value: cleanNew.used_at ?? 'null', inline: true },
    ];
  }

  return [];
}

function formatWalletChallenges(payload: DbChangePayload): DiscordEmbedField[] {
  const cleanNew = sanitizeRow(payload.new);
  const cleanOld = sanitizeRow(payload.old);
  const row = cleanNew ?? cleanOld;

  if (!row) return [];

  if (payload.op === 'INSERT') {
    return [
      { name: 'wallet', value: row.wallet_address, inline: false },
      { name: 'expires_at', value: row.expires_at, inline: true },
    ];
  }

  if (payload.op === 'DELETE') {
    return [
      { name: 'wallet', value: row.wallet_address, inline: false },
      { name: 'used_at', value: row.used_at ?? 'unused', inline: true },
    ];
  }

  if (payload.op === 'UPDATE' && cleanNew) {
    if (cleanOld) {
      const diff = diffFields(cleanOld, cleanNew);
      return [
        { name: 'wallet', value: cleanNew.wallet_address, inline: false },
        ...(diff.length > 0 ? diff : [{ name: '(no visible changes)', value: '-', inline: false }]),
      ];
    }
    return [
      { name: 'wallet', value: cleanNew.wallet_address, inline: false },
      { name: 'used_at', value: cleanNew.used_at ?? 'null', inline: true },
    ];
  }

  return [];
}

// ---------------------------------------------------------------------------
// Dispatch table
// ---------------------------------------------------------------------------

const TABLE_FORMATTERS: Record<string, (p: DbChangePayload) => DiscordEmbedField[]> = {
  waitlist_entries: formatWaitlistEntries,
  oauth_states: formatOAuthStates,
  wallet_challenges: formatWalletChallenges,
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function buildEmbed(payload: DbChangePayload): DiscordEmbed {
  const { table, op, ts, truncated } = payload;
  const formatter = TABLE_FORMATTERS[table];
  const fields: DiscordEmbedField[] = formatter ? formatter(payload) : [];

  if (truncated) {
    fields.push({
      name: '⚠ payload truncated',
      value: 'Row was too large; raw data was omitted by the DB trigger.',
      inline: false,
    });
  }

  if (fields.length === 0) {
    fields.push({ name: '(no data)', value: '-', inline: false });
  }

  return {
    title: `${table} • ${op}`,
    color: COLORS[op] ?? 0x95a5a6,
    fields,
    timestamp: new Date(ts * 1000).toISOString(),
    footer: { text: 'thaler-finance · db change' },
  };
}
