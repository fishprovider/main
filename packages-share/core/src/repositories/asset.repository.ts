import {
  AccountType, Asset, BaseGetManyResult, BaseGetOptions,
} from '..';

export interface AssetRepository {
  getAssets?: (
    filter: {
      accountType: AccountType,
    },
    options?: BaseGetOptions<Asset>,
  ) => Promise<BaseGetManyResult<Asset>>;
}
