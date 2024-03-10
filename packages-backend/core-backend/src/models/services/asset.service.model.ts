import { Asset, ProviderType } from '@fishprovider/core';

import { AssetRepository, RepositoryGetManyResult, ServiceGetParams } from '..';

export type GetAssetsService = (params: ServiceGetParams<Asset> & {
  filter: {
    providerType: ProviderType,
  },
  repositories: {
    asset: AssetRepository
  },
}) => Promise<RepositoryGetManyResult<Asset>>;
