import { AccountType, Asset } from '@fishprovider/core';

import { BaseGetManyResult, BaseGetOptions } from '..';

export interface AssetRepository {
  getAssets?: (
    filter: {
      accountType: AccountType,
    },
    options?: BaseGetOptions<Asset>,
  ) => Promise<BaseGetManyResult<Asset>>;
}
