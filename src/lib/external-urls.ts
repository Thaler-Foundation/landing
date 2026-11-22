// External-service URLs. Defaults match the literals that lived inline before
// SP5c v2. Deploys can override per-environment via env vars without rebuild.

const COINGECKO_DEFAULT =
  'https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=eur,gbp,jpy,cad,aud,chf,usd';

export function getCoingeckoUrl(): string {
  return process.env.COINGECKO_URL ?? COINGECKO_DEFAULT;
}

const HERMES_DEFAULT = 'https://hermes.pyth.network';

export function getHermesEndpoint(): string {
  return process.env.NEXT_PUBLIC_HERMES_ENDPOINT ?? HERMES_DEFAULT;
}

const THALER_API_DEFAULT = 'https://thalerapi-production.up.railway.app';

export function getThalerApiBaseUrl(): string {
  return (
    process.env.THALER_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? THALER_API_DEFAULT
  );
}
