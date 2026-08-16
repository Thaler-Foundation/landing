export interface WaitlistValidationError {
  field: 'twitter' | 'discord' | 'wallet' | 'general';
  message: string;
}

// --- Challenge / verification ---

export interface WalletChallengeResponse {
  nonce: string;
  message: string;
}

export interface WalletVerifyPayload {
  walletAddress: string;
  nonce: string;
  message: string;
  /** Base64-encoded 64-byte Ed25519 signature */
  signature: string;
}

// --- Registration status (from /api/waitlist/status) ---

export interface WaitlistStatus {
  walletAddress: string | null;
  walletVerified: boolean;
  email: string | null;
  discordId: string | null;
  discordUsername: string | null;
  twitterId: string | null;
  twitterUsername: string | null;
}

// --- Zustand store ---

export interface WaitlistState {
  walletAddress: string | null;
  walletVerified: boolean;
  email: string | null;
  discordId: string | null;
  discordUsername: string | null;
  twitterId: string | null;
  twitterUsername: string | null;
  errors: WaitlistValidationError[];

  setWalletAddress: (address: string | null) => void;
  setWalletVerified: (verified: boolean) => void;
  setEmail: (email: string | null) => void;
  setDiscordLinked: (id: string, username: string) => void;
  setTwitterLinked: (id: string, username: string) => void;
  setDiscordUnlinked: () => void;
  setTwitterUnlinked: () => void;
  setErrors: (errors: WaitlistValidationError[]) => void;
  hydrateStatus: (status: WaitlistStatus) => void;
  reset: () => void;
}
