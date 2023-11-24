import { ProviderType } from '..';

export interface Asset {
  _id: string
  providerType: ProviderType;

  asset: string;
  assetId: string;
}
