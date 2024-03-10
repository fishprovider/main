import {
  Asset, ProviderType,
} from '@fishprovider/core';

import { AssetRepository, BaseGetServiceParams, RepositoryGetManyResult } from '..';

export type GetAssetsService = (params: BaseGetServiceParams<Asset> & {
  filter: {
    providerType: ProviderType,
  },
  repositories: {
    asset: AssetRepository
  },
}) => Promise<RepositoryGetManyResult<Asset>>;
