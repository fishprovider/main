import { AccountType, Asset } from '@fishprovider/core';
import {
  AssetRepository,
  BaseGetManyResult,
} from '@fishprovider/repositories';

import { BaseGetServiceParams } from '..';

export type GetAssetsService = (params: BaseGetServiceParams<Asset> & {
  filter: {
    accountType: AccountType,
  },
  repositories: {
    asset: AssetRepository
  },
}) => Promise<BaseGetManyResult<Asset>>;
