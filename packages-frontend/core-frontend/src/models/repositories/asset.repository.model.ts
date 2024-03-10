import { Asset, ProviderType } from '@fishprovider/core';

import { RepositoryGetManyResult, RepositoryGetOptions } from '..';

export interface AssetRepository {
  getAssets?: (
    filter: {
      providerType: ProviderType,
    },
    options?: RepositoryGetOptions<Asset>,
  ) => Promise<RepositoryGetManyResult<Asset>>;
}
