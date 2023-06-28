import type { ProviderType } from '~constants/account';

interface Bar {
  _id: string;
  providerType: ProviderType;
  symbol: string;
  period: string;
  startAt: Date;

  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

export type { Bar };
