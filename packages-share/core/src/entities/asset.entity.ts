import { AccountType } from '..';

export interface Asset {
  _id: string
  accountType: AccountType;

  asset: string;
  assetId: string;
}
