import {
  AccountType, Asset, AssetRepository, BaseGetManyResult, BaseGetServiceParams,
} from '..';

export type GetAssetsService = (params: BaseGetServiceParams<Asset> & {
  filter: {
    accountType: AccountType,
  },
  repositories: {
    asset: AssetRepository
  },
}) => Promise<BaseGetManyResult<Asset>>;
