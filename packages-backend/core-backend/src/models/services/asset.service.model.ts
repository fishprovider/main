import {
  Asset, ProviderType,
} from '@fishprovider/core';

import {
  AssetRepository, BaseGetManyResult, BaseGetServiceParams,
} from '..';

export type GetAssetsService = (params: BaseGetServiceParams<Asset> & {
  filter: {
    providerType: ProviderType,
  },
  repositories: {
    asset: AssetRepository
  },
}) => Promise<BaseGetManyResult<Asset>>;
