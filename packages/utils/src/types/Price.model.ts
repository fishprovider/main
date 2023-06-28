import type { ProviderType } from '~constants/account';

interface Asset {
  _id: string;
  providerType: ProviderType;
  asset: string;
  assetId: string;
  digits: number;

  providerData?: Record<string, any>; // external
  updatedAt?: Date;
}

interface Price {
  _id: string;
  providerType: ProviderType;
  symbol: string;
  symbolId: string;
  baseAsset: string;
  quoteAsset: string;
  lotSize: number
  pipSize: number;
  digits: number;
  minVolume: number;
  maxVolume: number;

  last: number;
  time?: number;
  bid?: number;
  ask?: number;

  providerData?: Record<string, any>; // external
  updatedAt?: Date;
}

export type {
  Asset,
  Price,
};
