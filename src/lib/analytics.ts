import { getThalerApiBaseUrl } from '@/lib/external-urls';

export type Mode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type StrategyBreakdown = {
  mode: Mode;
  vaultCount: number;
  tvlUsd: number;
  projectedApyBps: number;
};

export type AnalyticsData = {
  strategyBreakdown: StrategyBreakdown[];
};

export async function getAnalytics(): Promise<AnalyticsData | null> {
  try {
    const res = await fetch(`${getThalerApiBaseUrl()}/public/protocol/analytics`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function getApyPct(data: AnalyticsData | null, mode: Mode) {
  const bps = data?.strategyBreakdown?.find((s) => s.mode === mode)?.projectedApyBps;
  return bps ? Math.round(bps / 100) : null;
}
