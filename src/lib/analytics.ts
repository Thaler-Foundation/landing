import { getThalerApiBaseUrl } from '@/lib/external-urls';

export type Mode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type StrategyBreakdown = {
  mode: Mode;
  tvlUsd: number;
  projectedApyBps: number;
  tvlSol?: number;
  lifetimeYieldSol?: number;
  lifetimeYieldUsd?: number;
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

const TVL_MODES: Mode[] = ['A', 'B', 'C'];

function sum(
  rows: StrategyBreakdown[],
  key: 'tvlSol' | 'tvlUsd' | 'lifetimeYieldSol' | 'lifetimeYieldUsd'
) {
  const values = rows.map((s) => s[key]);
  return values.length > 0 && values.every((v) => typeof v === 'number')
    ? values.reduce<number>((a, v) => a + v!, 0)
    : null;
}

export function getLiveStats(data: AnalyticsData | null) {
  const all = data?.strategyBreakdown ?? [];
  const tvl = all.filter((s) => TVL_MODES.includes(s.mode));
  return {
    tvlSol: sum(tvl, 'tvlSol'),
    tvlUsd: sum(tvl, 'tvlUsd'),
    yieldSol: sum(all, 'lifetimeYieldSol'),
    yieldUsd: sum(all, 'lifetimeYieldUsd'),
  };
}
