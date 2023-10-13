import { AccountType } from '..';

export interface Asset {
  _id: string
  /** @deprecated use accountType instead */
  providerType: AccountType;
  accountType: AccountType;

  asset: string;
  assetId: string;
}
