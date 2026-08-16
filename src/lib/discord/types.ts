/**
 * Shared types for the Discord notification pipeline.
 *
 * DbChangePayload — the JSON object fired via pg_notify from the DB trigger.
 * DiscordEmbed    — a single Discord embed object sent to the webhook.
 */

export type DbOperation = 'INSERT' | 'UPDATE' | 'DELETE';

export type WatchedTable = 'waitlist_entries' | 'oauth_states' | 'wallet_challenges';

/** JSON payload emitted by the Postgres trigger via pg_notify. */
export interface DbChangePayload {
  table: WatchedTable;
  op: DbOperation;
  /** Unix epoch seconds (from clock_timestamp()). */
  ts: number;
  /** Full new row for INSERT/UPDATE; null for DELETE. */
  new: Record<string, unknown> | null;
  /** Full old row for UPDATE/DELETE; null for INSERT. */
  old: Record<string, unknown> | null;
  /** True when the raw payload was too large and was replaced with a stub. */
  truncated?: boolean;
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  title: string;
  /** Integer color in decimal, e.g. 0x57F287. */
  color: number;
  fields: DiscordEmbedField[];
  /** ISO 8601 timestamp shown in the embed footer. */
  timestamp: string;
  footer?: { text: string };
}
